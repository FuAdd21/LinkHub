import { db } from "../config/db.js";

export const linkRepository = {
  /**
   * Returns all links for a user with click analytics and conversion calculations
   */
  async findByUserId(userId, { includeHidden = true } = {}) {
    let query = `
      SELECT l.id, l.title, l.url, l.platform, l.username, l.profileData, l.avatar_url, l.icon,
             COALESCE(l.display_mode, 'link') as display_mode, l.position, l.is_visible, l.scheduled_at,
             COUNT(c.id) as clicks
      FROM links l
      LEFT JOIN clicks c ON c.link_id = l.id
      WHERE l.user_id = ?
    `;

    if (!includeHidden) {
      query += ` AND l.is_visible = 1 AND (l.scheduled_at IS NULL OR l.scheduled_at <= NOW())`;
    }

    query += ` GROUP BY l.id ORDER BY l.position ASC, l.id DESC`;

    const [rows] = await db.query(query, [userId]);
    return rows;
  },

  /**
   * Finds a single link strictly scoped by user_id
   */
  async findById(id, userId) {
    const [rows] = await db.query(
      `SELECT * FROM links WHERE id = ? AND user_id = ? LIMIT 1`,
      [id, userId]
    );
    return rows[0] || null;
  },

  /**
   * Finds a link by ID for redirection (includes owner info)
   */
  async findByIdForRedirect(id) {
    const [rows] = await db.query(
      `SELECT l.id, l.user_id, l.url, l.is_visible, l.scheduled_at, u.username
       FROM links l
       JOIN clients u ON u.id = l.user_id
       WHERE l.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Returns total count of links owned by a user
   */
  async countByUserId(userId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) as total FROM links WHERE user_id = ?`,
      [userId]
    );
    return Number(rows[0]?.total) || 0;
  },

  /**
   * Creates a new link and returns its created record
   */
  async create({
    userId,
    title,
    url,
    platform = null,
    username = null,
    profileData = null,
    avatar_url = null,
    icon = null,
    display_mode = "link",
    position = 0,
    scheduled_at = null,
  }) {
    const [result] = await db.query(
      `INSERT INTO links (user_id, title, url, platform, username, profileData, avatar_url, icon, display_mode, position, scheduled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        url,
        platform,
        username,
        profileData ? (typeof profileData === "string" ? profileData : JSON.stringify(profileData)) : null,
        avatar_url,
        icon,
        display_mode,
        position,
        scheduled_at || null,
      ]
    );

    const [rows] = await db.query("SELECT * FROM links WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  /**
   * Updates an existing link scoped to user_id
   */
  async update(id, userId, updates) {
    const setClauses = [];
    const values = [];

    const allowedFields = [
      "title",
      "url",
      "platform",
      "username",
      "profileData",
      "avatar_url",
      "icon",
      "display_mode",
      "is_visible",
      "scheduled_at",
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        if (field === "profileData" && updates[field] !== null && typeof updates[field] === "object") {
          values.push(JSON.stringify(updates[field]));
        } else {
          values.push(updates[field]);
        }
      }
    }

    if (setClauses.length === 0) return null;

    values.push(id, userId);
    const [result] = await db.query(
      `UPDATE links SET ${setClauses.join(", ")} WHERE id = ? AND user_id = ?`,
      values
    );

    if (result.affectedRows === 0) return null;

    const [rows] = await db.query("SELECT * FROM links WHERE id = ?", [id]);
    return rows[0];
  },

  /**
   * Deletes a link scoped to user_id
   */
  async delete(id, userId) {
    const [result] = await db.query(
      "DELETE FROM links WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  /**
   * Transactionally reorders user links given an ordered list of IDs
   */
  async reorder(userId, orderedIds) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) return false;

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Ensure all IDs belong to this user
      const placeholders = orderedIds.map(() => "?").join(",");
      const [userLinks] = await connection.query(
        `SELECT id FROM links WHERE user_id = ? AND id IN (${placeholders})`,
        [userId, ...orderedIds]
      );

      if (userLinks.length !== orderedIds.length) {
        await connection.rollback();
        throw new Error("Invalid link IDs provided for reordering or links belong to another user");
      }

      for (let i = 0; i < orderedIds.length; i++) {
        await connection.query(
          "UPDATE links SET position = ? WHERE id = ? AND user_id = ?",
          [i, orderedIds[i], userId]
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

  /**
   * Retrieves public links for profile rendering
   */
  async findPublicByUserId(userId) {
    const [rows] = await db.query(
      `SELECT id, title, url, platform, username, profileData, avatar_url, icon,
              COALESCE(display_mode, 'link') as display_mode, position, scheduled_at
       FROM links
       WHERE user_id = ? AND is_visible = 1
         AND (scheduled_at IS NULL OR scheduled_at <= NOW())
       ORDER BY position ASC, id DESC`,
      [userId]
    );
    return rows;
  },
};
