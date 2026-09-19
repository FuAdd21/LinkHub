import { db } from "../config/db.js";

export const integrationRepository = {
  /**
   * Retrieves all integrations for a user
   */
  async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT id, user_id, provider, status, config, last_synced_at, created_at
       FROM integrations
       WHERE user_id = ?
       ORDER BY created_at ASC`,
      [userId]
    );

    return rows.map((r) => ({
      ...r,
      config: typeof r.config === "string" ? JSON.parse(r.config) : (r.config || {}),
    }));
  },

  /**
   * Retrieves a specific integration by user and provider
   */
  async findByUserAndProvider(userId, provider) {
    const [rows] = await db.query(
      `SELECT id, user_id, provider, status, config, last_synced_at, created_at
       FROM integrations
       WHERE user_id = ? AND provider = ?
       LIMIT 1`,
      [userId, provider.toLowerCase()]
    );

    if (rows.length === 0) return null;

    const r = rows[0];
    return {
      ...r,
      config: typeof r.config === "string" ? JSON.parse(r.config) : (r.config || {}),
    };
  },

  /**
   * Upserts an integration configuration
   */
  async upsert(userId, provider, { status = "connected", config = {} }) {
    const serializedConfig = typeof config === "string" ? config : JSON.stringify(config);
    const p = provider.toLowerCase();

    await db.query(
      `INSERT INTO integrations (user_id, provider, status, config, last_synced_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         config = VALUES(config),
         last_synced_at = NOW()`,
      [userId, p, status, serializedConfig]
    );

    return this.findByUserAndProvider(userId, p);
  },

  /**
   * Deletes an integration by user and provider
   */
  async delete(userId, provider) {
    const [result] = await db.query(
      `DELETE FROM integrations WHERE user_id = ? AND provider = ?`,
      [userId, provider.toLowerCase()]
    );
    return result.affectedRows > 0;
  },

  /**
   * Updates last_synced_at timestamp
   */
  async updateSyncTime(userId, provider) {
    const [result] = await db.query(
      `UPDATE integrations SET last_synced_at = NOW() WHERE user_id = ? AND provider = ?`,
      [userId, provider.toLowerCase()]
    );
    return result.affectedRows > 0;
  },
};
