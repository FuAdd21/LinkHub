import axios from "axios";

// In-memory cache for profile data (5 minutes TTL)
const profileCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCacheKey(platform, username) {
  return `${platform}:${username}`;
}

function getFromCache(platform, username) {
  const key = getCacheKey(platform, username);
  const cached = profileCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  profileCache.delete(key);
  return null;
}

function setCache(platform, username, data) {
  const key = getCacheKey(platform, username);
  profileCache.set(key, { data, timestamp: Date.now() });
}

/**
 * SSRF Safety Guard
 * Prevents requests to internal localhost, RFC1918 private subnets, or metadata services.
 */
export function isSafeUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host === "0.0.0.0" ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      host.startsWith("169.254.") || // Cloud metadata endpoint
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe HTTP GET with timeout, headers, and SSRF prevention
 */
async function safeHttpGet(url, headers = {}) {
  if (!isSafeUrl(url)) {
    throw new Error(`SSRF blocked: Attempted request to private/unsafe URL: ${url}`);
  }

  const response = await axios.get(url, {
    timeout: 5000,
    headers: {
      "User-Agent": "LinkHub/2.0 (Identity Platform)",
      Accept: "application/json, text/html, */*",
      ...headers,
    },
  });

  return response.data;
}

export const PLATFORM_PATTERNS = {
  youtube: [
    /youtube\.com\/@([a-zA-Z0-9_-]+)/,
    /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
    /youtu\.be\/@([a-zA-Z0-9_-]+)/,
  ],
  github: [
    /github\.com\/([a-zA-Z0-9_-]+)\/?$/,
    /github\.com\/([a-zA-Z0-9_-]+)\/[a-zA-Z0-9_-]+/,
  ],
  instagram: [
    /instagram\.com\/([a-zA-Z0-9_.]+)\/?$/,
    /instagram\.com\/([a-zA-Z0-9_.]+)\/.*/,
  ],
  tiktok: [/tiktok\.com\/@([a-zA-Z0-9_.]+)/],
  twitter: [/twitter\.com\/([a-zA-Z0-9_]+)\/?$/, /x\.com\/([a-zA-Z0-9_]+)\/?$/],
  linkedin: [
    /linkedin\.com\/in\/([a-zA-Z0-9_-]+)/,
    /linkedin\.com\/company\/([a-zA-Z0-9_-]+)/,
  ],
  facebook: [
    /facebook\.com\/([a-zA-Z0-9.]+)\/?$/,
    /facebook\.com\/pages\/([a-zA-Z0-9-]+)/,
  ],
  telegram: [/t\.me\/([a-zA-Z0-9_]+)/, /telegram\.me\/([a-zA-Z0-9_]+)/],
};

/**
 * Unified platform and username detector from URL
 */
export function detectPlatform(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // YouTube
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      for (const pattern of PLATFORM_PATTERNS.youtube) {
        const match = url.match(pattern);
        if (match) return { platform: "youtube", username: match[1], url };
      }
      return { platform: "youtube", username: null, url };
    }

    // GitHub
    if (hostname.includes("github.com")) {
      for (const pattern of PLATFORM_PATTERNS.github) {
        const match = url.match(pattern);
        if (match) return { platform: "github", username: match[1], url };
      }
      return { platform: "github", username: null, url };
    }

    // Instagram
    if (hostname.includes("instagram.com")) {
      for (const pattern of PLATFORM_PATTERNS.instagram) {
        const match = url.match(pattern);
        if (match) return { platform: "instagram", username: match[1], url };
      }
      return { platform: "instagram", username: null, url };
    }

    // TikTok
    if (hostname.includes("tiktok.com")) {
      for (const pattern of PLATFORM_PATTERNS.tiktok) {
        const match = url.match(pattern);
        if (match) return { platform: "tiktok", username: match[1], url };
      }
      return { platform: "tiktok", username: null, url };
    }

    // Twitter / X
    if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      for (const pattern of PLATFORM_PATTERNS.twitter) {
        const match = url.match(pattern);
        if (match) return { platform: "twitter", username: match[1], url };
      }
      return { platform: "twitter", username: null, url };
    }

    // LinkedIn
    if (hostname.includes("linkedin.com")) {
      for (const pattern of PLATFORM_PATTERNS.linkedin) {
        const match = url.match(pattern);
        if (match) return { platform: "linkedin", username: match[1], url };
      }
      return { platform: "linkedin", username: null, url };
    }

    // Facebook
    if (hostname.includes("facebook.com")) {
      for (const pattern of PLATFORM_PATTERNS.facebook) {
        const match = url.match(pattern);
        if (match) return { platform: "facebook", username: match[1], url };
      }
      return { platform: "facebook", username: null, url };
    }

    // Telegram
    if (hostname.includes("t.me") || hostname.includes("telegram.me")) {
      for (const pattern of PLATFORM_PATTERNS.telegram) {
        const match = url.match(pattern);
        if (match) return { platform: "telegram", username: match[1], url };
      }
      return { platform: "telegram", username: null, url };
    }

    return { platform: null, username: null, url };
  } catch {
    return { platform: null, username: null, url };
  }
}

/**
 * Platform Specific Fetchers
 */
async function fetchGithub(username) {
  const cached = getFromCache("github", username);
  if (cached) return cached;

  try {
    const data = await safeHttpGet(`https://api.github.com/users/${username}`);
    if (data.message === "Not Found") return null;

    const profile = {
      name: data.name || data.login,
      avatar: data.avatar_url,
      bio: data.bio,
      followers: data.followers,
      following: data.following,
      publicRepos: data.public_repos,
      verified: data.type === "User",
      profileUrl: data.html_url,
      platform: "github",
    };

    setCache("github", username, profile);
    return profile;
  } catch (err) {
    console.log("GitHub fetch error:", err.message);
    return null;
  }
}

async function fetchYoutube(channelIdOrUsername) {
  const cached = getFromCache("youtube", channelIdOrUsername);
  if (cached) return cached;

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return {
      name: channelIdOrUsername,
      avatar: null,
      platform: "youtube",
      profileUrl: `https://youtube.com/@${channelIdOrUsername}`,
    };
  }

  try {
    const searchEndpoint = channelIdOrUsername.startsWith("UC")
      ? `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIdOrUsername}&key=${apiKey}`
      : `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${channelIdOrUsername}&key=${apiKey}`;

    const data = await safeHttpGet(searchEndpoint);

    if (data.items && data.items.length > 0) {
      const channelData = data.items[0];
      const profile = {
        name: channelData.snippet.title,
        avatar:
          channelData.snippet.thumbnails?.high?.url ||
          channelData.snippet.thumbnails?.default?.url,
        description: channelData.snippet.description,
        subscribers: parseInt(channelData.statistics?.subscriberCount) || 0,
        videos: parseInt(channelData.statistics?.videoCount) || 0,
        verified: channelData.status?.longUploadsStatus === "allowed",
        profileUrl: `https://youtube.com/channel/${channelData.id}`,
        platform: "youtube",
      };
      setCache("youtube", channelIdOrUsername, profile);
      return profile;
    }

    return null;
  } catch (err) {
    console.log("YouTube fetch error:", err.message);
    return null;
  }
}

export async function fetchSocialProfile(url) {
  try {
    const { platform, username } = detectPlatform(url);
    if (!platform || !username) {
      return { success: false, message: "Could not detect platform or username" };
    }

    const data = await fetchProfileData(platform, username);
    if (!data) {
      return { success: false, platform, username, avatar: null, displayName: username };
    }

    return {
      success: true,
      platform,
      username,
      avatar: data.avatar || null,
      displayName: data.name || username,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function fetchProfileData(platform, username) {
  if (!platform || !username) return null;

  switch (platform.toLowerCase()) {
    case "github":
      return fetchGithub(username);
    case "youtube":
      return fetchYoutube(username);
    case "telegram":
      return {
        username,
        name: username,
        avatar: null,
        profileUrl: `https://t.me/${username}`,
        platform: "telegram",
      };
    case "instagram":
      return {
        username,
        name: username,
        avatar: null,
        profileUrl: `https://instagram.com/${username}`,
        platform: "instagram",
      };
    case "twitter":
    case "x":
      return {
        username,
        name: username,
        avatar: null,
        profileUrl: `https://x.com/${username}`,
        platform: "twitter",
      };
    case "linkedin":
      return {
        username,
        name: username,
        avatar: null,
        profileUrl: `https://linkedin.com/in/${username}`,
        platform: "linkedin",
      };
    case "tiktok":
      return {
        username,
        name: username,
        avatar: null,
        profileUrl: `https://tiktok.com/@${username}`,
        platform: "tiktok",
      };
    default:
      return null;
  }
}
