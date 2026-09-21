import axios from "axios";
import { JSDOM } from "jsdom";

const getFallbackAvatar = (username) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username || "LinkedIn")}&backgroundColor=0A66C2&textColor=ffffff`;

function extractLinkedInUsername(input) {
  if (!input) return null;
  if (input.includes("linkedin.com/in/")) {
    const match = input.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)(?:\/|$|\?)/);
    if (match) return match[1].split("?")[0];
  }
  return input.replace(/^@/, "").trim();
}

async function fetchLinkedInData(username) {
  const url = `https://www.linkedin.com/in/${username}/`;
  
  // Use social crawler & desktop browser user agents that LinkedIn serves rich metadata to
  const userAgents = [
    "Twitterbot/1.0",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  ];

  for (const ua of userAgents) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          "User-Agent": ua,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      const html = typeof response.data === "string" ? response.data : "";
      if (!html || html.length < 500) continue;

      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Meta tag extraction
      const rawOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
                         document.querySelector("title")?.textContent;
      const rawOgImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
      const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute("content");

      // CRITICAL: LinkedIn images have '&amp;' query params which return 403 unless decoded to '&'
      const ogImage = rawOgImage ? rawOgImage.replace(/&amp;/g, "&") : null;

      if (rawOgTitle || ogImage) {
        // "Satya Nadella - Chairman and CEO at Microsoft | LinkedIn" -> "Satya Nadella"
        let name = username;
        if (rawOgTitle) {
          const firstPart = rawOgTitle.split(/[|\-–]/)[0]?.trim();
          if (firstPart && !firstPart.toLowerCase().includes("linkedin")) {
            name = firstPart;
          }
        }

        // Parse stats from description or HTML body
        const searchScope = `${ogDesc || ""} ${html.slice(0, 30000)}`;
        const statsMatch = searchScope.match(/([\d,+.?kmbKMB]+)\s*(?:connections|followers|Followers|Connections)/);
        let connections = 0;
        let formattedFollowers = null;

        if (statsMatch) {
          const rawMatch = statsMatch[0]; // e.g. "500+ connections"
          const rawNum = statsMatch[1].replace(/[,+]/g, "").toLowerCase();
          connections = parseFloat(rawNum);
          if (rawNum.includes("k")) connections *= 1000;
          if (rawNum.includes("m")) connections *= 1000000;
          connections = Math.floor(connections);
          formattedFollowers = rawMatch.includes("500+") ? "500+" : null;
        }

        return {
          name: name || username,
          avatar: ogImage || getFallbackAvatar(username),
          bio: ogDesc?.split("View")[0]?.split("...")[0]?.trim() || `@${username} on LinkedIn`,
          connections: connections || 500,
          formattedFollowers: formattedFollowers || (connections > 0 ? `${connections.toLocaleString()}+` : "500+"),
        };
      }
    } catch (error) {
      console.warn(`LinkedIn fetch attempt with UA failed for ${username}:`, error.message);
    }
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
        avatar: data.avatar || getFallbackAvatar(username),
        connections: data.connections || 500,
        formattedFollowers: data.formattedFollowers || "500+",
        bio: data.bio || `@${username} on LinkedIn`,
        profileUrl: `https://linkedin.com/in/${username}`,
      };
    }

    // Branded fallback
    return {
      platform: "LinkedIn",
      username,
      name: username,
      avatar: getFallbackAvatar(username),
      connections: 500,
      formattedFollowers: "500+",
      bio: `@${username} on LinkedIn`,
      profileUrl: `https://linkedin.com/in/${username}`,
      error: "Live stats restricted",
    };
  } catch (error) {
    return { platform: "LinkedIn", error: "Failed to fetch LinkedIn data" };
  }
}
