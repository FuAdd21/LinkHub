import { db } from "../config/db.js";

export const credentialRepository = {
  async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT id, user_id, title, issuer, year, url, position, created_at
       FROM credentials
       WHERE user_id = ?
       ORDER BY position ASC, year DESC, id DESC`,
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, user_id, title, issuer, year, url, position, created_at
       FROM credentials
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(userId, data) {
    const [maxPos] = await db.query(
      "SELECT COALESCE(MAX(position), -1) as maxPos FROM credentials WHERE user_id = ?",
      [userId]
    );
    const nextPos = (maxPos[0]?.maxPos ?? -1) + 1;

    const [result] = await db.query(
      `INSERT INTO credentials (user_id, title, issuer, year, url, position)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, data.title, data.issuer || null, data.year || null, data.url || null, nextPos]
    );

    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.title !== undefined) {
      fields.push("title = ?");
      values.push(data.title);
    }
    if (data.issuer !== undefined) {
      fields.push("issuer = ?");
      values.push(data.issuer || null);
    }
    if (data.year !== undefined) {
      fields.push("year = ?");
      values.push(data.year || null);
    }
    if (data.url !== undefined) {
      fields.push("url = ?");
      values.push(data.url || null);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await db.query(`UPDATE credentials SET ${fields.join(", ")} WHERE id = ?`, values);
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await db.query("DELETE FROM credentials WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
