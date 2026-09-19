import crypto from "crypto";
import { analyticsRepository } from "../repositories/analyticsRepository.js";
import { linkRepository } from "../repositories/linkRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { projectRepository } from "../repositories/projectRepository.js";
import { config } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/errorCodes.js";
import { db } from "../config/db.js";

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

function calculateDelta(curr, prev) {
  if (prev === 0) return curr > 0 ? "+100%" : "+0.0%";
  const delta = (((curr - prev) / prev) * 100).toFixed(1);
  return delta >= 0 ? `+${delta}%` : `${delta}%`;
}

export const analyticsService = {
  async trackClick(linkId, { ip, userAgent = "", referrer = null }) {
    const parsedId = parseInt(linkId, 10);
    if (!parsedId || parsedId <= 0) {
      throw AppError.badRequest("Invalid link ID", ErrorCodes.VALIDATION_ERROR);
    }

    const link = await linkRepository.findByIdForRedirect(parsedId);
    if (!link) {
      throw AppError.notFound("Link not found", ErrorCodes.LINK_NOT_FOUND);
    }

    const device = detectDevice(userAgent);
    const hashedIp = hashIp(ip);

    if (hashedIp) {
      const recent = await analyticsRepository.findRecentClick(link.id, hashedIp, 5);
      if (recent) {
        return { recorded: false, message: "Click already recorded" };
      }
    }

    await analyticsRepository.recordClick({
      linkId: link.id,
      userId: link.user_id,
      ip: hashedIp,
      device,
      referrer,
    });

    return { recorded: true, message: "Click tracked" };
  },

  async trackProfileView(username, { ip, userAgent = "", referrer = null }) {
    if (!username) {
      throw AppError.badRequest("Username required", ErrorCodes.VALIDATION_ERROR);
    }

    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw AppError.notFound("User not found", ErrorCodes.USER_NOT_FOUND);
    }

    const device = detectDevice(userAgent);
    const hashedIp = hashIp(ip);

    if (hashedIp) {
      const recent = await analyticsRepository.findRecentProfileView(user.id, hashedIp, 5);
      if (recent) {
        return { recorded: false, message: "View already recorded" };
      }
    }

    await analyticsRepository.recordProfileView({
      userId: user.id,
      ip: hashedIp,
      device,
      referrer,
    });

    return { recorded: true, message: "Profile view tracked" };
  },

  async trackCtaClick(username, { ip, userAgent = "", referrer = null } = {}) {
    if (!username) {
      throw AppError.badRequest("Username required", ErrorCodes.VALIDATION_ERROR);
    }

    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw AppError.notFound("User not found", ErrorCodes.USER_NOT_FOUND);
    }

    await analyticsRepository.recordCtaClick({ userId: user.id });
    return { recorded: true, message: "CTA click tracked" };
  },

  async trackProjectClick(projectId, { ip, userAgent = "", referrer = null } = {}) {
    const id = parseInt(projectId, 10);
    if (!id || id <= 0) {
      throw AppError.badRequest("Invalid project ID", ErrorCodes.VALIDATION_ERROR);
    }

    const project = await projectRepository.findById(id);
    if (!project) {
      throw AppError.notFound("Project not found", ErrorCodes.LINK_NOT_FOUND);
    }

    await analyticsRepository.recordProjectClick({ userId: project.user_id, projectId: id });
    return { recorded: true, message: "Project click tracked" };
  },

  async getDashboardAnalytics(userId, days = 30) {
    if (!userId) {
      throw AppError.unauthorized("Authentication required", ErrorCodes.UNAUTHORIZED);
    }

    const [totalClicks, totalViews, uniqueVisitors, ctaClicks, projectClicks] = await Promise.all([
      analyticsRepository.getTotalClicks(userId),
      analyticsRepository.getTotalViews(userId),
      analyticsRepository.getUniqueVisitors(userId),
      analyticsRepository.getCtaClicks(userId),
      analyticsRepository.getProjectClicks(userId),
    ]);

    const clickRate =
      totalViews > 0
        ? ((totalClicks / totalViews) * 100).toFixed(2)
        : totalClicks > 0
        ? "100.00"
        : "0.00";

    const [
      clicksPerDay,
      viewsPerDay,
      comparison,
      topLinksRaw,
      deviceStatsRaw,
      referrerStatsRaw,
      todayClicks,
      todayViews,
      recentActivity,
    ] = await Promise.all([
      analyticsRepository.getClicksPerDay(userId, days),
      analyticsRepository.getViewsPerDay(userId, days),
      analyticsRepository.getComparisonMetrics(userId, days),
      analyticsRepository.getTopLinks(userId, 10),
      analyticsRepository.getDeviceStats(userId, days),
      analyticsRepository.getReferrerStats(userId, days),
      analyticsRepository.getTodayClicks(userId),
      analyticsRepository.getTodayViews(userId),
      analyticsRepository.getRecentActivity(userId, 8),
    ]);

    const currRate =
      comparison.currViews > 0 ? (comparison.currClicks / comparison.currViews) * 100 : 0;
    const prevRate =
      comparison.prevViews > 0 ? (comparison.prevClicks / comparison.prevViews) * 100 : 0;

    const deltas = {
      views: calculateDelta(comparison.currViews, comparison.prevViews),
      clicks: calculateDelta(comparison.currClicks, comparison.prevClicks),
      rate: calculateDelta(currRate, prevRate),
      visitors: calculateDelta(comparison.currVisitors, comparison.prevVisitors),
    };

    const topLinks = topLinksRaw.map((link) => {
      const clicks = Number(link.clicks) || 0;
      const convRate =
        totalViews > 0
          ? ((clicks / totalViews) * 100).toFixed(1) + "%"
          : clicks > 0
          ? "100.0%"
          : "0.0%";
      return {
        ...link,
        clicks,
        conversionRate: convRate,
      };
    });

    let totalDeviceCount = 0;
    const deviceMap = { mobile: 0, desktop: 0, tablet: 0 };

    deviceStatsRaw.forEach((row) => {
      const count = Number(row.count) || 0;
      totalDeviceCount += count;
      const dev = (row.device || "").toLowerCase();
      if (dev === "mobile") deviceMap.mobile += count;
      else if (dev === "tablet") deviceMap.tablet += count;
      else deviceMap.desktop += count;
    });

    const deviceMix = {
      mobile: totalDeviceCount > 0 ? Math.round((deviceMap.mobile / totalDeviceCount) * 100) : 0,
      desktop: totalDeviceCount > 0 ? Math.round((deviceMap.desktop / totalDeviceCount) * 100) : 0,
      tablet: totalDeviceCount > 0 ? Math.round((deviceMap.tablet / totalDeviceCount) * 100) : 0,
    };

    const totalEngagement = totalClicks + ctaClicks + projectClicks;
    const effectiveCtr =
      totalViews > 0
        ? ((totalEngagement / totalViews) * 100).toFixed(1)
        : totalEngagement > 0
        ? "100.0"
        : "0.0";

    // Fetch connected integrations to compute authentic audience breakdown
    const [integrationsRows] = await db.query(
      "SELECT provider, config FROM integrations WHERE user_id = ? AND status = 'connected'",
      [userId]
    ).catch(() => [[]]);

    const PLATFORM_COLORS = {
      youtube: "#ff0033",
      github: "#8b949e",
      telegram: "#229ED9",
      instagram: "#E1306C",
      tiktok: "#00f2ff",
      twitter: "#1DA1F2",
      linkedin: "#0A66C2",
      x: "#ffffff",
      spotify: "#1db954",
    };

    const PLATFORM_NAMES = {
      youtube: "YouTube",
      github: "GitHub",
      telegram: "Telegram",
      instagram: "Instagram",
      tiktok: "TikTok",
      twitter: "X (Twitter)",
      linkedin: "LinkedIn",
      x: "X",
      spotify: "Spotify",
    };

    let totalFollowersRaw = 0;
    const audienceBreakdown = [];

    (integrationsRows || []).forEach((row) => {
      try {
        const conf = typeof row.config === "string" ? JSON.parse(row.config) : (row.config || {});
        const p = (row.provider || "").toLowerCase();
        const rawFollowers = Number(conf.followers) || 0;
        totalFollowersRaw += rawFollowers;
        audienceBreakdown.push({
          platform: PLATFORM_NAMES[p] || (p.charAt(0).toUpperCase() + p.slice(1)),
          count: conf.formattedFollowers || (rawFollowers >= 1000000 ? `${(rawFollowers / 1000000).toFixed(1)}M` : rawFollowers >= 1000 ? `${(rawFollowers / 1000).toFixed(1)}K` : String(rawFollowers)),
          color: PLATFORM_COLORS[p] || "#c6f035",
          raw: rawFollowers,
        });
      } catch {
        // ignore malformed config
      }
    });

    audienceBreakdown.sort((a, b) => b.raw - a.raw);
    const totalFollowersFormatted =
      totalFollowersRaw >= 1000000
        ? `${(totalFollowersRaw / 1000000).toFixed(1).replace(/\.0$/, "")}M`
        : totalFollowersRaw >= 1000
        ? `${(totalFollowersRaw / 1000).toFixed(1).replace(/\.0$/, "")}K`
        : String(totalFollowersRaw);

    return {
      totalClicks,
      todayClicks,
      totalViews,
      todayViews,
      uniqueVisitors,
      clickRate,
      totalEngagement,
      effectiveCtr,
      breakdown: {
        links: totalClicks,
        cta: ctaClicks,
        projects: projectClicks,
      },
      deltas,
      clicksPerDay,
      viewsPerDay,
      topLinks,
      deviceStats: deviceStatsRaw,
      deviceMix,
      referrerStats: referrerStatsRaw,
      recentActivity,
      audienceBreakdown,
      totalFollowers: totalFollowersFormatted,
    };
  },
};
