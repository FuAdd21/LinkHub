import { db } from "../config/db.js";
import { getYouTubeChannel, formatFollowerCount } from "../services/youtubeService.js";
import { getGitHubUser } from "../services/githubService.js";
import { getTikTokProfile } from "../services/tiktokService.js";
import { getInstagramProfile } from "../services/instagramService.js";

const PLATFORM_META = {
  youtube: {
    name: "YouTube",
    badge: "YT",
    color: "#ff0000",
    label: "SUBSCRIBERS",
    description: "Import channel metrics, subscribers, and profile signals.",
    placeholder: "Channel handle e.g. @mkbhd or URL",
  },
  github: {
    name: "GitHub",
    badge: "GH",
    color: "#c6f035",
    label: "FOLLOWERS",
    description: "Sync repositories, public activity, and developer follower graph.",
    placeholder: "GitHub username e.g. torvalds",
  },
  instagram: {
    name: "Instagram",
    badge: "IG",
    color: "#d946ef",
    label: "FOLLOWERS",
    description: "Display live follower counts and visual profile signals.",
    placeholder: "Instagram handle e.g. instagram",
  },
  tiktok: {
    name: "TikTok",
    badge: "TK",
    color: "#00f2ff",
    label: "FOLLOWERS",
    description: "Aggregate TikTok community reach and creator signals.",
    placeholder: "TikTok handle e.g. @tiktok",
  },
  twitter: {
    name: "X (Twitter)",
    badge: "X",
    color: "#e2e8f0",
    label: "FOLLOWERS",
    description: "Connect your public microblog handle and network reach.",
    placeholder: "Handle e.g. @elonmusk",
  },
  linkedin: {
    name: "LinkedIn",
    badge: "IN",
    color: "#0a66c2",
    label: "CONNECTIONS",
    description: "Surface your professional profile and industry network.",
    placeholder: "Profile username or URL",
  },
  spotify: {
    name: "Spotify",
    badge: "SP",
    color: "#1db954",
    label: "LISTENERS",
    description: "Feature artist profile, monthly listeners, and top tracks.",
    placeholder: "Artist name or Spotify URL",
  },
};

function formatTimeAgo(date) {
  if (!date) return "Never";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} d ago`;
}

// Fetch real data from corresponding service based on provider
async function fetchProviderData(provider, handleOrUrl) {
  const p = provider.toLowerCase();
  if (p === "youtube") {
    const data = await getYouTubeChannel(handleOrUrl);
    return {
      handle: data.handle || handleOrUrl,
      name: data.name || handleOrUrl,
      avatar: data.avatar || null,
      followers: Number(data.subscribers) || 0,
      formattedFollowers: data.formattedFollowers || formatFollowerCount(data.subscribers || 0),
      profileUrl: data.profileUrl || `https://youtube.com/${handleOrUrl}`,
      videos: data.videos || 0,
      label: "SUBSCRIBERS",
    };
  }
  if (p === "github") {
    const data = await getGitHubUser(handleOrUrl);
    return {
      handle: data.handle || `@${data.username || handleOrUrl}`,
      name: data.name || data.username || handleOrUrl,
      avatar: data.avatar || null,
      followers: Number(data.followers) || 0,
      formattedFollowers: data.formattedFollowers || formatFollowerCount(data.followers || 0),
      profileUrl: data.profileUrl || `https://github.com/${handleOrUrl}`,
      repos: data.repos || 0,
      bio: data.bio || null,
      label: "FOLLOWERS",
    };
  }
  if (p === "tiktok") {
    const data = await getTikTokProfile(handleOrUrl);
    const followers = Number(data.followers) || 0;
    return {
      handle: data.username ? `@${data.username}` : handleOrUrl,
      name: data.name || data.username || handleOrUrl,
      avatar: data.avatar || null,
      followers,
      formattedFollowers: formatFollowerCount(followers),
      profileUrl: data.profileUrl || `https://tiktok.com/@${handleOrUrl.replace(/^@/, "")}`,
      bio: data.bio || null,
      label: "FOLLOWERS",
    };
  }
  if (p === "instagram") {
    const data = await getInstagramProfile(handleOrUrl);
    const followers = Number(data.followers) || 0;
    return {
      handle: data.username ? `@${data.username}` : handleOrUrl,
      name: data.name || data.username || handleOrUrl,
      avatar: data.avatar || null,
      followers,
      formattedFollowers: formatFollowerCount(followers),
      profileUrl: data.profileUrl || `https://instagram.com/${handleOrUrl.replace(/^@/, "")}`,
      bio: data.bio || null,
      label: "FOLLOWERS",
    };
  }

  // Generic fallback for other platforms (twitter, linkedin, spotify)
  const clean = handleOrUrl.replace(/^@/, "").trim();
  return {
    handle: `@${clean}`,
    name: clean,
    avatar: null,
    followers: 0,
    formattedFollowers: "0",
    profileUrl: handleOrUrl.startsWith("http") ? handleOrUrl : `https://${provider}.com/${clean}`,
    label: PLATFORM_META[p]?.label || "FOLLOWERS",
  };
}

// Auto-sync any existing handle in clients table if config is null
async function checkAndAutoSyncExistingProfileSocials(userId) {
  const [clients] = await db.query(
    "SELECT youtubeId, githubUser, instagram, tiktok FROM clients WHERE id = ?",
    [userId]
  );
  if (clients.length === 0) return;
  const c = clients[0];

  const pairs = [
    { provider: "github", handle: c.githubUser },
    { provider: "youtube", handle: c.youtubeId },
    { provider: "instagram", handle: c.instagram },
    { provider: "tiktok", handle: c.tiktok },
  ];

  for (const { provider, handle } of pairs) {
    if (!handle) continue;
    // Check if integration already has valid config
    const [existing] = await db.query(
      "SELECT id, status, config FROM integrations WHERE user_id = ? AND provider = ?",
      [userId, provider]
    );
    if (existing.length === 0 || !existing[0].config) {
      try {
        const meta = await fetchProviderData(provider, handle);
        await db.query(
          `INSERT INTO integrations (user_id, provider, status, config, last_synced_at)
           VALUES (?, ?, 'connected', ?, NOW())
           ON DUPLICATE KEY UPDATE status = 'connected', config = VALUES(config), last_synced_at = NOW()`,
          [userId, provider, JSON.stringify(meta)]
        );
      } catch (err) {
        console.warn(`Auto-sync failed for ${provider} (${handle}):`, err.message);
      }
    }
  }
}

// GET /api/integrations — Fetch user's integrations
export const getIntegrations = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Auto-sync if user has handles saved in profile but not yet in integrations table
    await checkAndAutoSyncExistingProfileSocials(userId);

    const [rows] = await db.query(
      "SELECT id, provider, status, config, last_synced_at FROM integrations WHERE user_id = ?",
      [userId]
    );

    const dbMap = new Map();
    rows.forEach((r) => {
      let parsedConfig = null;
      if (typeof r.config === "string") {
        try {
          parsedConfig = JSON.parse(r.config);
        } catch {
          parsedConfig = null;
        }
      } else if (r.config && typeof r.config === "object") {
        parsedConfig = r.config;
      }
      dbMap.set(r.provider.toLowerCase(), {
        ...r,
        config: parsedConfig,
      });
    });

    const connected = [];
    const available = [];
    let totalAudience = 0;

    // Check all providers
    const allProviders = Object.keys(PLATFORM_META);

    allProviders.forEach((provider) => {
      const meta = PLATFORM_META[provider];
      const dbRow = dbMap.get(provider);
      const isConnected = dbRow && dbRow.status === "connected" && dbRow.config;

      if (isConnected) {
        const conf = dbRow.config || {};
        const followers = Number(conf.followers) || 0;
        totalAudience += followers;

        connected.push({
          provider,
          name: conf.name || meta.name,
          badge: meta.badge,
          color: meta.color,
          label: conf.label || meta.label,
          description: meta.description,
          handle: conf.handle || null,
          avatar: conf.avatar || null,
          followers,
          formattedFollowers: conf.formattedFollowers || formatFollowerCount(followers),
          profileUrl: conf.profileUrl || null,
          repos: conf.repos,
          videos: conf.videos,
          status: "connected",
          lastSyncedAt: dbRow.last_synced_at || null,
          timeAgo: formatTimeAgo(dbRow.last_synced_at),
          barPercent: 0, // Computed below once totalAudience is known
        });
      } else {
        available.push({
          provider,
          name: meta.name,
          badge: meta.badge,
          color: meta.color,
          label: meta.label,
          description: meta.description,
          placeholder: meta.placeholder,
          status: "available",
          lastSyncedAt: null,
          timeAgo: null,
          followers: 0,
          formattedFollowers: "0",
          handle: null,
        });
      }
    });

    // Compute proportional audience percentages
    connected.forEach((item) => {
      item.barPercent =
        totalAudience > 0
          ? Math.max(2, Math.round((item.followers / totalAudience) * 100))
          : 0;
    });

    res.json({
      connected,
      available,
      activeCount: connected.length,
      totalAudience,
      totalAudienceFormatted: formatFollowerCount(totalAudience),
      lastSyncSummary:
        connected.length > 0
          ? `Last sync completed ${connected[0]?.timeAgo || "recently"}`
          : "No active syncs",
    });
  } catch (err) {
    console.error("getIntegrations error:", err);
    res.status(500).json({ message: "Failed to fetch integrations" });
  }
};

// POST /api/integrations/connect — Connect a social media account and fetch real stats
export const connectIntegration = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { provider, handle, url } = req.body;
    if (!provider || (!handle && !url)) {
      return res.status(400).json({ message: "Provider and handle/URL are required" });
    }

    const normalizedProvider = provider.toLowerCase();
    const identifier = (handle || url).trim();

    // Fetch real metrics from platform
    const platformData = await fetchProviderData(normalizedProvider, identifier);

    // Save to integrations table
    await db.query(
      `INSERT INTO integrations (user_id, provider, status, config, last_synced_at)
       VALUES (?, ?, 'connected', ?, NOW())
       ON DUPLICATE KEY UPDATE status = 'connected', config = VALUES(config), last_synced_at = NOW()`,
      [userId, normalizedProvider, JSON.stringify(platformData)]
    );

    // Also synchronize corresponding column in clients table
    if (normalizedProvider === "youtube") {
      await db.query("UPDATE clients SET youtubeId = ? WHERE id = ?", [platformData.handle, userId]);
    } else if (normalizedProvider === "github") {
      const cleanUser = platformData.handle.replace(/^@/, "");
      await db.query("UPDATE clients SET githubUser = ? WHERE id = ?", [cleanUser, userId]);
    } else if (normalizedProvider === "instagram") {
      const cleanUser = platformData.handle.replace(/^@/, "");
      await db.query("UPDATE clients SET instagram = ? WHERE id = ?", [cleanUser, userId]);
    } else if (normalizedProvider === "tiktok") {
      const cleanUser = platformData.handle.replace(/^@/, "");
      await db.query("UPDATE clients SET tiktok = ? WHERE id = ?", [cleanUser, userId]);
    } else if (normalizedProvider === "linkedin") {
      const cleanUser = platformData.handle.replace(/^@/, "");
      await db.query("UPDATE clients SET linkedin = ? WHERE id = ?", [cleanUser, userId]);
    } else if (normalizedProvider === "twitter" || normalizedProvider === "x") {
      const cleanUser = platformData.handle.replace(/^@/, "");
      await db.query("UPDATE clients SET twitter = ? WHERE id = ?", [cleanUser, userId]);
    }

    // Two-way bridge to unified links table
    try {
      const [existingLinks] = await db.query(
        "SELECT id FROM links WHERE user_id = ? AND (LOWER(platform) = ? OR LOWER(url) LIKE ?)",
        [userId, normalizedProvider, `%${normalizedProvider}%`]
      );

      const targetUrl = platformData.profileUrl || (url?.startsWith("http") ? url : `https://${normalizedProvider}.com/${platformData.handle.replace(/^@/, "")}`);
      const displayMode = ["youtube", "github"].includes(normalizedProvider) ? "rich_card" : "header_pill";

      if (existingLinks.length > 0) {
        await db.query(
          "UPDATE links SET display_mode = ?, url = ?, username = ? WHERE id = ?",
          [displayMode, targetUrl, platformData.handle, existingLinks[0].id]
        );
      } else {
        const [maxPos] = await db.query(
          "SELECT COALESCE(MAX(position), -1) as maxPos FROM links WHERE user_id = ?",
          [userId]
        );
        const nextPos = (maxPos[0]?.maxPos ?? -1) + 1;
        const linkTitle = PLATFORM_META[normalizedProvider]?.name || normalizedProvider.toUpperCase();

        await db.query(
          `INSERT INTO links (user_id, title, url, platform, username, display_mode, position, is_visible)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
          [userId, linkTitle, targetUrl, normalizedProvider, platformData.handle, displayMode, nextPos]
        );
      }
    } catch (linkSyncErr) {
      console.warn("Unified link sync error during integration connect:", linkSyncErr.message);
    }

    res.json({
      message: `${normalizedProvider} connected successfully`,
      provider: normalizedProvider,
      data: platformData,
    });
  } catch (err) {
    console.error("connectIntegration error:", err);
    res.status(500).json({ message: `Failed to connect ${req.body?.provider || "integration"}` });
  }
};

// POST /api/integrations/disconnect — Disconnect an integration
export const disconnectIntegration = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { provider } = req.body;
    if (!provider) {
      return res.status(400).json({ message: "Provider is required" });
    }

    const normalizedProvider = provider.toLowerCase();

    await db.query(
      "UPDATE integrations SET status = 'available', config = NULL, last_synced_at = NULL WHERE user_id = ? AND provider = ?",
      [userId, normalizedProvider]
    );

    // Clear client column if desired
    if (normalizedProvider === "youtube") {
      await db.query("UPDATE clients SET youtubeId = NULL WHERE id = ?", [userId]);
    } else if (normalizedProvider === "github") {
      await db.query("UPDATE clients SET githubUser = NULL WHERE id = ?", [userId]);
    } else if (normalizedProvider === "instagram") {
      await db.query("UPDATE clients SET instagram = NULL WHERE id = ?", [userId]);
    } else if (normalizedProvider === "tiktok") {
      await db.query("UPDATE clients SET tiktok = NULL WHERE id = ?", [userId]);
    } else if (normalizedProvider === "linkedin") {
      await db.query("UPDATE clients SET linkedin = NULL WHERE id = ?", [userId]);
    } else if (normalizedProvider === "twitter" || normalizedProvider === "x") {
      await db.query("UPDATE clients SET twitter = NULL WHERE id = ?", [userId]);
    }

    res.json({
      message: `${normalizedProvider} disconnected`,
      provider: normalizedProvider,
      status: "available",
    });
  } catch (err) {
    console.error("disconnectIntegration error:", err);
    res.status(500).json({ message: "Failed to disconnect integration" });
  }
};

// POST /api/integrations/:provider/sync — Re-sync existing integration data
export const syncIntegration = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { provider } = req.params;
    if (!provider) {
      return res.status(400).json({ message: "Provider is required" });
    }

    const normalizedProvider = provider.toLowerCase();

    // Fetch existing integration config to get handle
    const [rows] = await db.query(
      "SELECT config FROM integrations WHERE user_id = ? AND provider = ?",
      [userId, normalizedProvider]
    );

    let handleToSync = null;
    if (rows.length > 0 && rows[0].config) {
      const conf = typeof rows[0].config === "string" ? JSON.parse(rows[0].config) : rows[0].config;
      handleToSync = conf.handle || conf.profileUrl;
    }

    if (!handleToSync) {
      // Fallback check client table
      const [clientRows] = await db.query(
        "SELECT youtubeId, githubUser, instagram, tiktok FROM clients WHERE id = ?",
        [userId]
      );
      if (clientRows.length > 0) {
        const c = clientRows[0];
        if (normalizedProvider === "youtube") handleToSync = c.youtubeId;
        if (normalizedProvider === "github") handleToSync = c.githubUser;
        if (normalizedProvider === "instagram") handleToSync = c.instagram;
        if (normalizedProvider === "tiktok") handleToSync = c.tiktok;
      }
    }

    if (!handleToSync) {
      return res.status(400).json({ message: `No handle configured for ${normalizedProvider}` });
    }

    // Re-fetch live metrics
    const updatedData = await fetchProviderData(normalizedProvider, handleToSync);

    await db.query(
      `UPDATE integrations SET config = ?, last_synced_at = NOW() WHERE user_id = ? AND provider = ?`,
      [JSON.stringify(updatedData), userId, normalizedProvider]
    );

    res.json({
      message: `${normalizedProvider} synced with live API metrics`,
      provider: normalizedProvider,
      data: updatedData,
      lastSyncedAt: new Date().toISOString(),
      timeAgo: "Just now",
    });
  } catch (err) {
    console.error("syncIntegration error:", err);
    res.status(500).json({ message: "Failed to sync integration" });
  }
};

export const toggleIntegration = async (req, res) => {
  if (req.body.status === "available") {
    return disconnectIntegration(req, res);
  }
  return connectIntegration(req, res);
};

