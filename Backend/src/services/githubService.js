import axios from "axios";
import { formatFollowerCount } from "./youtubeService.js";

import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/errorCodes.js";

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
  if (!username) {
    throw AppError.badRequest("Please provide a valid GitHub username or URL", ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Linkhub-Social-Aggregator/1.0",
        },
        timeout: 8000,
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
      label: "FOLLOWERS",
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.response?.status === 404) {
      throw AppError.badRequest(
        `GitHub account '${username}' does not exist on GitHub. Please check the spelling.`,
        ErrorCodes.NOT_FOUND
      );
    }
    if (error.response?.status === 403) {
      throw AppError.badRequest(
        "GitHub API rate limit temporarily reached. Please try again in a few minutes.",
        ErrorCodes.RATE_LIMIT_EXCEEDED
      );
    }
    throw AppError.badRequest(
      `Failed to verify GitHub user '${username}': ${error.message}`,
      ErrorCodes.VALIDATION_ERROR
    );
  }
}
