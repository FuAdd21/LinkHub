import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { db } from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [existingUsers] = await db.query(
      "SELECT id FROM clients WHERE email = ? LIMIT 1",
      [normalizedEmail],
    );

    if (existingUsers.length > 0) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO clients (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name.trim(), normalizedEmail, hashedPassword, phone.trim()],
    );

    res.json({ message: "Client added securely!", clientId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT configuration is missing" });
    }

    const [results] = await db.query("SELECT * FROM clients WHERE email = ?", [
      email?.trim().toLowerCase(),
    ]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.json({
      message: "Login successful",
      userId: user.id,
      name: user.name,
      username: user.username,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT id, name, email, phone, username, bio, avatar, theme,
              background_type, background_value,
              youtubeId, githubUser, telegramUser, instagram, twitter, linkedin, tiktok
       FROM clients`,
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports = { register, login, getAllClients };
