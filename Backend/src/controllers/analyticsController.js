import crypto from "crypto";
import { db } from "../config/db.js";

function hashIp(ip) {
  if (!ip) return null;
  const salt = process.env.IP_SALT || "linkhub_privacy_salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex").slice(0, 32);
}

function detectDevice(userAgent = "") {
  if (/tablet|ipad/i.test(userAgent)) {
    return "tablet";
  }
  if (/mobile|android|iphone/i.test(userAgent)) {
    return "mobile";
  }
  return "desktop";
}

// POST /api/analytics/click/:linkId — Track a link click (public)
export const trackClick = async (req, res) => {
  try {
    const { linkId } = req.params;
    const rawIp =
      req.headers["x-forwarded-for"] || req.connection?.remoteAddress || null;
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || null;

    const device = detectDevice(userAgent);
    const ip = hashIp(rawIp);

    // Verify the link exists
    const [links] = await db.query(
      "SELECT id, user_id FROM links WHERE id = ?",
      [linkId]
    );

    if (links.length === 0) {
      return res.status(404).json({ message: "Link not found" });
    }

    const userId = links[0].user_id;

    // Deduplicate clicks within 5 minutes for the same hashed IP
    if (ip) {
      const [recent] = await db.query(
        `SELECT id FROM clicks
         WHERE link_id = ? AND ip = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
         LIMIT 1`,
        [linkId, ip]
      );

      if (recent.length > 0) {
        return res.json({ message: "Click already recorded" });
      }
    }

    await db.query(
      `INSERT INTO clicks (link_id, user_id, ip, device, referrer) VALUES (?, ?, ?, ?, ?)`,
      [linkId, userId, ip, device, referrer]
    );

    res.json({ message: "Click tracked" });
  } catch (err) {
    console.error("trackClick error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/analytics/view/:username — Track a public profile page view (public)
export const trackProfileView = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }

    const [users] = await db.query(
      "SELECT id FROM clients WHERE username = ?",
      [username.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = users[0].id;
    const rawIp =
      req.headers["x-forwarded-for"] || req.connection?.remoteAddress || null;
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || null;

    const device = detectDevice(userAgent);
    const ip = hashIp(rawIp);

    // Deduplicate view within 5 minutes
    if (ip) {
      const [recent] = await db.query(
        `SELECT id FROM profile_views
         WHERE user_id = ? AND ip = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
         LIMIT 1`,
        [userId, ip]
      );

      if (recent.length > 0) {
        return res.json({ message: "View already recorded" });
      }
    }

    await db.query(
      `INSERT INTO profile_views (user_id, ip, device, referrer) VALUES (?, ?, ?, ?)`,
      [userId, ip, device, referrer]
    );

    res.json({ message: "Profile view tracked" });
  } catch (err) {
    console.error("trackProfileView error:", err);
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
    const [totalClicksResult] = await db.query(
      "SELECT COUNT(*) as total FROM clicks WHERE user_id = ?",
      [userId]
    );

    // Total profile views
    const [totalViewsResult] = await db.query(
      "SELECT COUNT(*) as total FROM profile_views WHERE user_id = ?",
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
    const [todayClicksResult] = await db.query(
      "SELECT COUNT(*) as today FROM clicks WHERE user_id = ? AND DATE(timestamp) = CURDATE()",
      [userId]
    );

    // Today's views
    const [todayViewsResult] = await db.query(
      "SELECT COUNT(*) as today FROM profile_views WHERE user_id = ? AND DATE(timestamp) = CURDATE()",
      [userId]
    );

    res.json({
      totalClicks: totalClicksResult[0].total,
      todayClicks: todayClicksResult[0].today,
      totalViews: totalViewsResult[0].total,
      todayViews: todayViewsResult[0].today,
      clicksPerDay,
      topLinks,
      deviceStats,
    });
  } catch (err) {
    console.error("getAnalytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
