import { db } from "../config/db.js";
import { detectPlatform } from "../utils/detectPlatform.js";
import { fetchProfileData } from "../services/profileFetcher.js";
import { fetchSocialProfile } from "../services/socialFetchService.js";

const MAX_LINKS_PER_USER = parseInt(process.env.MAX_LINKS_PER_USER, 10) || 50;

function isValidUrl(string) {
  try {
    const parsed = new URL(string);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const getLinks = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token - no user id" });
    }

    // Get total profile views for conversion rate calculation
    const [viewsRes] = await db.query(
      "SELECT COUNT(*) as total FROM profile_views WHERE user_id = ?",
      [userId]
    );
    const totalViews = Number(viewsRes[0]?.total) || 0;

    const [results] = await db.query(
      `SELECT l.id, l.title, l.url, l.platform, l.username, l.profileData, l.avatar_url, l.icon, l.position, l.is_visible, l.scheduled_at,
              COUNT(c.id) as clicks
       FROM links l
       LEFT JOIN clicks c ON c.link_id = l.id
       WHERE l.user_id = ?
       GROUP BY l.id
       ORDER BY l.position ASC, l.id DESC`,
      [userId]
    );

    const parsed = results.map((link) => {
      const clicksCount = Number(link.clicks) || 0;
      const convRate = totalViews > 0
        ? ((clicksCount / totalViews) * 100).toFixed(1) + "%"
        : (clicksCount > 0 ? "100.0%" : "0.0%");

      return {
        ...link,
        clicks: clicksCount,
        conversionRate: convRate,
        profileData:
          typeof link.profileData === "string"
            ? JSON.parse(link.profileData)
            : link.profileData,
      };
    });

    res.json(parsed);
  } catch (err) {
    console.error("getLinks error:", err);
    res.status(500).json({ message: "Failed to retrieve links" });
  }
};

export const createLink = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, url, icon, scheduled_at } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required" });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        message: "Invalid URL format. URL must start with http:// or https://",
      });
    }

    // Check link limit
    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM links WHERE user_id = ?",
      [userId]
    );
    if (countResult[0].total >= MAX_LINKS_PER_USER) {
      return res.status(400).json({
        message: `Maximum link limit reached (${MAX_LINKS_PER_USER} links). Delete unused links to add more.`,
      });
    }

    // Detect platform and extract username
    const platformInfo = detectPlatform(url);
    let profileData = null;
    let username = platformInfo.username;
    let avatar_url = null;

    // Fetch profile data if platform is supported
    if (platformInfo.platform && platformInfo.username) {
      try {
        profileData = await fetchProfileData(
          platformInfo.platform,
          platformInfo.username
        );
      } catch (fetchErr) {
        console.log(
          "Profile fetch failed, continuing without metadata:",
          fetchErr.message
        );
      }

      // Also fetch social profile for avatar
      try {
        const socialResult = await fetchSocialProfile(url);
        if (socialResult.success && socialResult.avatar) {
          avatar_url = socialResult.avatar;
        }
      } catch (socialErr) {
        console.log("Social profile fetch failed:", socialErr.message);
      }
    }

    // Get max position for this user
    const [maxPos] = await db.query(
      "SELECT COALESCE(MAX(position), -1) as maxPos FROM links WHERE user_id = ?",
      [userId]
    );
    const nextPosition = maxPos[0].maxPos + 1;

    // Auto-detect icon from platform if not provided
    const linkIcon = icon || platformInfo.platform || null;

    const [result] = await db.query(
      `INSERT INTO links (user_id, title, url, platform, username, profileData, avatar_url, icon, position, is_visible, scheduled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        userId,
        title,
        url,
        platformInfo.platform,
        username,
        profileData ? JSON.stringify(profileData) : null,
        avatar_url,
        linkIcon,
        nextPosition,
        scheduled_at || null,
      ]
    );

    const [newLink] = await db.query("SELECT * FROM links WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      message: "Link created",
      link: {
        ...newLink[0],
        profileData:
          typeof newLink[0].profileData === "string"
            ? JSON.parse(newLink[0].profileData)
            : newLink[0].profileData,
      },
    });
  } catch (err) {
    console.error("createLink error:", err);
    res.status(500).json({ message: "Failed to create link" });
  }
};

export const updateLink = async (req, res) => {
  try {
    const userId = req.user.id;
    const { linkId } = req.params;
    const { title, url, icon, scheduled_at } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required" });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        message: "Invalid URL format. URL must start with http:// or https://",
      });
    }

    // Re-detect platform on update
    const platformInfo = detectPlatform(url);
    let profileData = null;
    let username = platformInfo.username;
    let avatar_url = null;

    if (platformInfo.platform && platformInfo.username) {
      try {
        profileData = await fetchProfileData(
          platformInfo.platform,
          platformInfo.username
        );
      } catch (fetchErr) {
        console.log("Profile fetch failed:", fetchErr.message);
      }

      try {
        const socialResult = await fetchSocialProfile(url);
        if (socialResult.success && socialResult.avatar) {
          avatar_url = socialResult.avatar;
        }
      } catch (socialErr) {
        console.log("Social profile fetch failed:", socialErr.message);
      }
    }

    const linkIcon = icon || platformInfo.platform || null;

    const [result] = await db.query(
      `UPDATE links SET title = ?, url = ?, platform = ?, username = ?, profileData = ?, avatar_url = ?, icon = ?, scheduled_at = ?
       WHERE id = ? AND user_id = ?`,
      [
        title,
        url,
        platformInfo.platform,
        username,
        profileData ? JSON.stringify(profileData) : null,
        avatar_url,
        linkIcon,
        scheduled_at || null,
        linkId,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Link not found or not yours" });
    }

    const [updatedLink] = await db.query("SELECT * FROM links WHERE id = ?", [
      linkId,
    ]);

    res.json({
      message: "Link updated",
      link: {
        ...updatedLink[0],
        profileData:
          typeof updatedLink[0].profileData === "string"
            ? JSON.parse(updatedLink[0].profileData)
            : updatedLink[0].profileData,
      },
    });
  } catch (err) {
    console.error("updateLink error:", err);
    res.status(500).json({ message: "Failed to update link" });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const userId = req.user.id;
    const { linkId } = req.params;

    const [result] = await db.query(
      "DELETE FROM links WHERE id = ? AND user_id = ?",
      [linkId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Link not found or not yours" });
    }

    res.json({ message: "Link deleted" });
  } catch (err) {
    console.error("deleteLink error:", err);
    res.status(500).json({ message: "Failed to delete link" });
  }
};

export const reorderLinks = async (req, res) => {
  let connection;
  try {
    const userId = req.user.id;
    const { order } = req.body;

    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: "Invalid order array" });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Update each link's position inside transaction
    for (let i = 0; i < order.length; i++) {
      await connection.query(
        "UPDATE links SET position = ? WHERE id = ? AND user_id = ?",
        [i, order[i], userId]
      );
    }

    await connection.commit();
    res.json({ message: "Links reordered" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("reorderLinks error:", err);
    res.status(500).json({ message: "Failed to reorder links" });
  } finally {
    if (connection) connection.release();
  }
};

export const toggleVisibility = async (req, res) => {
  try {
    const userId = req.user.id;
    const { linkId } = req.params;

    // Toggle the visibility
    const [result] = await db.query(
      "UPDATE links SET is_visible = NOT is_visible WHERE id = ? AND user_id = ?",
      [linkId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Link not found or not yours" });
    }

    const [updated] = await db.query(
      "SELECT id, is_visible FROM links WHERE id = ?",
      [linkId]
    );

    res.json({
      message: "Visibility toggled",
      link: updated[0],
    });
  } catch (err) {
    console.error("toggleVisibility error:", err);
    res.status(500).json({ message: "Failed to toggle link visibility" });
  }
};
