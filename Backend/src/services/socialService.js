import { integrationRepository } from "../repositories/integrationRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { PLATFORM_METADATA } from "./social/types.js";
import { getYouTubeChannel, formatFollowerCount } from "./youtubeService.js";
import { getGitHubUser } from "./githubService.js";
import { getTikTokProfile } from "./tiktokService.js";
import { getInstagramProfile } from "./instagramService.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/errorCodes.js";
import { logger } from "../config/logger.js";
import { db } from "../config/db.js";

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

export const socialService = {
  async fetchProviderData(provider, handleOrUrl) {
    const p = provider.toLowerCase();

    if (p === "youtube") {
      const data = await getYouTubeChannel(handleOrUrl);
      const followers = Number(data.subscribers) || 0;
      return {
        handle: data.handle || handleOrUrl,
        name: data.name || handleOrUrl,
        avatar: data.avatar || null,
        followers,
        formattedFollowers: data.formattedFollowers || formatFollowerCount(followers),
        profileUrl: data.profileUrl || `https://youtube.com/${handleOrUrl}`,
        videos: data.videos || 0,
        label: "SUBSCRIBERS",
      };
    }

    if (p === "github") {
      const data = await getGitHubUser(handleOrUrl);
      const followers = Number(data.followers) || 0;
      return {
        handle: data.handle || `@${data.username || handleOrUrl}`,
        name: data.name || data.username || handleOrUrl,
        avatar: data.avatar || null,
        followers,
        formattedFollowers: formatFollowerCount(followers),
        profileUrl: data.profileUrl || `https://github.com/${handleOrUrl.replace(/^@/, "")}`,
        repos: data.repos || 0,
        label: "FOLLOWERS",
      };
    }

    if (p === "tiktok") {
      const data = await getTikTokProfile(handleOrUrl);
      const followers = Number(data.followers) || 0;
      return {
        handle: data.handle || (handleOrUrl.startsWith("@") ? handleOrUrl : `@${handleOrUrl}`),
        name: data.name || handleOrUrl,
        avatar: data.avatar || null,
        followers,
        formattedFollowers: formatFollowerCount(followers),
        profileUrl: data.profileUrl || `https://tiktok.com/@${handleOrUrl.replace(/^@/, "")}`,
        likes: data.likes || 0,
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
      label: PLATFORM_METADATA[p]?.label || "FOLLOWERS",
    };
  },

  async getIntegrations(userId) {
    if (!userId) {
      throw AppError.unauthorized("Authentication required", ErrorCodes.UNAUTHORIZED);
    }

    // Auto-sync if user has handles saved in profile but not yet in integrations
    const [clients] = await db.query(
      "SELECT youtubeId, githubUser, instagram, tiktok, twitter, linkedin, telegramUser FROM clients WHERE id = ?",
      [userId]
    );

    if (clients.length > 0) {
      const c = clients[0];
      const pairs = [
        { provider: "github", handle: c.githubUser },
        { provider: "youtube", handle: c.youtubeId },
        { provider: "instagram", handle: c.instagram },
        { provider: "tiktok", handle: c.tiktok },
        { provider: "twitter", handle: c.twitter },
        { provider: "linkedin", handle: c.linkedin },
      ];

      for (const { provider, handle } of pairs) {
        if (!handle) continue;
        const existing = await integrationRepository.findByUserAndProvider(userId, provider);
        if (!existing || !existing.config) {
          try {
            const meta = await this.fetchProviderData(provider, handle);
            await integrationRepository.upsert(userId, provider, {
              status: "connected",
              config: meta,
            });
          } catch (err) {
            logger.warn(`Auto-sync failed for ${provider}: ${err.message}`);
          }
        }
      }
    }

    const rows = await integrationRepository.findByUserId(userId);
    const dbMap = new Map();
    rows.forEach((r) => dbMap.set(r.provider.toLowerCase(), r));

    let totalAudience = 0;
    const integrations = Object.entries(PLATFORM_METADATA).map(([key, meta]) => {
      const entry = dbMap.get(key);
      const isConnected = entry && (entry.status === "connected" || entry.status === "stale");
      const config = entry?.config || null;

      let followers = 0;
      let handle = null;
      let name = null;
      let avatar = null;
      let profileUrl = null;

      if (isConnected && config) {
        followers = Number(config.followers) || 0;
        totalAudience += followers;
        handle = config.handle || null;
        name = config.name || null;
        avatar = config.avatar || null;
        profileUrl = config.profileUrl || null;
      }

      return {
        provider: key,
        ...meta,
        status: entry ? entry.status : "disconnected",
        last_synced_at: entry?.last_synced_at || null,
        last_synced_human: formatTimeAgo(entry?.last_synced_at),
        timeAgo: formatTimeAgo(entry?.last_synced_at),
        handle,
        name: name || meta.name,
        avatar,
        profileUrl,
        followers,
        formattedFollowers: formatFollowerCount(followers),
        config,
      };
    });

    const connected = integrations.filter((i) => i.status === "connected" || i.status === "stale");
    const available = integrations.filter((i) => i.status !== "connected" && i.status !== "stale");

    // Compute relative percentage and labels for each connected network
    connected.forEach((net) => {
      net.barPercent = totalAudience > 0 ? Math.round((net.followers / totalAudience) * 100) : 0;
      net.timeAgo = net.last_synced_human || "Just now";
    });

    return {
      integrations,
      connected,
      available,
      totalAudience,
      totalAudienceFormatted: formatFollowerCount(totalAudience),
      connectedCount: connected.length,
      activeCount: connected.length,
      lastSyncSummary: connected.length > 0 ? `${connected.length} active platform syncs` : "No active syncs",
    };
  },

  async connectIntegration(userId, provider, handle) {
    if (!handle || typeof handle !== "string" || !handle.trim()) {
      throw AppError.badRequest("Please provide a valid handle or username", ErrorCodes.VALIDATION_ERROR);
    }

    const p = provider.toLowerCase();
    if (!PLATFORM_METADATA[p]) {
      throw AppError.badRequest(`Unsupported platform: ${provider}`, ErrorCodes.VALIDATION_ERROR);
    }

    // Fetch metrics from platform
    const meta = await this.fetchProviderData(p, handle.trim());

    const result = await integrationRepository.upsert(userId, p, {
      status: "connected",
      config: meta,
    });

    const colMap = {
      github: "githubUser",
      youtube: "youtubeId",
      instagram: "instagram",
      tiktok: "tiktok",
      twitter: "twitter",
      linkedin: "linkedin",
    };
    if (colMap[p]) {
      const cleanHandle = (meta.handle || handle).replace(/^@/, "").trim();
      await db.query(`UPDATE clients SET ${colMap[p]} = ? WHERE id = ?`, [cleanHandle, userId]).catch(() => {});
    }

    return result;
  },

  async syncIntegration(userId, provider) {
    const p = provider.toLowerCase();
    const existing = await integrationRepository.findByUserAndProvider(userId, p);

    if (!existing || !existing.config) {
      throw AppError.badRequest(`No active integration found for ${provider}`, ErrorCodes.NOT_FOUND);
    }

    const handle = existing.config.handle || existing.config.name;
    if (!handle) {
      throw AppError.badRequest(`Cannot sync ${provider}: no handle recorded`, ErrorCodes.VALIDATION_ERROR);
    }

    try {
      const freshMeta = await this.fetchProviderData(p, handle);
      const updated = await integrationRepository.upsert(userId, p, {
        status: "connected",
        config: freshMeta,
      });
      return { success: true, status: "connected", config: updated.config };
    } catch (fetchErr) {
      // Graceful degradation: never zero out follower count on failure, mark as stale
      logger.warn(`Sync failed for ${provider}, retaining cached data with status 'stale': ${fetchErr.message}`);
      await integrationRepository.upsert(userId, p, {
        status: "stale",
        config: existing.config,
      });
      return { success: true, status: "stale", config: existing.config, warning: "External service unavailable, showing cached data" };
    }
  },

  async disconnectIntegration(userId, provider) {
    const p = provider.toLowerCase();
    await integrationRepository.delete(userId, p);

    const colMap = {
      github: "githubUser",
      youtube: "youtubeId",
      instagram: "instagram",
      tiktok: "tiktok",
      twitter: "twitter",
      linkedin: "linkedin",
    };
    if (colMap[p]) {
      try {
        await db.query(`UPDATE clients SET ${colMap[p]} = NULL WHERE id = ?`, [userId]);
      } catch (err) {
        logger.warn(`Failed to clear ${colMap[p]} from clients: ${err.message}`);
      }
    }

    return { success: true };
  },

  async previewIntegration(provider, handle) {
    if (!handle || typeof handle !== "string" || !handle.trim()) {
      throw AppError.badRequest("Please provide a handle or URL", ErrorCodes.VALIDATION_ERROR);
    }

    const p = provider.toLowerCase();
    if (!PLATFORM_METADATA[p]) {
      throw AppError.badRequest(`Unsupported platform: ${provider}`, ErrorCodes.VALIDATION_ERROR);
    }

    const data = await this.fetchProviderData(p, handle.trim());
    return data;
  },
};
