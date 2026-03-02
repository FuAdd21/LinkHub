const PLATFORM_PATTERNS = {
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

export function detectPlatform(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;

    // YouTube
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      for (const pattern of PLATFORM_PATTERNS.youtube) {
        const match = url.match(pattern);
        if (match) {
          return { platform: "youtube", username: match[1], url };
        }
      }
      return { platform: "youtube", username: null, url };
    }

    // GitHub
    if (hostname.includes("github.com")) {
      for (const pattern of PLATFORM_PATTERNS.github) {
        const match = url.match(pattern);
        if (match) {
          return { platform: "github", username: match[1], url };
        }
      }
      return { platform: "github", username: null, url };
    }

    // Instagram
    if (hostname.includes("instagram.com")) {
      for (const pattern of PLATFORM_PATTERNS.instagram) {
        const match = url.match(pattern);
        if (match) {
          return { platform: "instagram", username: match[1], url };
        }
      }
      return { platform: "instagram", username: null, url };
    }

    // TikTok
    if (hostname.includes("tiktok.com")) {
      for (const pattern of PLATFORM_PATTERNS.tiktok) {
        const match = url.match(pattern);
        if (match) {
          return { platform: "tiktok", username: match[1], url };
        }
      }
      return { platform: "tiktok", username: null, url };
    }

    // Twitter/X
    if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      for (const pattern of PLATFORM_PATTERNS.twitter) {
        const match = url.match(pattern);
        if (match) {
          return { platform: "twitter", username: match[1], url };
        }
      }
      return { platform: "twitter", username: null, url };
    }

    // LinkedIn
    if (hostname.includes("linkedin.com")) {
      for (const pattern of PLATFORM_PATTERNS.linkedin) {
        const match = url.match(pattern);
        if (match) {
          return { platform: "linkedin", username: match[1], url };
        }
      }
      return { platform: "linkedin", username: null, url };
    }

    // Facebook
    if (hostname.includes("facebook.com")) {
      for (const pattern of PLATFORM_PATTERNS.facebook) {
        const match = url.match(pattern);
        if (match) {
          return { platform: "facebook", username: match[1], url };
        }
      }
      return { platform: "facebook", username: null, url };
    }

    // Telegram
    if (hostname.includes("t.me") || hostname.includes("telegram.me")) {
      for (const pattern of PLATFORM_PATTERNS.telegram) {
        const match = url.match(pattern);
        if (match) {
          return { platform: "telegram", username: match[1], url };
        }
      }
      return { platform: "telegram", username: null, url };
    }

    return { platform: null, username: null, url };
  } catch (err) {
    return { platform: null, username: null, url };
  }
}
