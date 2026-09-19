import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLACEHOLDER_AVATAR = "/placeholder-avatar.png";

function parseSubscriberString(text) {
  if (!text) return 0;
  const clean = text.toLowerCase().replace(/subscribers?/g, "").trim();
  
  // Handle "1.15 million" or "1.15m"
  if (clean.includes("million") || clean.endsWith("m")) {
    const num = parseFloat(clean.replace("million", "").replace("m", "").trim());
    return Math.round(num * 1000000);
  }
  // Handle "840 thousand" or "840k"
  if (clean.includes("thousand") || clean.endsWith("k") || clean.includes("k")) {
    const num = parseFloat(clean.replace("thousand", "").replace("k", "").trim());
    return Math.round(num * 1000);
  }
  // Handle "1.5 billion" or "1.5b"
  if (clean.includes("billion") || clean.endsWith("b")) {
    const num = parseFloat(clean.replace("billion", "").replace("b", "").trim());
    return Math.round(num * 1000000000);
  }
  
  const parsed = parseInt(clean.replace(/,/g, ""), 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatFollowerCount(count) {
  if (!count || count < 0) return "0";
  if (count >= 1000000) {
    const m = count / 1000000;
    return (m % 1 === 0 ? m.toFixed(0) : m.toFixed(2).replace(/\.?0+$/, "")) + "M";
  }
  if (count >= 1000) {
    const k = count / 1000;
    return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1).replace(/\.?0+$/, "")) + "K";
  }
  return count.toLocaleString();
}

function extractHandleOrUrl(input) {
  if (!input) return null;
  let str = input.trim();
  if (str.startsWith("@")) return str;
  if (str.includes("youtube.com/@")) {
    const match = str.match(/@([\w.-]+)/);
    if (match) return `@${match[1]}`;
  }
  if (str.includes("youtube.com/channel/")) {
    const match = str.match(/\/channel\/([UC][\w-]{22})/);
    if (match) return match[1];
  }
  if (str.includes("youtube.com/c/") || str.includes("youtube.com/user/")) {
    const match = str.match(/\/(?:c|user)\/([\w.-]+)/);
    if (match) return `@${match[1]}`;
  }
  if (str.startsWith("http://") || str.startsWith("https://")) {
    return str;
  }
  return `@${str.replace(/^@/, "")}`;
}

import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/errorCodes.js";

async function scrapeYouTubeChannel(identifier) {
  try {
    const targetUrl = identifier.startsWith("http")
      ? identifier
      : identifier.startsWith("UC") && identifier.length === 24
      ? `https://www.youtube.com/channel/${identifier}`
      : `https://www.youtube.com/${identifier.startsWith("@") ? identifier : `@${identifier}`}`;

    const res = await axios.get(targetUrl, {
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = res.data;
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const subMatch1 = html.match(
      /"subscriberCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/
    );
    const subMatch2 = html.match(
      /"subscriberCountText":\{"simpleText":"([^"]+)"/
    );
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);

    const title = titleMatch ? titleMatch[1] : identifier.replace(/^@/, "");
    const avatar = imageMatch ? imageMatch[1] : PLACEHOLDER_AVATAR;
    const rawSubsText = subMatch1 ? subMatch1[1] : subMatch2 ? subMatch2[1] : null;
    let subscribers = parseSubscriberString(rawSubsText);

    if (!subscribers && descMatch) {
      const descSub = descMatch[1].match(/([\d.]+[KMB]?)\s*subscribers/i);
      if (descSub) subscribers = parseSubscriberString(descSub[1]);
    }

    return {
      platform: "YouTube",
      id: identifier,
      name: title,
      avatar,
      subscribers,
      formattedFollowers: formatFollowerCount(subscribers),
      videos: 0,
      views: 0,
      profileUrl: targetUrl,
      handle: identifier.startsWith("@") ? identifier : `@${identifier}`,
      label: "SUBSCRIBERS",
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err.response?.status === 404) {
      throw AppError.badRequest(
        `YouTube channel '${identifier}' was not found. Please verify the handle or channel URL.`,
        ErrorCodes.NOT_FOUND
      );
    }
    throw AppError.badRequest(
      `Failed to verify YouTube channel '${identifier}': ${err.message}`,
      ErrorCodes.VALIDATION_ERROR
    );
  }
}

async function resolveChannelId(input) {
  if (!input) return null;
  if (input.startsWith("UC") && input.length === 24) return input;
  if (input.includes("youtube.com/channel/")) {
    const match = input.match(/\/channel\/([UC][\w-]{22})/);
    if (match) return match[1];
  }
  if (input.includes("youtube.com/@")) {
    const match = input.match(/@([\w.-]+)/);
    if (match && YOUTUBE_API_KEY) return await resolveHandle(match[1]);
  }
  if (input.startsWith("@") && YOUTUBE_API_KEY) {
    return await resolveHandle(input.slice(1));
  }
  return null;
}

async function resolveHandle(handle) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: { part: "id", forHandle: handle, key: YOUTUBE_API_KEY },
      }
    );
    return response.data.items?.[0]?.id;
  } catch {
    return null;
  }
}

export async function getYouTubeChannel(input) {
  try {
    if (!input) {
      return { platform: "YouTube", error: "No channel input provided" };
    }

    const cleanIdentifier = extractHandleOrUrl(input);

    // If API key is not configured, directly use high-fidelity web scrape fallback
    if (!YOUTUBE_API_KEY) {
      return await scrapeYouTubeChannel(cleanIdentifier);
    }

    const channelId = await resolveChannelId(input);
    if (!channelId) {
      return await scrapeYouTubeChannel(cleanIdentifier);
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "snippet,statistics",
          id: channelId,
          key: YOUTUBE_API_KEY,
        },
      }
    );

    if (!response.data.items?.length) {
      return await scrapeYouTubeChannel(cleanIdentifier);
    }

    const channel = response.data.items[0];
    const snippet = channel.snippet;
    const stats = channel.statistics;
    const subs = parseInt(stats.subscriberCount, 10) || 0;

    return {
      platform: "YouTube",
      id: channelId,
      name: snippet.title,
      avatar:
        snippet.thumbnails?.high?.url ||
        snippet.thumbnails?.default?.url ||
        PLACEHOLDER_AVATAR,
      subscribers: subs,
      formattedFollowers: formatFollowerCount(subs),
      videos: parseInt(stats.videoCount, 10) || 0,
      views: parseInt(stats.viewCount, 10) || 0,
      profileUrl: `https://youtube.com/channel/${channelId}`,
      handle: cleanIdentifier.startsWith("@") ? cleanIdentifier : `@${snippet.customUrl || snippet.title}`,
    };
  } catch (error) {
    console.error("YouTube service error, trying scraper fallback:", error.message);
    const cleanIdentifier = extractHandleOrUrl(input);
    return await scrapeYouTubeChannel(cleanIdentifier);
  }
}

