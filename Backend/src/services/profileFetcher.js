import https from "https";
import http from "http";

// Simple cache for profile data (5 minutes TTL)
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

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;

    protocol
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        });
      })
      .on("error", reject);
  });
}

async function fetchGithub(username) {
  // Check cache first
  const cached = getFromCache("github", username);
  if (cached) return cached;

  try {
    const data = await httpsGet(`https://api.github.com/users/${username}`);

    if (data.message === "Not Found") {
      return null;
    }

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
    // Fallback: try to get channel info from RSS
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelIdOrUsername}`;
      const data = await httpsGet(rssUrl);

      // Basic parsing fallback - return minimal data
      return {
        name: channelIdOrUsername,
        avatar: null,
        platform: "youtube",
        profileUrl: `https://youtube.com/channel/${channelIdOrUsername}`,
      };
    } catch {
      return null;
    }
  }

  try {
    // Check if it's a username or channel ID
    let searchEndpoint = "";
    if (channelIdOrUsername.startsWith("UC")) {
      searchEndpoint = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIdOrUsername}&key=${apiKey}`;
    } else {
      searchEndpoint = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${channelIdOrUsername}&key=${apiKey}`;
    }

    const data = await httpsGet(searchEndpoint);

    if (!data.items || data.items.length === 0) {
      // Try search by username
      const searchData = await httpsGet(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelIdOrUsername}&type=channel&maxResults=1&key=${apiKey}`,
      );

      if (!searchData.items || searchData.items.length === 0) {
        return null;
      }

      const channelId = searchData.items[0].id.channelId;
      const channelData = await httpsGet(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`,
      );

      const profile = {
        name: channelData.items[0].snippet.title,
        avatar:
          channelData.items[0].snippet.thumbnails?.high?.url ||
          channelData.items[0].snippet.thumbnails?.default?.url,
        description: channelData.items[0].snippet.description,
        subscribers:
          parseInt(channelData.items[0].statistics.subscriberCount) || 0,
        videos: parseInt(channelData.items[0].statistics.videoCount) || 0,
        verified: channelData.items[0].status?.longUploadsStatus === "allowed",
        profileUrl: `https://youtube.com/channel/${channelId}`,
        platform: "youtube",
      };

      setCache("youtube", channelIdOrUsername, profile);
      return profile;
    }

    const profile = {
      name: data.items[0].snippet.title,
      avatar:
        data.items[0].snippet.thumbnails?.high?.url ||
        data.items[0].snippet.thumbnails?.default?.url,
      description: data.items[0].snippet.description,
      subscribers: parseInt(data.items[0].statistics.subscriberCount) || 0,
      videos: parseInt(data.items[0].statistics.videoCount) || 0,
      verified: data.items[0].status?.longUploadsStatus === "allowed",
      profileUrl: `https://youtube.com/channel/${data.items[0].id}`,
      platform: "youtube",
    };

    setCache("youtube", channelIdOrUsername, profile);
    return profile;
  } catch (err) {
    console.log("YouTube fetch error:", err.message);
    return null;
  }
}

async function fetchTelegram(username) {
  const cached = getFromCache("telegram", username);
  if (cached) return cached;

  // Telegram doesn't have a public API for profile info
  // We'll return basic info and let the frontend handle the display
  // In production, you might want to use a Telegram bot API or scraping service

  const profile = {
    username: username,
    name: username,
    avatar: null,
    profileUrl: `https://t.me/${username}`,
    platform: "telegram",
    note: "Telegram profile data requires additional setup",
  };

  setCache("telegram", username, profile);
  return profile;
}

async function fetchInstagram(username) {
  const cached = getFromCache("instagram", username);
  if (cached) return cached;

  // Instagram doesn't have a public API
  // Return basic info - in production use scraping service

  const profile = {
    username: username,
    name: username,
    avatar: null,
    profileUrl: `https://instagram.com/${username}`,
    platform: "instagram",
    note: "Instagram profile data requires additional setup",
  };

  setCache("instagram", username, profile);
  return profile;
}

async function fetchTwitter(username) {
  const cached = getFromCache("twitter", username);
  if (cached) return cached;

  // Twitter/X API requires authentication
  // Return basic info - in production use their API

  const profile = {
    username: username,
    name: username,
    avatar: null,
    profileUrl: `https://twitter.com/${username}`,
    platform: "twitter",
    note: "Twitter profile data requires API access",
  };

  setCache("twitter", username, profile);
  return profile;
}

async function fetchLinkedIn(username) {
  const cached = getFromCache("linkedin", username);
  if (cached) return cached;

  const profile = {
    username: username,
    name: username,
    avatar: null,
    profileUrl: `https://linkedin.com/in/${username}`,
    platform: "linkedin",
    note: "LinkedIn profile data requires API access",
  };

  setCache("linkedin", username, profile);
  return profile;
}

async function fetchFacebook(username) {
  const cached = getFromCache("facebook", username);
  if (cached) return cached;

  const profile = {
    username: username,
    name: username,
    avatar: null,
    profileUrl: `https://facebook.com/${username}`,
    platform: "facebook",
    note: "Facebook profile data requires API access",
  };

  setCache("facebook", username, profile);
  return profile;
}

async function fetchTikTok(username) {
  const cached = getFromCache("tiktok", username);
  if (cached) return cached;

  const profile = {
    username: username,
    name: username,
    avatar: null,
    profileUrl: `https://tiktok.com/@${username}`,
    platform: "tiktok",
    note: "TikTok profile data requires API access",
  };

  setCache("tiktok", username, profile);
  return profile;
}

export async function fetchProfileData(platform, username) {
  if (!platform || !username) {
    return null;
  }

  switch (platform.toLowerCase()) {
    case "github":
      return fetchGithub(username);
    case "youtube":
      return fetchYoutube(username);
    case "telegram":
      return fetchTelegram(username);
    case "instagram":
      return fetchInstagram(username);
    case "twitter":
      return fetchTwitter(username);
    case "linkedin":
      return fetchLinkedIn(username);
    case "facebook":
      return fetchFacebook(username);
    case "tiktok":
      return fetchTikTok(username);
    default:
      return null;
  }
}

export {
  fetchGithub,
  fetchYoutube,
  fetchTelegram,
  fetchInstagram,
  fetchTwitter,
  fetchLinkedIn,
  fetchFacebook,
  fetchTikTok,
};
