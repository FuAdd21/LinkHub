import { fetchSocialProfile } from "../services/socialFetchService.js";
import { getYouTubeChannel } from "../services/youtubeService.js";
import { getGitHubUser } from "../services/githubService.js";
import { getTelegramChannel } from "../services/telegramService.js";
import { getCache, setCache } from "../utils/cache.js";

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
    const { youtube, github, telegram } = req.query;

    // Return empty object if no params provided
    if (!youtube && !github && !telegram) {
      return res.status(400).json({
        message: "At least one of youtube, github, or telegram is required",
        youtube: null,
        github: null,
        telegram: null,
      });
    }

    // Generate cache key based on query params
    const cacheKey = `socials:youtube=${youtube || "null"}:github=${github || "null"}:telegram=${telegram || "null"}`;

    // Check cache first
    const cachedResult = getCache(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const promises = [];

    // Prepare promises for each platform if provided
    if (youtube) {
      promises.push({
        platform: "youtube",
        promise: getYouTubeChannel(youtube),
      });
    }

    if (github) {
      promises.push({
        platform: "github",
        promise: getGitHubUser(github),
      });
    }

    if (telegram) {
      promises.push({
        platform: "telegram",
        promise: getTelegramChannel(telegram),
      });
    }

    // Execute all promises with resilience
    const results = {};
    const settledResults = await Promise.allSettled(
      promises.map((p) => p.promise),
    );

    // Map results back to platforms
    promises.forEach((item, index) => {
      const result = settledResults[index];
      if (result.status === "fulfilled") {
        results[item.platform] = result.value;
      } else {
        console.error(`${item.platform} service failed:`, result.reason);
        results[item.platform] = {
          platform:
            item.platform.charAt(0).toUpperCase() + item.platform.slice(1),
          error: "Failed to fetch profile data",
        };
      }
    });

    // Cache only successful responses (no errors in any platform)
    const hasErrors = Object.values(results).some((result) => result.error);
    if (!hasErrors) {
      setCache(cacheKey, results);
    }

    res.json(results);
  } catch (error) {
    console.error("fetchSocialProfiles error:", error);
    res.status(500).json({ message: "Failed to fetch social profiles" });
  }
};
