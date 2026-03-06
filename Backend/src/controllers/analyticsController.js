import { db } from "../config/db.js";

// POST /api/analytics/click/:linkId — Track a link click (public)
export const trackClick = async (req, res) => {
  try {
    const { linkId } = req.params;
    const ip =
      req.headers["x-forwarded-for"] || req.connection?.remoteAddress || null;
    const userAgent = req.headers["user-agent"] || "";

    // Detect device type from user agent
    let device = "desktop";
    if (/mobile|android|iphone|ipad/i.test(userAgent)) {
      device = "mobile";
    } else if (/tablet|ipad/i.test(userAgent)) {
      device = "tablet";
    }

    const referrer = req.headers["referer"] || null;

    // Verify the link exists
    const [links] = await db.query("SELECT id, user_id FROM links WHERE id = ?", [
      linkId,
    ]);

    if (links.length === 0) {
      return res.status(404).json({ message: "Link not found" });
    }

    await db.query(
      `INSERT INTO clicks (link_id, user_id, ip, device, referrer) VALUES (?, ?, ?, ?, ?)`,
      [linkId, links[0].user_id, ip, device, referrer]
    );

    res.json({ message: "Click tracked" });
  } catch (err) {
    console.error("trackClick error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/analytics — Get analytics for authenticated user
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Total clicks
    const [totalResult] = await db.query(
      "SELECT COUNT(*) as total FROM clicks WHERE user_id = ?",
      [userId]
    );

    // Clicks per day (last 30 days)
    const [clicksPerDay] = await db.query(
      `SELECT DATE(timestamp) as date, COUNT(*) as clicks
       FROM clicks
       WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(timestamp)
       ORDER BY date ASC`,
      [userId]
    );

    // Top links by clicks
    const [topLinks] = await db.query(
      `SELECT l.id, l.title, l.url, l.platform, COUNT(c.id) as clicks
       FROM links l
       LEFT JOIN clicks c ON c.link_id = l.id
       WHERE l.user_id = ?
       GROUP BY l.id, l.title, l.url, l.platform
       ORDER BY clicks DESC
       LIMIT 10`,
      [userId]
    );

    // Clicks by device
    const [deviceStats] = await db.query(
      `SELECT device, COUNT(*) as clicks
       FROM clicks
       WHERE user_id = ?
       GROUP BY device`,
      [userId]
    );

    // Today's clicks
    const [todayResult] = await db.query(
      "SELECT COUNT(*) as today FROM clicks WHERE user_id = ? AND DATE(timestamp) = CURDATE()",
      [userId]
    );

    res.json({
      totalClicks: totalResult[0].total,
      todayClicks: todayResult[0].today,
      clicksPerDay,
      topLinks,
      deviceStats,
    });
  } catch (err) {
    console.error("getAnalytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
