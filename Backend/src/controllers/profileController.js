import { db } from "../config/db.js";
import { formatFollowerCount } from "../services/youtubeService.js";
import { isReservedUsername } from "../utils/reservedUsernames.js";

// GET /api/profile/:username — Public profile page data
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Fetch user by username (public projection — never load email or credentials)
    const [users] = await db.query(
      `SELECT id, name, username, bio, avatar, banner_url,
              COALESCE(theme, 'Obsidian') as theme,
              COALESCE(accent_color, '#c6f035') as accent_color,
              COALESCE(surface_color, '#11120F') as surface_color,
              COALESCE(font_heading, 'Manrope / Semibold') as font_heading,
              COALESCE(font_labels, 'IBM Plex Mono / Medium') as font_labels,
              COALESCE(show_verified_badge, 1) as show_verified_badge,
              COALESCE(show_social_row, 1) as show_social_row,
              background_type, background_value,
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
      `SELECT id, title, url, platform, username, profileData, avatar_url, icon,
              COALESCE(display_mode, 'link') as display_mode, position, scheduled_at
       FROM links
       WHERE user_id = ? AND is_visible = 1
         AND (scheduled_at IS NULL OR scheduled_at <= NOW())
       ORDER BY position ASC, id DESC`,
      [user.id],
    );

    // Fetch connected integrations with real metrics
    const [integrationRows] = await db.query(
      `SELECT provider, config, last_synced_at
       FROM integrations
       WHERE user_id = ? AND status = 'connected' AND config IS NOT NULL`,
      [user.id]
    );

    let totalAudience = 0;
    const connectedIntegrations = integrationRows.map((r) => {
      let conf = {};
      try {
        conf = typeof r.config === "string" ? JSON.parse(r.config) : (r.config || {});
      } catch {
        conf = {};
      }
      const followers = Number(conf.followers) || 0;
      totalAudience += followers;
      return {
        provider: r.provider,
        handle: conf.handle,
        name: conf.name,
        avatar: conf.avatar,
        followers,
        formattedFollowers: conf.formattedFollowers || formatFollowerCount(followers),
        profileUrl: conf.profileUrl,
        label: conf.label || "FOLLOWERS",
        videos: conf.videos || 0,
        repos: conf.repos || 0,
      };
    });

    // Parse profileData JSON for each link and omit unneeded internal fields
    const parsedLinks = links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      platform: link.platform,
      display_mode: link.display_mode,
      icon: link.icon,
      avatar_url: link.avatar_url,
      profileData: typeof link.profileData === "string" ? JSON.parse(link.profileData) : link.profileData,
    }));

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      banner_url: user.banner_url,
      theme: user.theme || "Obsidian",
      accent_color: user.accent_color || "#c6f035",
      surface_color: user.surface_color || "#11120F",
      font_heading: user.font_heading || "Manrope / Semibold",
      font_labels: user.font_labels || "IBM Plex Mono / Medium",
      show_verified_badge: Boolean(user.show_verified_badge),
      show_social_row: Boolean(user.show_social_row),
      background_type: user.background_type || "gradient",
      background_value: user.background_value,
      totalAudience,
      totalAudienceFormatted: formatFollowerCount(totalAudience),
      integrations: connectedIntegrations,
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

    if (isReservedUsername(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message: "This username is reserved and cannot be claimed",
        error: {
          code: "RESERVED_USERNAME",
          message: "This username is reserved and cannot be claimed",
        },
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

    const {
      name,
      bio,
      theme,
      accent_color,
      surface_color,
      font_heading,
      font_labels,
      show_verified_badge,
      show_social_row,
      background_type,
      background_value,
    } = req.body;

    const updates = [];
    const values = [];

    const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{3,8}$/;
    const ALLOWED_BG_TYPES = ["gradient", "solid", "image", "mesh", "default"];

    if (name !== undefined) {
      const cleanName = String(name).trim();
      if (cleanName.length < 2 || cleanName.length > 80) {
        return res.status(400).json({ message: "Name must be between 2 and 80 characters" });
      }
      updates.push("name = ?");
      values.push(cleanName);
    }
    if (bio !== undefined) {
      const cleanBio = String(bio || "").trim();
      if (cleanBio.length > 500) {
        return res.status(400).json({ message: "Bio cannot exceed 500 characters" });
      }
      updates.push("bio = ?");
      values.push(cleanBio || null);
    }
    if (theme !== undefined) {
      updates.push("theme = ?");
      values.push(String(theme).slice(0, 50));
    }
    if (accent_color !== undefined) {
      if (accent_color && !HEX_COLOR_REGEX.test(accent_color)) {
        return res.status(400).json({ message: "Invalid accent color format. Expected hex color (e.g. #c6f035)" });
      }
      updates.push("accent_color = ?");
      values.push(accent_color || null);
    }
    if (surface_color !== undefined) {
      if (surface_color && !HEX_COLOR_REGEX.test(surface_color)) {
        return res.status(400).json({ message: "Invalid surface color format. Expected hex color (e.g. #11120F)" });
      }
      updates.push("surface_color = ?");
      values.push(surface_color || null);
    }
    if (font_heading !== undefined) {
      updates.push("font_heading = ?");
      values.push(String(font_heading).slice(0, 50));
    }
    if (font_labels !== undefined) {
      updates.push("font_labels = ?");
      values.push(String(font_labels).slice(0, 50));
    }
    if (show_verified_badge !== undefined) {
      updates.push("show_verified_badge = ?");
      values.push(show_verified_badge ? 1 : 0);
    }
    if (show_social_row !== undefined) {
      updates.push("show_social_row = ?");
      values.push(show_social_row ? 1 : 0);
    }
    if (background_type !== undefined) {
      if (background_type && !ALLOWED_BG_TYPES.includes(background_type)) {
        return res.status(400).json({ message: `Invalid background_type. Allowed: ${ALLOWED_BG_TYPES.join(", ")}` });
      }
      updates.push("background_type = ?");
      values.push(background_type || "gradient");
    }
    if (background_value !== undefined) {
      updates.push("background_value = ?");
      values.push(background_value ? String(background_value).slice(0, 255) : null);
    }
    if (req.body.banner_url !== undefined) {
      updates.push("banner_url = ?");
      values.push(req.body.banner_url ? String(req.body.banner_url).slice(0, 512) : null);
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
      `SELECT id, name, username, bio, avatar, banner_url, theme,
              COALESCE(accent_color, '#c6f035') as accent_color,
              COALESCE(surface_color, '#11120F') as surface_color,
              COALESCE(font_heading, 'Manrope / Semibold') as font_heading,
              COALESCE(font_labels, 'IBM Plex Mono / Medium') as font_labels,
              COALESCE(show_verified_badge, 1) as show_verified_badge,
              COALESCE(show_social_row, 1) as show_social_row,
              background_type, background_value FROM clients WHERE id = ?`,
      [userId],
    );

    res.json({ message: "Profile updated", user: updated[0], profile: updated[0] });
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
