import { db } from "../config/db.js";

export const analyticsRepository = {
  /**
   * Finds a recent click from the same hashed IP within window (default 5 min)
   */
  async findRecentClick(linkId, ip, minutes = 5) {
    if (!ip) return null;
    const [rows] = await db.query(
      `SELECT id FROM clicks
       WHERE link_id = ? AND ip = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
       LIMIT 1`,
      [linkId, ip, minutes]
    );
    return rows[0] || null;
  },

  /**
   * Records a link click
   */
  async recordClick({ linkId, userId, ip, device, referrer }) {
    const [result] = await db.query(
      `INSERT INTO clicks (link_id, user_id, ip, device, referrer) VALUES (?, ?, ?, ?, ?)`,
      [linkId, userId, ip, device, referrer]
    );
    return result.insertId;
  },

  /**
   * Finds a recent profile view from the same hashed IP within window
   */
  async findRecentProfileView(userId, ip, minutes = 5) {
    if (!ip) return null;
    const [rows] = await db.query(
      `SELECT id FROM profile_views
       WHERE user_id = ? AND ip = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
       LIMIT 1`,
      [userId, ip, minutes]
    );
    return rows[0] || null;
  },

  /**
   * Records a public profile page view
   */
  async recordProfileView({ userId, ip, device, referrer }) {
    const [result] = await db.query(
      `INSERT INTO profile_views (user_id, ip, device, referrer) VALUES (?, ?, ?, ?)`,
      [userId, ip, device, referrer]
    );
    return result.insertId;
  },

  /**
   * Total clicks for user
   */
  async getTotalClicks(userId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) as total FROM clicks WHERE user_id = ?`,
      [userId]
    );
    return Number(rows[0]?.total) || 0;
  },

  /**
   * Total views for user
   */
  async getTotalViews(userId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) as total FROM profile_views WHERE user_id = ?`,
      [userId]
    );
    return Number(rows[0]?.total) || 0;
  },

  /**
   * Unique visitors (distinct IPs across views and clicks)
   */
  async getUniqueVisitors(userId) {
    const [rows] = await db.query(
      `SELECT COUNT(DISTINCT ip) as total FROM (
        SELECT ip FROM clicks WHERE user_id = ? AND ip IS NOT NULL
        UNION
        SELECT ip FROM profile_views WHERE user_id = ? AND ip IS NOT NULL
      ) as visitors`,
      [userId, userId]
    );
    return Number(rows[0]?.total) || 0;
  },

  /**
   * Daily clicks time-series for user
   */
  async getClicksPerDay(userId, days = 30) {
    const [rows] = await db.query(
      `SELECT DATE(timestamp) as date, COUNT(*) as clicks
       FROM clicks
       WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(timestamp)
       ORDER BY date ASC`,
      [userId, days]
    );
    return rows;
  },

  /**
   * Daily views time-series for user
   */
  async getViewsPerDay(userId, days = 30) {
    const [rows] = await db.query(
      `SELECT DATE(timestamp) as date, COUNT(*) as views
       FROM profile_views
       WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(timestamp)
       ORDER BY date ASC`,
      [userId, days]
    );
    return rows;
  },

  /**
   * Comparison windows (current period vs prior period)
   */
  async getComparisonMetrics(userId, days = 30) {
    const doubleDays = days * 2;

    const [currClicksRes] = await db.query(
      "SELECT COUNT(*) as c FROM clicks WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)",
      [userId, days]
    );
    const [prevClicksRes] = await db.query(
      "SELECT COUNT(*) as c FROM clicks WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY) AND timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)",
      [userId, doubleDays, days]
    );
    const [currViewsRes] = await db.query(
      "SELECT COUNT(*) as c FROM profile_views WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)",
      [userId, days]
    );
    const [prevViewsRes] = await db.query(
      "SELECT COUNT(*) as c FROM profile_views WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY) AND timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)",
      [userId, doubleDays, days]
    );
    const [currVisitorsRes] = await db.query(
      `SELECT COUNT(DISTINCT ip) as total FROM (
        SELECT ip FROM clicks WHERE user_id = ? AND ip IS NOT NULL AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
        UNION
        SELECT ip FROM profile_views WHERE user_id = ? AND ip IS NOT NULL AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ) as v`,
      [userId, days, userId, days]
    );
    const [prevVisitorsRes] = await db.query(
      `SELECT COUNT(DISTINCT ip) as total FROM (
        SELECT ip FROM clicks WHERE user_id = ? AND ip IS NOT NULL AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY) AND timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
        UNION
        SELECT ip FROM profile_views WHERE user_id = ? AND ip IS NOT NULL AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY) AND timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
      ) as v`,
      [userId, doubleDays, days, userId, doubleDays, days]
    );

    return {
      currViews: Number(currViewsRes[0]?.c) || 0,
      prevViews: Number(prevViewsRes[0]?.c) || 0,
      currClicks: Number(currClicksRes[0]?.c) || 0,
      prevClicks: Number(prevClicksRes[0]?.c) || 0,
      currVisitors: Number(currVisitorsRes[0]?.total) || 0,
      prevVisitors: Number(prevVisitorsRes[0]?.total) || 0,
    };
  },

  /**
   * Top links by click count
   */
  async getTopLinks(userId, limit = 10) {
    const [rows] = await db.query(
      `SELECT l.id, l.title, l.url, l.platform, COUNT(c.id) as clicks
       FROM links l
       LEFT JOIN clicks c ON c.link_id = l.id
       WHERE l.user_id = ?
       GROUP BY l.id, l.title, l.url, l.platform
       ORDER BY clicks DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  },

  /**
   * Device distribution for user clicks
   */
  async getDeviceStats(userId, days = 30) {
    const [rows] = await db.query(
      `SELECT device, COUNT(*) as count
       FROM clicks
       WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY device
       ORDER BY count DESC`,
      [userId, days]
    );
    return rows;
  },

  /**
   * Referrer distribution for user clicks
   */
  async getReferrerStats(userId, days = 30) {
    const [rows] = await db.query(
      `SELECT referrer, COUNT(*) as count
       FROM clicks
       WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY referrer
       ORDER BY count DESC
       LIMIT 10`,
      [userId, days]
    );
    return rows;
  },
};
