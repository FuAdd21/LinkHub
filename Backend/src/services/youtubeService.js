import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLACEHOLDER_AVATAR = "/placeholder-avatar.png";

async function resolveChannelId(input) {
  if (!input) return null;

  // Direct channel ID (UC...)
  if (input.startsWith("UC") && input.length === 24) {
    return input;
  }

  // Extract from URL
  if (input.includes("youtube.com/channel/")) {
    const match = input.match(/\/channel\/([UC][\w-]{22})/);
    if (match) return match[1];
  }

  if (input.includes("youtube.com/@")) {
    const match = input.match(/@([\w.-]+)/);
    if (match) return await resolveHandle(match[1]);
  }

  // Handle @username
  if (input.startsWith("@")) {
    return await resolveHandle(input.slice(1));
  }

  // Fallback search
  return await searchChannel(input);
}

async function resolveHandle(handle) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: { part: "id", forHandle: handle, key: YOUTUBE_API_KEY },
      },
    );
    return response.data.items?.[0]?.id;
  } catch {
    return null;
  }
}

async function searchChannel(query) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          type: "channel",
          q: query,
          key: YOUTUBE_API_KEY,
        },
      },
    );
    return response.data.items?.[0]?.snippet?.channelId;
  } catch {
    return null;
  }
}

export async function getYouTubeChannel(input) {
  try {
    if (!input) {
      return { platform: "YouTube", error: "No channel input provided" };
    }

    if (!YOUTUBE_API_KEY) {
      console.warn("YouTube API key not configured");
      return {
        platform: "YouTube",
        name: "YouTube Channel",
        avatar: PLACEHOLDER_AVATAR,
        subscribers: 0,
        videos: 0,
        views: 0,
        profileUrl: null,
        error: "YouTube API key not configured",
      };
    }

    const channelId = await resolveChannelId(input);
    if (!channelId) {
      return { platform: "YouTube", error: "Channel not found" };
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "snippet,statistics",
          id: channelId,
          key: YOUTUBE_API_KEY,
        },
      },
    );

    if (!response.data.items?.length) {
      return { platform: "YouTube", error: "Channel not found" };
    }

    const channel = response.data.items[0];
    const snippet = channel.snippet;
    const stats = channel.statistics;

    return {
      platform: "YouTube",
      id: channelId,
      name: snippet.title,
      avatar:
        snippet.thumbnails?.high?.url ||
        snippet.thumbnails?.default?.url ||
        PLACEHOLDER_AVATAR,
      subscribers: parseInt(stats.subscriberCount) || 0,
      videos: parseInt(stats.videoCount) || 0,
      views: parseInt(stats.viewCount) || 0,
      profileUrl: `https://youtube.com/channel/${channelId}`,
    };
  } catch (error) {
    console.error("YouTube service error:", error.message);
    return {
      platform: "YouTube",
      name: "YouTube Channel",
      avatar: PLACEHOLDER_AVATAR,
      subscribers: 0,
      videos: 0,
      views: 0,
      profileUrl: null,
      error: "Failed to fetch channel data",
    };
  }
}
