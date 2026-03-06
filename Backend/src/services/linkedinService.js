import axios from "axios";
import { JSDOM } from "jsdom";

const PLACEHOLDER_AVATAR = "/placeholder-avatar.png";

function extractLinkedInUsername(input) {
  if (!input) return null;
  if (input.includes("linkedin.com/in/")) {
    const match = input.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)(?:\/|$|\?)/);
    if (match) return match[1].split("?")[0];
  }
  return input.replace(/^@/, "");
}

async function fetchLinkedInData(username) {
  const url = `https://www.linkedin.com/in/${username}/`;
  
  try {
    // LinkedIn is the most aggressive. 
    // We use a high-quality Mobile User Agent and Google Referrer.
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/",
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Aggressive meta tag extraction
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
    const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute("content");

    if (ogTitle || ogImage) {
      const name = ogTitle?.split(/[|-]/)[0]?.trim() || username;
      
      // Parse stats from description
      const statsMatch = ogDesc?.match(/([\d,+.?kmbKMB]+)\s*(?:connections|followers|Followers|Connections)/);
      let connections = 0;
      if (statsMatch) {
        let rawNum = statsMatch[1].replace(/[,+]/g, "").toLowerCase();
        connections = parseFloat(rawNum);
        if (rawNum.includes("k")) connections *= 1000;
        if (rawNum.includes("m")) connections *= 1000000;
      }

      return {
        name,
        avatar: ogImage,
        bio: ogDesc?.split("View")[0]?.split("...")[0]?.trim() || ogDesc,
        connections: Math.floor(connections),
      };
    }

  } catch (error) {
    console.warn(`LinkedIn fetch failed for ${username}:`, error.message);
  }
  return null;
}

export async function getLinkedInProfile(input) {
  try {
    const username = extractLinkedInUsername(input);
    if (!username) return { platform: "LinkedIn", error: "Invalid username" };

    const data = await fetchLinkedInData(username);
    if (data) {
      return {
        platform: "LinkedIn",
        username,
        name: data.name,
        avatar: data.avatar || `https://unavatar.io/linkedin/${username}?fallback=${PLACEHOLDER_AVATAR}`,
        connections: data.connections || 0,
        bio: data.bio || `@${username} on LinkedIn`,
        profileUrl: `https://linkedin.com/in/${username}`,
      };
    }

    // Pro fallback using unavatar.io
    return {
      platform: "LinkedIn",
      username,
      name: username,
      avatar: `https://unavatar.io/linkedin/${username}?fallback=${PLACEHOLDER_AVATAR}`,
      connections: 0,
      bio: `@${username} on LinkedIn`,
      profileUrl: `https://linkedin.com/in/${username}`,
      error: "Live stats restricted"
    };
  } catch (error) {
    return { platform: "LinkedIn", error: "Failed to fetch LinkedIn data" };
  }
}
