import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { db } from "../config/db.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

function validatePassword(password) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return "Password must be at least 8 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
}

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

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

    // Auto-generate clean unique username
    const baseUsername = (
      name.trim().toLowerCase().replace(/[^a-z0-9]/g, "") ||
      normalizedEmail.split("@")[0].replace(/[^a-z0-9]/g, "")
    ).slice(0, 20);

    let candidateUsername = baseUsername || "user";
    let counter = 1;
    while (true) {
      const [existing] = await db.query(
        "SELECT id FROM clients WHERE username = ? LIMIT 1",
        [candidateUsername]
      );
      if (existing.length === 0) break;
      candidateUsername = `${baseUsername}${counter++}`;
    }

    const [result] = await db.query(
      "INSERT INTO clients (name, email, password, phone, username) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), normalizedEmail, hashedPassword, phone ? phone.trim() : "", candidateUsername],
    );

    res.json({
      message: "Account created successfully!",
      clientId: result.insertId,
      username: candidateUsername,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET is not configured");
      return res.status(500).json({ message: "Server configuration error" });
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
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ message: "A valid email address is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const [users] = await db.query("SELECT id FROM clients WHERE email = ?", [
      cleanEmail,
    ]);

    if (users.length > 0) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      // Expire in 1 hour
      const expires = new Date(Date.now() + 3600000);

      await db.query(
        "UPDATE clients SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
        [resetToken, expires, users[0].id]
      );

      console.log(`[PASSWORD_RESET] Token for ${cleanEmail}: ${resetToken}`);
    }

    // Always respond with success to prevent email enumeration
    res.json({
      message:
        "If that email exists in our system, recovery instructions have been dispatched.",
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Recovery request failed. Please try again." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Reset token and new password are required" });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const [users] = await db.query(
      "SELECT id FROM clients WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );

    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "Reset token is invalid or has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE clients SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashedPassword, users[0].id]
    );

    res.json({ message: "Password reset successful. You may now log in with your new password." });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Password reset failed. Please try again." });
  }
};
