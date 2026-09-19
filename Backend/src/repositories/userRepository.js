import { db } from "../config/db.js";

export const userRepository = {
  async findById(id) {
    const [rows] = await db.query(
      "SELECT id, name, username, email, phone, session_version, created_at FROM clients WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    if (!email) return null;
    const [rows] = await db.query(
      "SELECT id, name, username, email, password, session_version FROM clients WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );
    return rows[0] || null;
  },

  async findByUsername(username) {
    if (!username) return null;
    const [rows] = await db.query(
      "SELECT id, name, username, email, session_version FROM clients WHERE username = ? LIMIT 1",
      [username.trim().toLowerCase()]
    );
    return rows[0] || null;
  },

  async isUsernameTaken(username) {
    if (!username) return false;
    const [rows] = await db.query(
      "SELECT id FROM clients WHERE username = ? LIMIT 1",
      [username.trim().toLowerCase()]
    );
    return rows.length > 0;
  },

  async create({ name, email, password, phone = "", username }) {
    const [result] = await db.query(
      "INSERT INTO clients (name, email, password, phone, username) VALUES (?, ?, ?, ?, ?)",
      [
        name.trim(),
        email.trim().toLowerCase(),
        password,
        phone ? phone.trim() : "",
        username.trim().toLowerCase(),
      ]
    );
    return {
      insertId: result.insertId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim().toLowerCase(),
    };
  },

  async updatePassword(id, hashedPassword) {
    await db.query(
      "UPDATE clients SET password = ?, reset_token = NULL, reset_token_expires = NULL, session_version = COALESCE(session_version, 1) + 1 WHERE id = ?",
      [hashedPassword, id]
    );
  },

  async updateSessionVersion(id) {
    await db.query(
      "UPDATE clients SET session_version = COALESCE(session_version, 1) + 1 WHERE id = ?",
      [id]
    );
  },

  async setResetToken(id, hashedToken, expires) {
    await db.query(
      "UPDATE clients SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
      [hashedToken, expires, id]
    );
  },

  async clearResetToken(id) {
    await db.query(
      "UPDATE clients SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [id]
    );
  },

  async findByValidResetToken(hashedToken) {
    if (!hashedToken) return null;
    const [rows] = await db.query(
      "SELECT id, email, username FROM clients WHERE reset_token = ? AND reset_token_expires > NOW() LIMIT 1",
      [hashedToken]
    );
    return rows[0] || null;
  },
};
