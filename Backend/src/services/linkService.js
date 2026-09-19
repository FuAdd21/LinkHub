import { linkRepository } from "../repositories/linkRepository.js";
import { analyticsRepository } from "../repositories/analyticsRepository.js";
import { db } from "../config/db.js";
import { config } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/errorCodes.js";
import { detectPlatform } from "../utils/detectPlatform.js";
import { fetchProfileData } from "./profileFetcher.js";
import { fetchSocialProfile } from "./socialFetchService.js";
import { logger } from "../config/logger.js";

export async function syncLinkToSocialProfile(userId, platform, username) {
  if (!userId || !platform) return;
  const p = platform.toLowerCase();
  const cleanUsername = (username || "").replace(/^@/, "").trim();
  if (!cleanUsername) return;

  const fieldMap = {
    linkedin: "linkedin",
    github: "githubUser",
    youtube: "youtubeId",
    twitter: "twitter",
    x: "twitter",
    instagram: "instagram",
    tiktok: "tiktok",
    telegram: "telegramUser",
  };

  const dbField = fieldMap[p];
  if (dbField) {
    try {
      await db.query(`UPDATE clients SET ${dbField} = ? WHERE id = ?`, [cleanUsername, userId]);
    } catch (err) {
      logger.warn(`Failed to sync ${p} handle to clients: ${err.message}`);
    }
  }
}

export const linkService = {
  async getLinks(userId) {
    if (!userId) {
      throw AppError.unauthorized("Authentication required", ErrorCodes.UNAUTHORIZED);
    }

    const totalViews = await analyticsRepository.getTotalViews(userId);
    const links = await linkRepository.findByUserId(userId, { includeHidden: true });

    return links.map((link) => {
      const clicksCount = Number(link.clicks) || 0;
      const convRate =
        totalViews > 0
          ? ((clicksCount / totalViews) * 100).toFixed(1) + "%"
          : clicksCount > 0
          ? "100.0%"
          : "0.0%";

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
  },

  async createLink(userId, { title, url, icon, scheduled_at, display_mode = "link" }) {
    const currentCount = await linkRepository.countByUserId(userId);
    const maxLinks = config.links.maxPerUser;

    if (currentCount >= maxLinks) {
      throw AppError.badRequest(
        `Maximum link limit reached (${maxLinks} links). Delete unused links to add more.`,
        ErrorCodes.LINK_LIMIT_REACHED
      );
    }

    const platformInfo = detectPlatform(url);
    let profileData = null;
    let username = platformInfo.username;
    let avatar_url = null;

    if (platformInfo.platform && platformInfo.username) {
      try {
        profileData = await fetchProfileData(platformInfo.platform, platformInfo.username);
      } catch (err) {
        logger.debug(`Profile fetch fallback: ${err.message}`);
      }

      try {
        const socialResult = await fetchSocialProfile(url);
        if (socialResult.success && socialResult.avatar) {
          avatar_url = socialResult.avatar;
        }
      } catch (err) {
        logger.debug(`Social profile fetch fallback: ${err.message}`);
      }
    }

    const linkIcon = icon || platformInfo.platform || null;

    const created = await linkRepository.create({
      userId,
      title,
      url,
      platform: platformInfo.platform,
      username,
      profileData,
      avatar_url,
      icon: linkIcon,
      display_mode,
      position: currentCount,
      scheduled_at,
    });

    if (platformInfo.platform && username) {
      await syncLinkToSocialProfile(userId, platformInfo.platform, username);
    }

    return {
      ...created,
      profileData:
        typeof created.profileData === "string"
          ? JSON.parse(created.profileData)
          : created.profileData,
    };
  },

  async updateLink(linkId, userId, updates) {
    const existing = await linkRepository.findById(linkId, userId);
    if (!existing) {
      throw AppError.notFound("Link not found or not yours", ErrorCodes.LINK_NOT_FOUND);
    }

    let platform = existing.platform;
    let username = existing.username;
    let profileData = existing.profileData;
    let avatar_url = existing.avatar_url;

    if (updates.url && updates.url !== existing.url) {
      const platformInfo = detectPlatform(updates.url);
      platform = platformInfo.platform;
      username = platformInfo.username;

      if (platform && username) {
        try {
          profileData = await fetchProfileData(platform, username);
        } catch (err) {
          logger.debug(`Profile fetch fallback on update: ${err.message}`);
        }

        try {
          const socialResult = await fetchSocialProfile(updates.url);
          if (socialResult.success && socialResult.avatar) {
            avatar_url = socialResult.avatar;
          }
        } catch (err) {
          logger.debug(`Social profile fetch fallback on update: ${err.message}`);
        }
      }
    }

    const mergedUpdates = {
      ...updates,
      platform,
      username,
      profileData,
      avatar_url,
      icon: updates.icon || platform || existing.icon,
    };

    const updated = await linkRepository.update(linkId, userId, mergedUpdates);

    if (platform && username) {
      await syncLinkToSocialProfile(userId, platform, username);
    }

    return {
      ...updated,
      profileData:
        typeof updated.profileData === "string"
          ? JSON.parse(updated.profileData)
          : updated.profileData,
    };
  },

  async updateDisplayMode(linkId, userId, display_mode) {
    const existing = await linkRepository.findById(linkId, userId);
    if (!existing) {
      throw AppError.notFound("Link not found or not yours", ErrorCodes.LINK_NOT_FOUND);
    }

    await linkRepository.update(linkId, userId, { display_mode });
    return { success: true, display_mode };
  },

  async toggleVisibility(linkId, userId, is_visible) {
    const existing = await linkRepository.findById(linkId, userId);
    if (!existing) {
      throw AppError.notFound("Link not found or not yours", ErrorCodes.LINK_NOT_FOUND);
    }

    await linkRepository.update(linkId, userId, { is_visible: is_visible ? 1 : 0 });
    return { success: true, is_visible: Boolean(is_visible) };
  },

  async deleteLink(linkId, userId) {
    const existing = await linkRepository.findById(linkId, userId);
    if (!existing) {
      throw AppError.notFound("Link not found or not yours", ErrorCodes.LINK_NOT_FOUND);
    }

    await linkRepository.delete(linkId, userId);
    return { success: true };
  },

  async reorderLinks(userId, linkIds) {
    if (!Array.isArray(linkIds) || linkIds.length === 0) {
      throw AppError.badRequest("At least one link ID is required", ErrorCodes.VALIDATION_ERROR);
    }

    try {
      await linkRepository.reorder(userId, linkIds);
      return { success: true };
    } catch (err) {
      throw AppError.badRequest(err.message, ErrorCodes.VALIDATION_ERROR);
    }
  },
};
