import { fetchSocialProfile } from "../services/socialFetchService.js";
import { getYouTubeChannel } from "../services/youtubeService.js";
import { getGitHubUser } from "../services/githubService.js";
import { getTelegramChannel } from "../services/telegramService.js";

export const fetchSocialProfileData = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const result = await fetchSocialProfile(url);

    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }

    res.json({
      platform: result.platform,
      username: result.username,
      avatar: result.avatar,
      displayName: result.displayName,
      profileUrl: result.profileUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch social profile" });
  }
};

export const fetchSocialProfiles = async (req, res) => {
  try {
    const { youtubeId, githubUser, telegramUser } = req.query;

    const results = {};

    // Fetch YouTube if provided
    if (youtubeId) {
      results.youtube = await getYouTubeChannel(youtubeId);
    }

    // Fetch GitHub if provided
    if (githubUser) {
      results.github = await getGitHubUser(githubUser);
    }

    // Fetch Telegram if provided
    if (telegramUser) {
      results.telegram = await getTelegramChannel(telegramUser);
    }

    // Return empty object if no params provided
    if (!youtubeId && !githubUser && !telegramUser) {
      return res.status(400).json({
        message:
          "At least one of youtubeId, githubUser, or telegramUser is required",
        youtube: null,
        github: null,
        telegram: null,
      });
    }

    res.json(results);
  } catch (error) {
    console.error("fetchSocialProfiles error:", error);
    res.status(500).json({ message: "Failed to fetch social profiles" });
  }
};
