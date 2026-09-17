import axios from "axios";
import { formatFollowerCount } from "./youtubeService.js";

const PLACEHOLDER_AVATAR = "/placeholder-avatar.png";

export function cleanGitHubUsername(input) {
  if (!input) return "";
  let u = input.trim();
  if (u.includes("github.com/")) {
    const match = u.match(/github\.com\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
  }
  return u.replace(/^@/, "").split("/")[0].split("?")[0];
}

export async function getGitHubUser(input) {
  const username = cleanGitHubUsername(input);
  try {
    if (!username) {
      return { platform: "GitHub", error: "No username provided" };
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Linkhub-Social-Aggregator/1.0",
        },
      },
    );

    const user = response.data;
    const followers = user.followers || 0;

    return {
      platform: "GitHub",
      username: user.login,
      handle: `@${user.login}`,
      name: user.name || user.login,
      avatar: user.avatar_url || PLACEHOLDER_AVATAR,
      followers,
      formattedFollowers: formatFollowerCount(followers),
      following: user.following || 0,
      repos: user.public_repos || 0,
      bio: user.bio || null,
      profileUrl: `https://github.com/${user.login}`,
    };
  } catch (error) {
    console.error("GitHub service error:", error.message);

    // Handle specific GitHub errors
    if (error.response?.status === 404) {
      return {
        platform: "GitHub",
        name: username,
        avatar: PLACEHOLDER_AVATAR,
        followers: 0,
        following: 0,
        repos: 0,
        bio: null,
        profileUrl: username ? `https://github.com/${username}` : null,
        error: "GitHub user not found",
      };
    }

    // Generic error fallback
    return {
      platform: "GitHub",
      name: username,
      avatar: PLACEHOLDER_AVATAR,
      followers: 0,
      following: 0,
      repos: 0,
      bio: null,
      profileUrl: username ? `https://github.com/${username}` : null,
      error: "Failed to fetch GitHub user data",
    };
  }
}
