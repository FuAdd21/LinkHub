import { db } from "../config/db.js";
import { detectPlatform } from "../utils/detectPlatform.js";
import { fetchProfileData } from "../services/profileFetcher.js";
import { fetchSocialProfile } from "../services/socialFetchService.js";

export const getLinks = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token - no user id" });
    }
    const [results] = await db.query(
      "SELECT id, title, url, platform, username, profileData, avatar_url FROM links WHERE user_id = ? ORDER BY id DESC",
      [userId],
    );
    res.json(results);
  } catch (err) {
    console.error("getLinks error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createLink = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required" });
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
          platformInfo.username,
        );
      } catch (fetchErr) {
        console.log(
          "Profile fetch failed, continuing without metadata:",
          fetchErr.message,
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

    const [result] = await db.query(
      "INSERT INTO links (user_id, title, url, platform, username, profileData, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        title,
        url,
        platformInfo.platform,
        username,
        profileData ? JSON.stringify(profileData) : null,
        avatar_url,
      ],
    );

    const [newLink] = await db.query("SELECT * FROM links WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      message: "Link created",
      link: {
        ...newLink[0],
        profileData: newLink[0].profileData
          ? JSON.parse(newLink[0].profileData)
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLink = async (req, res) => {
  try {
    const userId = req.user.id;
    const { linkId } = req.params;
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required" });
    }

    // Re-detect platform on update
    const platformInfo = detectPlatform(url);
    let profileData = null;
    let username = platformInfo.username;

    if (platformInfo.platform && platformInfo.username) {
      try {
        profileData = await fetchProfileData(
          platformInfo.platform,
          platformInfo.username,
        );
      } catch (fetchErr) {
        console.log("Profile fetch failed:", fetchErr.message);
      }
    }

    const [result] = await db.query(
      "UPDATE links SET title = ?, url = ?, platform = ?, username = ?, profileData = ? WHERE id = ? AND user_id = ?",
      [
        title,
        url,
        platformInfo.platform,
        username,
        profileData ? JSON.stringify(profileData) : null,
        linkId,
        userId,
      ],
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
        profileData: updatedLink[0].profileData
          ? JSON.parse(updatedLink[0].profileData)
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const userId = req.user.id;
    const { linkId } = req.params;

    const [result] = await db.query(
      "DELETE FROM links WHERE id = ? AND user_id = ?",
      [linkId, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Link not found or not yours" });
    }

    res.json({ message: "Link deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const reorderLinks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { order } = req.body;

    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: "Invalid order array" });
    }

    // Update each link's position
    for (let i = 0; i < order.length; i++) {
      await db.query(
        "UPDATE links SET created_at = DATE_ADD(created_at, INTERVAL ? SECOND) WHERE id = ? AND user_id = ?",
        [i, order[i], userId],
      );
    }

    res.json({ message: "Links reordered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
