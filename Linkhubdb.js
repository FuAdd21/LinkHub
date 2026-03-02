const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 3002;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const cors = require('cors');

// ----------------- CORS -----------------
app.use(
  cors({
    origin: 'http://localhost:5173', // Vite frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve avatar images

// ----------------- MySQL -----------------
const db = mysql.createConnection({
  host: 'localhost',
  user: 'appusers',
  password: '123mine',
  database: 'clientinfo',
});
db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL!');
});

// ----------------- JWT Middleware -----------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "🚫 No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "🚫 Invalid or expired token" });
    req.user = user;
    next();
  });
}

// ----------------- Multer Setup for Avatar -----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/avatars"),
  filename: (req, file, cb) => cb(null, `${req.user.id}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

// ----------------- Auth Routes -----------------

app.post('/newclients', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone)
    return res.status(400).json({ error: "All fields are required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO clients (name, email, password, phone) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, hashedPassword, phone], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Client added securely!", clientId: results.insertId });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM clients WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ message: 'Login successful', userId: user.id, name: user.name, token });
  });
});

// ----------------- Get all clients (protected) -----------------
app.get('/clients', authenticateToken, (req, res) => {
  db.query('SELECT * FROM clients', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ----------------- Links Routes -----------------
app.get('/api/mylinks', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.query('SELECT id, title, url FROM links WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/mylinks', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ message: "Title and URL are required" });

  db.query('INSERT INTO links (user_id, title, url) VALUES (?, ?, ?)', [userId, title, url], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Link created", linkId: result.insertId });
  });
});

app.put('/api/mylinks/:linkId', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { linkId } = req.params;
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ message: "Title and URL are required" });

  db.query(
    'UPDATE links SET title = ?, url = ? WHERE id = ? AND user_id = ?',
    [title, url, linkId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Link not found or not yours" });
      res.json({ message: "Link updated" });
    }
  );
});

app.delete('/api/mylinks/:linkId', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { linkId } = req.params;
  db.query('DELETE FROM links WHERE id = ? AND user_id = ?', [linkId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Link not found or not yours" });
    res.json({ message: "Link deleted" });
  });
});

// ----------------- Featured Users -----------------
app.get('/api/featured-users', (req, res) => {
  const query = `
    SELECT 
      c.id, c.name as username, c.email,
      l.id as link_id, l.title, l.url
    FROM clients c
    LEFT JOIN links l ON c.id = l.user_id
    ORDER BY c.id DESC
    LIMIT 10
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    if (!results || results.length === 0) return res.json([]);

    const featuredUsers = results.reduce((acc, row) => {
      const user = acc.find(u => u.username === row.username);
      if (!user) {
        acc.push({
          username: row.username,
          email: row.email,
          links: row.link_id ? [{ id: row.link_id, title: row.title, url: row.url }] : [],
        });
      } else if (row.link_id) {
        user.links.push({ id: row.link_id, title: row.title, url: row.url });
      }
      return acc;
    }, []);

    res.json(featuredUsers.slice(0, 5));
  });
});

// ----------------- Profile Picture Upload -----------------
app.put("/api/users/avatar", authenticateToken, upload.single("avatar"), (req, res) => {
  const avatarPath = `/uploads/avatars/${req.file.filename}`;
  const query = "UPDATE clients SET avatar = ? WHERE id = ?";
  db.query(query, [avatarPath, req.user.id], (err) => {
    if (err) return res.status(500).json({ message: "Database update failed" });
    res.json({ avatar: avatarPath });
  });
});

app.get("/api/users/me", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = "SELECT id, name, email, avatar FROM clients WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});

// ----------------- Start Server -----------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
