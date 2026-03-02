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

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO clients (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, phone],
    );

    res.json({ message: "Client added securely!", clientId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [results] = await db.query("SELECT * FROM clients WHERE email = ?", [
      email,
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
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      message: "Login successful",
      userId: user.id,
      name: user.name,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM clients");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports = { register, login, getAllClients };
