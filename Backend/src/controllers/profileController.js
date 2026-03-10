import { db } from "../config/db.js";

// GET /api/profile/:username — Public profile page data
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Fetch user by username
    const [users] = await db.query(
      `SELECT id, name, username, email, bio, avatar, banner_url, theme, background_type, background_value,
              youtubeId, githubUser, telegramUser, instagram, twitter, linkedin, tiktok
       FROM clients WHERE username = ?`,
      [username.toLowerCase()],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Fetch visible links ordered by position
    const [links] = await db.query(
      `SELECT id, title, url, platform, username, profileData, avatar_url, icon, position, scheduled_at
       FROM links
       WHERE user_id = ? AND is_visible = 1
         AND (scheduled_at IS NULL OR scheduled_at <= NOW())
       ORDER BY position ASC, id DESC`,
      [user.id],
    );

    // Parse profileData JSON for each link
    const parsedLinks = links.map((link) => ({
      ...link,
      profileData: typeof link.profileData === "string" ? JSON.parse(link.profileData) : link.profileData,
    }));

    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      banner_url: user.banner_url,
      theme: user.theme || "dark-pro",
      background_type: user.background_type || "gradient",
      background_value: user.background_value,
      socials: {
        youtube: user.youtubeId,
        github: user.githubUser,
        telegram: user.telegramUser,
        instagram: user.instagram,
        twitter: user.twitter,
        linkedin: user.linkedin,
        tiktok: user.tiktok,
      },
      links: parsedLinks,
    });
  } catch (err) {
    console.error("getPublicProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/profile/username — Set/update username (authenticated)
export const setupUsername = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Validate: lowercase, no spaces, alphanumeric + underscores/hyphens
    const cleanUsername = username.toLowerCase().trim();
    const usernameRegex = /^[a-z0-9_-]{3,30}$/;

    if (!usernameRegex.test(cleanUsername)) {
      return res.status(400).json({
        message:
          "Username must be 3-30 characters, lowercase, and contain only letters, numbers, underscores, or hyphens",
      });
    }

    // Check uniqueness
    const [existing] = await db.query(
      "SELECT id FROM clients WHERE username = ? AND id != ?",
      [cleanUsername, userId],
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Username already taken" });
    }

    await db.query("UPDATE clients SET username = ? WHERE id = ?", [
      cleanUsername,
      userId,
    ]);

    res.json({ message: "Username updated", username: cleanUsername });
  } catch (err) {
    console.error("setupUsername error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/profile — Update bio, theme, background (authenticated)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { bio, theme, background_type, background_value } = req.body;

    const updates = [];
    const values = [];

    if (bio !== undefined) {
      updates.push("bio = ?");
      values.push(bio);
    }
    if (theme !== undefined) {
      updates.push("theme = ?");
      values.push(theme);
    }
    if (background_type !== undefined) {
      updates.push("background_type = ?");
      values.push(background_type);
    }
    if (background_value !== undefined) {
      updates.push("background_value = ?");
      values.push(background_value);
    }
    if (req.body.banner_url !== undefined) {
      updates.push("banner_url = ?");
      values.push(req.body.banner_url);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(userId);

    await db.query(
      `UPDATE clients SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    // Return updated profile
    const [updated] = await db.query(
      `SELECT id, name, username, bio, avatar, banner_url, theme, background_type, background_value FROM clients WHERE id = ?`,
      [userId],
    );

    res.json({ message: "Profile updated", profile: updated[0] });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/profile/check/:username — Check username availability
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const cleanUsername = username.toLowerCase().trim();

    const [existing] = await db.query(
      "SELECT id FROM clients WHERE username = ?",
      [cleanUsername],
    );

    res.json({ available: existing.length === 0, username: cleanUsername });
  } catch (err) {
    console.error("checkUsername error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
