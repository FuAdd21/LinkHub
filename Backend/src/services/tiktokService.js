import axios from "axios";
import { JSDOM } from "jsdom";

const getFallbackAvatar = (username) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username || "TikTok")}&backgroundColor=00f2ff&textColor=000000`;

function extractTikTokUsername(input) {
  if (!input) return null;

  // Extract from tiktok.com/@username URL
  if (input.includes("tiktok.com/@")) {
    const match = input.match(/tiktok\.com\/@([a-zA-Z0-9_.]+)(?:\/|$|\?)/);
    if (match) return match[1].split("?")[0];
  }

  // Remove @ if present
  return input.replace(/^@/, "").trim();
}

async function fetchTikTokData(username) {
  const url = `https://www.tiktok.com/@${username}`;
  
  // Use social crawler user agents (Facebook/Twitter) which are whitelisted by ByteDance SlardarWAF
  const userAgents = [
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Twitterbot/1.0",
    "WhatsApp/2.21.12.21 A",
  ];

  for (const ua of userAgents) {
    try {
      const response = await axios.get(url, {
        timeout: 8000,
        headers: {
          "User-Agent": ua,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      const html = typeof response.data === "string" ? response.data : "";
      if (!html || html.length < 500) continue;

      const dom = new JSDOM(html);
      const document = dom.window.document;

      // 1. Try OG Tags (Served reliably to social crawlers)
      const rawOgImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
      const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute("content");

      const ogImage = rawOgImage ? rawOgImage.replace(/&amp;/g, "&") : null;

      if (ogTitle || ogImage) {
        // Extract display name: "Khabane lame on TikTok" -> "Khabane lame"
        let name = username;
        if (ogTitle) {
          name = ogTitle.replace(/\s+on TikTok$/i, "").trim();
          if (name.includes(" (@")) {
            name = name.split(" (@")[0].trim();
          }
        }

        // Extract followers from description: "@khaby.lame 163.0m Followers, 81 Following..."
        let followers = null;
        if (ogDesc) {
          const followersMatch = ogDesc.match(/([\d,.]+)\s*([KMBkmb]?)\s*(?:Followers|followers)/);
          if (followersMatch) {
            let num = parseFloat(followersMatch[1].replace(/,/g, ""));
            const unit = (followersMatch[2] || "").toUpperCase();
            if (unit === "K") num *= 1000;
            if (unit === "M") num *= 1000000;
            if (unit === "B") num *= 1000000000;
            followers = Math.floor(num);
          }
        }

        return {
          name: name || username,
          avatar: ogImage || getFallbackAvatar(username),
          bio: ogDesc || `@${username} on TikTok`,
          followers,
        };
      }

      // 2. Try __UNIVERSAL_DATA_FOR_REHYDRATION__ (if present)
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
              avatar: (user.avatarLarger || user.avatarMedium || user.avatarThumb)?.replace(/&amp;/g, "&"),
              bio: user.signature,
              followers: stats.followerCount,
            };
          }
        } catch (e) {
          console.warn("TikTok Universal Data parse failed:", e.message);
        }
      }
    } catch (error) {
      console.warn(`TikTok fetch attempt with UA failed for ${username}:`, error.message);
    }
  }

  // 3. Fallback to TikTok oEmbed endpoint for author name
  try {
    const oembedRes = await axios.get(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${username}`, {
      timeout: 5000,
    });
    if (oembedRes.data?.author_name) {
      return {
        name: oembedRes.data.author_name,
        avatar: getFallbackAvatar(username),
        bio: `@${username} on TikTok`,
        followers: null,
      };
    }
  } catch (e) {
    // Ignore oembed failure
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
        name: data.name || username,
        avatar: data.avatar || getFallbackAvatar(username),
        followers: data.followers,
        bio: data.bio || `@${username} on TikTok`,
        profileUrl: `https://tiktok.com/@${username}`,
      };
    }

    // Resilient fallback with branded initials
    return {
      platform: "TikTok",
      username,
      name: username,
      avatar: getFallbackAvatar(username),
      followers: null,
      bio: `@${username} on TikTok`,
      profileUrl: `https://tiktok.com/@${username}`,
      error: "Unable to sync live data - using limited profile",
    };
  } catch (error) {
    console.error("TikTok service error:", error);
    return { platform: "TikTok", error: "Failed to fetch TikTok data" };
  }
}
