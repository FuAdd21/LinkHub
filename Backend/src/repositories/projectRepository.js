import { db } from "../config/db.js";

export const projectRepository = {
  async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT id, user_id, title, description, url, image_url, role, technologies, featured, position, created_at, updated_at
       FROM projects
       WHERE user_id = ?
       ORDER BY position ASC, id DESC`,
      [userId]
    );
    return rows.map((r) => ({
      ...r,
      technologies: typeof r.technologies === "string" ? JSON.parse(r.technologies) : (r.technologies || []),
      featured: Boolean(r.featured),
    }));
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, user_id, title, description, url, image_url, role, technologies, featured, position, created_at, updated_at
       FROM projects
       WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      technologies: typeof r.technologies === "string" ? JSON.parse(r.technologies) : (r.technologies || []),
      featured: Boolean(r.featured),
    };
  },

  async countByUserId(userId) {
    const [rows] = await db.query(
      "SELECT COUNT(*) as total FROM projects WHERE user_id = ?",
      [userId]
    );
    return rows[0]?.total || 0;
  },

  async create(userId, data) {
    const [maxPos] = await db.query(
      "SELECT COALESCE(MAX(position), -1) as maxPos FROM projects WHERE user_id = ?",
      [userId]
    );
    const nextPos = (maxPos[0]?.maxPos ?? -1) + 1;

    const [result] = await db.query(
      `INSERT INTO projects (user_id, title, description, url, image_url, role, technologies, featured, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.title,
        data.description || null,
        data.url || null,
        data.image_url || null,
        data.role || null,
        data.technologies ? JSON.stringify(data.technologies) : null,
        data.featured ? 1 : 0,
        nextPos,
      ]
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
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.url !== undefined) {
      fields.push("url = ?");
      values.push(data.url || null);
    }
    if (data.image_url !== undefined) {
      fields.push("image_url = ?");
      values.push(data.image_url || null);
    }
    if (data.role !== undefined) {
      fields.push("role = ?");
      values.push(data.role || null);
    }
    if (data.technologies !== undefined) {
      fields.push("technologies = ?");
      values.push(data.technologies ? JSON.stringify(data.technologies) : null);
    }
    if (data.featured !== undefined) {
      fields.push("featured = ?");
      values.push(data.featured ? 1 : 0);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await db.query(`UPDATE projects SET ${fields.join(", ")} WHERE id = ?`, values);
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await db.query("DELETE FROM projects WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  async reorder(userId, projectIds) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      for (let i = 0; i < projectIds.length; i++) {
        await connection.query(
          "UPDATE projects SET position = ? WHERE id = ? AND user_id = ?",
          [i, projectIds[i], userId]
        );
      }
      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};
