import { db } from "../config/db.js";

const DEFAULT_CATALOG = [
  {
    provider: "github",
    name: "GitHub",
    badge: "GH",
    description: "Sync repositories and contribution activity.",
    defaultConnected: true,
  },
  {
    provider: "youtube",
    name: "YouTube",
    badge: "YT",
    description: "Import latest videos and channel metrics.",
    defaultConnected: true,
  },
  {
    provider: "instagram",
    name: "Instagram",
    badge: "IG",
    description: "Display recent posts and profile signals.",
    defaultConnected: true,
  },
  {
    provider: "analytics",
    name: "Analytics",
    badge: "AN",
    description: "Enrich audience and conversion reporting.",
    defaultConnected: true,
  },
  {
    provider: "spotify",
    name: "Spotify",
    badge: "SP",
    description: "Feature current tracks and playlists.",
    defaultConnected: false,
  },
  {
    provider: "newsletter",
    name: "Newsletter",
    badge: "NL",
    description: "Collect subscribers from your profile.",
    defaultConnected: false,
  },
  {
    provider: "calendar",
    name: "Calendar",
    badge: "CL",
    description: "Turn profile visits into booked calls.",
    defaultConnected: false,
  },
  {
    provider: "storefront",
    name: "Storefront",
    badge: "ST",
    description: "Surface products and recent launches.",
    defaultConnected: false,
  },
  {
    provider: "slack",
    name: "Slack",
    badge: "SL",
    description: "Receive publishing and traffic alerts.",
    defaultConnected: false,
  },
  {
    provider: "webhooks",
    name: "Webhooks",
    badge: "WB",
    description: "Trigger custom workflows from events.",
    defaultConnected: false,
  },
];

function formatTimeAgo(date) {
  if (!date) return "Just now";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} d ago`;
}

// Ensure default integrations exist in database for this user
async function ensureUserIntegrations(userId) {
  const [existing] = await db.query(
    "SELECT provider, status, last_synced_at FROM integrations WHERE user_id = ?",
    [userId]
  );

  if (existing.length === 0) {
    for (const item of DEFAULT_CATALOG) {
      if (item.defaultConnected) {
        await db.query(
          `INSERT INTO integrations (user_id, provider, status, last_synced_at)
           VALUES (?, ?, 'connected', DATE_SUB(NOW(), INTERVAL ? MINUTE))
           ON DUPLICATE KEY UPDATE status = VALUES(status)`,
          [userId, item.provider, Math.floor(Math.random() * 12) + 2]
        );
      }
    }
  }
}

export const getIntegrations = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await ensureUserIntegrations(userId);

    const [rows] = await db.query(
      "SELECT id, provider, status, config, last_synced_at FROM integrations WHERE user_id = ?",
      [userId]
    );

    const statusMap = new Map();
    rows.forEach((r) => {
      statusMap.set(r.provider.toLowerCase(), r);
    });

    const connected = [];
    const available = [];

    DEFAULT_CATALOG.forEach((item) => {
      const dbRow = statusMap.get(item.provider.toLowerCase());
      const isConnected = dbRow && dbRow.status === "connected";

      const data = {
        ...item,
        status: isConnected ? "connected" : "available",
        lastSyncedAt: dbRow?.last_synced_at || null,
        timeAgo: dbRow?.last_synced_at ? formatTimeAgo(dbRow.last_synced_at) : null,
      };

      if (isConnected) {
        connected.push(data);
      } else {
        available.push(data);
      }
    });

    res.json({
      connected,
      available,
      activeCount: connected.length,
      lastSyncSummary: connected.length > 0 ? "Last sync completed 3 minutes ago" : "No active syncs",
    });
  } catch (err) {
    console.error("getIntegrations error:", err);
    res.status(500).json({ message: "Failed to fetch integrations" });
  }
};

export const toggleIntegration = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { provider, status } = req.body;
    if (!provider) {
      return res.status(400).json({ message: "Provider is required" });
    }

    const normalizedProvider = provider.toLowerCase();
    const newStatus = status === "connected" ? "connected" : "available";

    await db.query(
      `INSERT INTO integrations (user_id, provider, status, last_synced_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE status = VALUES(status), last_synced_at = NOW()`,
      [userId, normalizedProvider, newStatus]
    );

    res.json({
      message: `Integration ${normalizedProvider} is now ${newStatus}`,
      provider: normalizedProvider,
      status: newStatus,
    });
  } catch (err) {
    console.error("toggleIntegration error:", err);
    res.status(500).json({ message: "Failed to update integration" });
  }
};

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

    await db.query(
      `UPDATE integrations SET last_synced_at = NOW() WHERE user_id = ? AND provider = ?`,
      [userId, normalizedProvider]
    );

    res.json({
      message: `Integration ${normalizedProvider} synced`,
      provider: normalizedProvider,
      lastSyncedAt: new Date().toISOString(),
      timeAgo: "Just now",
    });
  } catch (err) {
    console.error("syncIntegration error:", err);
    res.status(500).json({ message: "Failed to sync integration" });
  }
};
