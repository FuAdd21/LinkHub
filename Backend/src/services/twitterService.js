import axios from "axios";
import { JSDOM } from "jsdom";

const PLACEHOLDER_AVATAR = "/placeholder-avatar.png";

function extractTwitterUsername(input) {
  if (!input) return null;
  if (input.includes("twitter.com/")) {
    const match = input.match(/twitter\.com\/([a-zA-Z0-9_]+)(?:\/|$|\?)/);
    if (match) return match[1].split("?")[0];
  }
  if (input.includes("x.com/")) {
    const match = input.match(/x\.com\/([a-zA-Z0-9_]+)(?:\/|$|\?)/);
    if (match) return match[1].split("?")[0];
  }
  return input.replace(/^@/, "");
}

async function fetchTwitterData(username) {
  const url = `https://twitter.com/${username}`;
  
  try {
    // Try to get at least meta-tags with a mobile user agent
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // 1. Aggressive Meta Tag Search (Works for bots/crawlers)
    const name = document.querySelector('meta[property="og:title"]')?.getAttribute("content")?.split(" (@")[0] || 
                 document.querySelector('meta[name="twitter:title"]')?.getAttribute("content") || 
                 username;
    
    const avatar = document.querySelector('meta[property="og:image"]')?.getAttribute("content") || 
                   document.querySelector('meta[name="twitter:image"]')?.getAttribute("content");
    
    const bio = document.querySelector('meta[property="og:description"]')?.getAttribute("content") || 
                 document.querySelector('meta[name="twitter:description"]')?.getAttribute("content");

    // 2. Try to extract followers from bio
    let followers = 0;
    const followersMatch = bio?.match(/([\d,.]+)([KMBkmb]?)\s*(?:Followers|followers)/);
    if (followersMatch) {
      followers = parseFloat(followersMatch[1].replace(/,/g, ""));
      const unit = followersMatch[2].toUpperCase();
      if (unit === "K") followers *= 1000;
      if (unit === "M") followers *= 1000000;
      if (unit === "B") followers *= 1000000000;
    }

    if (name && avatar) {
      return {
        name,
        avatar,
        bio: bio?.substring(0, 160),
        followers: Math.floor(followers),
      };
    }
  } catch (error) {
    console.warn(`Twitter meta-fetch failed for ${username}:`, error.message);
  }
  return null;
}

export async function getTwitterProfile(input) {
  try {
    const username = extractTwitterUsername(input);
    if (!username) return { platform: "Twitter", error: "Invalid username" };

    // Try a few times with different agents if needed (skipped for brevity)
    const data = await fetchTwitterData(username);
    
    if (data) {
      return {
        platform: "Twitter",
        username,
        name: data.name,
        avatar: data.avatar,
        followers: data.followers,
        bio: data.bio || `Twitter profile for @${username}`,
        profileUrl: `https://twitter.com/${username}`,
      };
    }

    // High-quality placeholder (better than nothing)
    return {
      platform: "Twitter",
      username,
      name: username,
      avatar: `https://unavatar.io/twitter/${username}?fallback=${PLACEHOLDER_AVATAR}`, // Use unavatar.io as a pro fallback
      followers: 0,
      bio: `@${username} on Twitter`,
      profileUrl: `https://twitter.com/${username}`,
      error: "Live stats currently restricted"
    };
  } catch (error) {
    return { platform: "Twitter", error: "Failed to fetch Twitter data" };
  }
}
