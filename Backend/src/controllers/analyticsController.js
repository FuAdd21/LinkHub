import crypto from "crypto";
import { db } from "../config/db.js";
import { config } from "../config/env.js";

export function hashIp(ip) {
  if (!ip) return null;
  const salt = config.analytics.ipSalt;
  if (!salt && config.isProd) {
    throw new Error("CRITICAL: IP_SALT environment variable is required in production");
  }
  const effectiveSalt = salt || "linkhub_dev_ip_salt_not_for_production";
  return crypto.createHash("sha256").update(ip + effectiveSalt).digest("hex").slice(0, 32);
}

export function detectDevice(userAgent = "") {
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
    const clientIp = req.ip || null;
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || null;

    const device = detectDevice(userAgent);
    const ip = hashIp(clientIp);

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
    const clientIp = req.ip || null;
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || null;

    const device = detectDevice(userAgent);
    const ip = hashIp(clientIp);


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
    const totalClicks = totalClicksResult[0]?.total || 0;

    // Total profile views
    const [totalViewsResult] = await db.query(
      "SELECT COUNT(*) as total FROM profile_views WHERE user_id = ?",
      [userId]
    );
    const totalViews = totalViewsResult[0]?.total || 0;

    // Unique visitors (distinct IPs across views and clicks)
    const [uniqueVisitorsResult] = await db.query(
      `SELECT COUNT(DISTINCT ip) as total FROM (
        SELECT ip FROM clicks WHERE user_id = ? AND ip IS NOT NULL
        UNION
        SELECT ip FROM profile_views WHERE user_id = ? AND ip IS NOT NULL
      ) as visitors`,
      [userId, userId]
    );
    const uniqueVisitors = uniqueVisitorsResult[0]?.total || 0;

    // Click-through rate
    const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0.00";

    // Clicks per day (last 30 days)
    const [clicksPerDay] = await db.query(
      `SELECT DATE(timestamp) as date, COUNT(*) as clicks
       FROM clicks
       WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(timestamp)
       ORDER BY date ASC`,
      [userId]
    );

    // Views per day (last 30 days)
    const [viewsPerDay] = await db.query(
      `SELECT DATE(timestamp) as date, COUNT(*) as views
       FROM profile_views
       WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(timestamp)
       ORDER BY date ASC`,
      [userId]
    );

    // Prior 30 days comparison for trends
    const [currClicksRes] = await db.query(
      "SELECT COUNT(*) as c FROM clicks WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
      [userId]
    );
    const [prevClicksRes] = await db.query(
      "SELECT COUNT(*) as c FROM clicks WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY)",
      [userId]
    );
    const [currViewsRes] = await db.query(
      "SELECT COUNT(*) as c FROM profile_views WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
      [userId]
    );
    const [prevViewsRes] = await db.query(
      "SELECT COUNT(*) as c FROM profile_views WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY)",
      [userId]
    );
    const [currVisitorsRes] = await db.query(
      `SELECT COUNT(DISTINCT ip) as total FROM (
        SELECT ip FROM clicks WHERE user_id = ? AND ip IS NOT NULL AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        UNION
        SELECT ip FROM profile_views WHERE user_id = ? AND ip IS NOT NULL AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      ) as v`,
      [userId, userId]
    );
    const [prevVisitorsRes] = await db.query(
      `SELECT COUNT(DISTINCT ip) as total FROM (
        SELECT ip FROM clicks WHERE user_id = ? AND ip IS NOT NULL AND timestamp >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY)
        UNION
        SELECT ip FROM profile_views WHERE user_id = ? AND ip IS NOT NULL AND timestamp >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY)
      ) as v`,
      [userId, userId]
    );

    const calcDelta = (curr, prev) => {
      if (prev === 0) return curr > 0 ? "+100%" : "+0.0%";
      const delta = (((curr - prev) / prev) * 100).toFixed(1);
      return delta >= 0 ? `+${delta}%` : `${delta}%`;
    };

    const currViewsCount = currViewsRes[0]?.c || 0;
    const prevViewsCount = prevViewsRes[0]?.c || 0;
    const currClicksCount = currClicksRes[0]?.c || 0;
    const prevClicksCount = prevClicksRes[0]?.c || 0;
    const currVisitorsCount = currVisitorsRes[0]?.total || 0;
    const prevVisitorsCount = prevVisitorsRes[0]?.total || 0;

    const currRateVal = currViewsCount > 0 ? (currClicksCount / currViewsCount) * 100 : 0;
    const prevRateVal = prevViewsCount > 0 ? (prevClicksCount / prevViewsCount) * 100 : 0;

    const deltas = {
      views: calcDelta(currViewsCount, prevViewsCount),
      clicks: calcDelta(currClicksCount, prevClicksCount),
      rate: calcDelta(currRateVal, prevRateVal),
      visitors: calcDelta(currVisitorsCount, prevVisitorsCount),
    };

    // Top links by clicks with conversion rate
    const [topLinksRaw] = await db.query(
      `SELECT l.id, l.title, l.url, l.platform, COUNT(c.id) as clicks
       FROM links l
       LEFT JOIN clicks c ON c.link_id = l.id
       WHERE l.user_id = ?
       GROUP BY l.id, l.title, l.url, l.platform
       ORDER BY clicks DESC
       LIMIT 10`,
      [userId]
    );

    const topLinks = topLinksRaw.map((l) => ({
      ...l,
      clicks: Number(l.clicks) || 0,
      conversionRate:
        totalViews > 0
          ? ((Number(l.clicks) / totalViews) * 100).toFixed(1) + "%"
          : "0.0%",
      change: "0.0%",
    }));

    // Clicks & views by device
    const [deviceStatsRaw] = await db.query(
      `SELECT device, COUNT(*) as count FROM (
        SELECT device FROM clicks WHERE user_id = ?
        UNION ALL
        SELECT device FROM profile_views WHERE user_id = ?
      ) as combined
      GROUP BY device`,
      [userId, userId]
    );

    const totalDeviceCount = deviceStatsRaw.reduce((acc, row) => acc + (row.count || 0), 0);
    const deviceMap = { mobile: 0, desktop: 0, tablet: 0 };
    deviceStatsRaw.forEach((row) => {
      const dev = (row.device || "").toLowerCase();
      if (dev.includes("mobile") || dev.includes("iphone") || dev.includes("android")) {
        deviceMap.mobile += row.count;
      } else if (dev.includes("tablet") || dev.includes("ipad")) {
        deviceMap.tablet += row.count;
      } else {
        deviceMap.desktop += row.count;
      }
    });

    const deviceMix = {
      mobile: totalDeviceCount > 0 ? Math.round((deviceMap.mobile / totalDeviceCount) * 100) : 0,
      desktop: totalDeviceCount > 0 ? Math.round((deviceMap.desktop / totalDeviceCount) * 100) : 0,
      tablet: totalDeviceCount > 0 ? Math.round((deviceMap.tablet / totalDeviceCount) * 100) : 0,
    };


    // Today's clicks & views
    const [todayClicksResult] = await db.query(
      "SELECT COUNT(*) as today FROM clicks WHERE user_id = ? AND DATE(timestamp) = CURDATE()",
      [userId]
    );
    const [todayViewsResult] = await db.query(
      "SELECT COUNT(*) as today FROM profile_views WHERE user_id = ? AND DATE(timestamp) = CURDATE()",
      [userId]
    );

    // Live recent activity
    const [recentActivity] = await db.query(
      `(
        SELECT c.id, 'click' as type, c.device, c.referrer, c.timestamp, l.title as link_title, l.platform
        FROM clicks c
        JOIN links l ON c.link_id = l.id
        WHERE c.user_id = ?
        ORDER BY c.timestamp DESC
        LIMIT 6
      )
      UNION ALL
      (
        SELECT v.id, 'view' as type, v.device, v.referrer, v.timestamp, NULL as link_title, NULL as platform
        FROM profile_views v
        WHERE v.user_id = ?
        ORDER BY v.timestamp DESC
        LIMIT 6
      )
      ORDER BY timestamp DESC
      LIMIT 8`,
      [userId, userId]
    );

    res.json({
      totalClicks,
      todayClicks: todayClicksResult[0]?.today || 0,
      totalViews,
      todayViews: todayViewsResult[0]?.today || 0,
      uniqueVisitors,
      clickRate,
      deltas,
      clicksPerDay,
      viewsPerDay,
      topLinks,
      deviceStats: deviceStatsRaw,
      deviceMix,
      recentActivity,
    });
  } catch (err) {
    console.error("getAnalytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
