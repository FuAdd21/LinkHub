import axios from "axios";
import { JSDOM } from "jsdom";

const PLACEHOLDER_AVATAR = "/placeholder-avatar.png";

function extractInstagramUsername(input) {
  if (!input) return null;

  // Extract from instagram.com URL
  if (input.includes("instagram.com/")) {
    const match = input.match(/instagram\.com\/([a-zA-Z0-9_.]+)(?:\/|$|\?)/);
    if (match) return match[1].split("?")[0]; // Remove query params
  }

  // Remove @ if present
  return input.replace(/^@/, "");
}

async function fetchInstagramMetadata(username) {
  try {
    console.log(`Fetching Instagram metadata for username: ${username}`);
    const response = await axios.get(`https://www.instagram.com/${username}/`, {
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Extract meta tags
    const ogImage = document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content");
    const ogTitle = document
      .querySelector('meta[property="og:title"]')
      ?.getAttribute("content");
    const ogDescription = document
      .querySelector('meta[property="og:description"]')
      ?.getAttribute("content");

    console.log("Instagram meta tags extracted:", {
      ogImage: ogImage ? "found" : "not found",
      ogTitle: ogTitle || "not found",
      ogDescription: ogDescription || "not found",
    });

    // Try to extract followers from description
    let followers = 0;
    if (ogDescription) {
      const followersMatch = ogDescription.match(
        /([\d,]+)\s*(?:followers|Followers)/,
      );
      if (followersMatch) {
        followers = parseInt(followersMatch[1].replace(/,/g, ""));
      }
    }

    console.log("Instagram followers extracted:", followers);

    return {
      name: ogTitle?.split("•")[0]?.trim() || username,
      avatar: ogImage || PLACEHOLDER_AVATAR,
      bio: ogDescription || null,
      followers,
    };
  } catch (error) {
    console.warn("Instagram metadata fetch failed:", error.message);
    return null;
  }
}

export async function getInstagramProfile(input) {
  try {
    console.log("Instagram service called with input:", input);

    if (!input) {
      return { platform: "Instagram", error: "No username or URL provided" };
    }

    const username = extractInstagramUsername(input);
    console.log("Instagram extracted username:", username);

    if (!username) {
      return {
        platform: "Instagram",
        error: "Invalid Instagram username or URL",
      };
    }

    // Try metadata extraction
    const metadata = await fetchInstagramMetadata(username);
    console.log("Instagram metadata result:", metadata);

    if (metadata) {
      return {
        platform: "Instagram",
        username,
        name: metadata.name,
        avatar: metadata.avatar,
        bio: metadata.bio,
        followers: metadata.followers,
        profileUrl: `https://instagram.com/${username}`,
      };
    }

    // Fallback response
    return {
      platform: "Instagram",
      username,
      name: username,
      avatar: PLACEHOLDER_AVATAR,
      bio: null,
      followers: 0,
      profileUrl: `https://instagram.com/${username}`,
      error: "Unable to fetch Instagram data",
    };
  } catch (error) {
    console.error("Instagram service error:", error.message);
    const username = extractInstagramUsername(input);
    return {
      platform: "Instagram",
      username: username || input,
      name: username || input,
      avatar: PLACEHOLDER_AVATAR,
      bio: null,
      followers: 0,
      profileUrl: username ? `https://instagram.com/${username}` : null,
      error: "Failed to fetch Instagram profile",
    };
  }
}
