import axios from "axios";
import { JSDOM } from "jsdom";

const PLACEHOLDER_AVATAR = "/placeholder-avatar.png";

function extractTikTokUsername(input) {
  if (!input) return null;

  // Extract from tiktok.com/@username URL
  if (input.includes("tiktok.com/@")) {
    const match = input.match(/tiktok\.com\/@([a-zA-Z0-9_.]+)(?:\/|$|\?)/);
    if (match) return match[1].split("?")[0];
  }

  // Remove @ if present
  return input.replace(/^@/, "");
}

async function fetchTikTokData(username) {
  const url = `https://www.tiktok.com/@${username}`;
  
  try {
    const response = await axios.get(url, {
      timeout: 6000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // 1. Try __UNIVERSAL_DATA_FOR_REHYDRATION__ (Most modern)
    const universalData = document.querySelector("#__UNIVERSAL_DATA_FOR_REHYDRATION__");
    if (universalData) {
      try {
        const jsonData = JSON.parse(universalData.textContent);
        const userModule = jsonData?.__DEFAULT_SCOPE__?.["webapp.user-detail"]?.userInfo;
        
        if (userModule) {
          const user = userModule.user;
          const stats = userModule.stats;
          return {
            name: user.nickname || user.uniqueId,
            avatar: user.avatarMedium || user.avatarLarger || user.avatarThumb,
            bio: user.signature,
            followers: stats.followerCount,
          };
        }
      } catch (e) {
        console.warn("TikTok Universal Data parse failed:", e);
      }
    }

    // 2. Try SIGI_STATE (Traditional fallback)
    const sigiState = document.querySelector("#SIGI_STATE");
    if (sigiState) {
      try {
        const jsonData = JSON.parse(sigiState.textContent);
        const userModule = jsonData?.UserModule?.users?.[username] || Object.values(jsonData?.UserModule?.users || {})[0];
        const statsModule = jsonData?.UserModule?.stats?.[username] || Object.values(jsonData?.UserModule?.stats || {})[0];

        if (userModule) {
          return {
            name: userModule.nickname || userModule.uniqueId,
            avatar: userModule.avatarMedium || userModule.avatarLarger,
            bio: userModule.signature,
            followers: statsModule?.followerCount || 0,
          };
        }
      } catch (e) {
        console.warn("TikTok SIGI_STATE parse failed:", e);
      }
    }

    // 3. Try OG Tags (Basic fallback)
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
    const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute("content");

    if (ogTitle || ogImage) {
      // Extract followers from description if possible
      const followersMatch = ogDesc?.match(/([\d,.]+)([KMBkmb]?)\s*(?:Followers|followers)/);
      let followers = 0;
      if (followersMatch) {
        followers = parseFloat(followersMatch[1].replace(/,/g, ""));
        const unit = followersMatch[2].toUpperCase();
        if (unit === "K") followers *= 1000;
        if (unit === "M") followers *= 1000000;
        if (unit === "B") followers *= 1000000000;
      }

      return {
        name: ogTitle?.split(" (@")[0] || username,
        avatar: ogImage || PLACEHOLDER_AVATAR,
        bio: ogDesc,
        followers: Math.floor(followers),
      };
    }

  } catch (error) {
    console.warn("TikTok page fetch failed:", error.message);
  }
  return null;
}

export async function getTikTokProfile(input) {
  try {
    const username = extractTikTokUsername(input);
    if (!username) return { platform: "TikTok", error: "Invalid username" };

    const data = await fetchTikTokData(username);
    if (data) {
      return {
        platform: "TikTok",
        username,
        name: data.name,
        avatar: data.avatar,
        followers: data.followers,
        bio: data.bio,
        profileUrl: `https://tiktok.com/@${username}`,
      };
    }

    // Final Fallback for famous users (to ensure something shows up)
    return {
      platform: "TikTok",
      username,
      name: username,
      avatar: PLACEHOLDER_AVATAR,
      followers: 0,
      bio: `@${username} on TikTok`,
      profileUrl: `https://tiktok.com/@${username}`,
      error: "Unable to sync live data - using limited profile"
    };
  } catch (error) {
    console.error("TikTok service error:", error);
    return { platform: "TikTok", error: "Failed to fetch TikTok data" };
  }
}
