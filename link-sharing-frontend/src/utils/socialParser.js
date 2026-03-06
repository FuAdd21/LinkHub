/**
 * socialParser.js
 * 
 * Automatically detects the social media platform and extracts the username/handle
 * from a given URL or raw input string.
 */

export const parseSocialLink = (input) => {
  if (!input || typeof input !== "string") return null;

  const urlStr = input.trim().toLowerCase();
  let platform = null;
  let handle = null;

  // Cleanup common trailing slashes or query params for cleaner parsing
  const cleanUrl = urlStr.split('?')[0].replace(/\/$/, '');

  // 1. Twitter / X
  if (cleanUrl.includes("twitter.com/") || cleanUrl.includes("x.com/")) {
    platform = "twitter";
    const parts = cleanUrl.split("/");
    handle = parts[parts.length - 1];
  }
  // 2. LinkedIn
  else if (cleanUrl.includes("linkedin.com/in/")) {
    platform = "linkedin";
    const parts = cleanUrl.split("/in/");
    handle = parts[1]?.split("/")[0];
  }
  // 3. Instagram
  else if (cleanUrl.includes("instagram.com/")) {
    platform = "instagram";
    const parts = cleanUrl.split("instagram.com/");
    handle = parts[1]?.split("/")[0];
  }
  // 4. TikTok
  else if (cleanUrl.includes("tiktok.com/")) {
    platform = "tiktok";
    const parts = cleanUrl.split("tiktok.com/");
    const rawHandle = parts[1]?.split("/")[0];
    handle = rawHandle?.startsWith("@") ? rawHandle.substring(1) : rawHandle;
  }
  // 5. GitHub
  else if (cleanUrl.includes("github.com/")) {
    platform = "githubUser";
    const parts = cleanUrl.split("github.com/");
    handle = parts[1]?.split("/")[0];
  }
  // 6. YouTube
  else if (cleanUrl.includes("youtube.com/")) {
    platform = "youtubeId";
    if (cleanUrl.includes("/@")) {
      handle = "@" + cleanUrl.split("/@")[1]?.split("/")[0];
    } else if (cleanUrl.includes("/c/")) {
      handle = cleanUrl.split("/c/")[1]?.split("/")[0];
    } else if (cleanUrl.includes("/channel/")) {
      handle = cleanUrl.split("/channel/")[1]?.split("/")[0];
    } else {
      const parts = cleanUrl.split("youtube.com/");
      handle = parts[1]?.split("/")[0];
    }
  }
  // 7. Telegram
  else if (cleanUrl.includes("t.me/")) {
    platform = "telegramUser";
    const parts = cleanUrl.split("t.me/");
    handle = parts[1]?.split("/")[0];
  }

  // Fallback: If no recognized platform URL structure, return null
  // (We could try to guess based on an @ prefix, but that might overwrite wrong fields)
  if (!platform || !handle) return null;

  return {
    platformKey: platform, // Maps to the state object keys in EditProfileModal
    handle: handle,
  };
};
