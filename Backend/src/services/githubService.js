import axios from "axios";

const PLACEHOLDER_AVATAR = "/placeholder-avatar.png";

export async function getGitHubUser(username) {
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

    return {
      platform: "GitHub",
      username: user.login,
      name: user.name || user.login,
      avatar: user.avatar_url || PLACEHOLDER_AVATAR,
      followers: user.followers || 0,
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
