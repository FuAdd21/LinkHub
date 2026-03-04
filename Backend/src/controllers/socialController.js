import { fetchSocialProfile } from "../services/socialFetchService.js";
import { getYouTubeChannel } from "../services/youtubeService.js";
import { getGitHubUser } from "../services/githubService.js";
import { getTelegramChannel } from "../services/telegramService.js";
import { getInstagramProfile } from "../services/instagramService.js";
import { getTwitterProfile } from "../services/twitterService.js";
import { getLinkedInProfile } from "../services/linkedinService.js";
import { getTikTokProfile } from "../services/tiktokService.js";
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
    const { youtube, github, telegram, instagram, twitter, linkedin, tiktok } =
      req.query;

    console.log("Social controller called with:", {
      youtube,
      github,
      telegram,
      instagram,
      twitter,
      linkedin,
      tiktok,
    });

    // Return empty object if no params provided
    if (
      !youtube &&
      !github &&
      !telegram &&
      !instagram &&
      !twitter &&
      !linkedin &&
      !tiktok
    ) {
      return res.status(400).json({
        message: "At least one platform parameter is required",
        youtube: null,
        github: null,
        telegram: null,
        instagram: null,
        twitter: null,
        linkedin: null,
        tiktok: null,
      });
    }

    // Generate cache key based on query params
    const cacheKey = `socials:youtube=${youtube || "null"}:github=${github || "null"}:telegram=${telegram || "null"}:instagram=${instagram || "null"}:twitter=${twitter || "null"}:linkedin=${linkedin || "null"}:tiktok=${tiktok || "null"}`;

    // Check cache first
    const cachedResult = getCache(cacheKey);
    if (cachedResult) {
      console.log("Cache HIT for key:", cacheKey);
      return res.json(cachedResult);
    }

    console.log("Cache MISS for key:", cacheKey);

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

    if (instagram) {
      promises.push({
        platform: "instagram",
        promise: getInstagramProfile(instagram),
      });
    }

    if (twitter) {
      promises.push({
        platform: "twitter",
        promise: getTwitterProfile(twitter),
      });
    }

    if (linkedin) {
      promises.push({
        platform: "linkedin",
        promise: getLinkedInProfile(linkedin),
      });
    }

    if (tiktok) {
      promises.push({
        platform: "tiktok",
        promise: getTikTokProfile(tiktok),
      });
    }

    console.log(
      "Prepared promises for platforms:",
      promises.map((p) => p.platform),
    );

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
        console.log(`${item.platform} service success:`, result.value);
      } else {
        console.error(`${item.platform} service failed:`, result.reason);
        results[item.platform] = {
          platform:
            item.platform.charAt(0).toUpperCase() + item.platform.slice(1),
          error: "Failed to fetch profile data",
        };
      }
    });

    console.log("Final results:", results);

    // Cache only successful responses (no errors in any platform)
    const hasErrors = Object.values(results).some((result) => result.error);
    if (!hasErrors) {
      setCache(cacheKey, results);
      console.log("Cache SET for key:", cacheKey);
    }

    res.json(results);
  } catch (error) {
    console.error("fetchSocialProfiles error:", error);
    res.status(500).json({ message: "Failed to fetch social profiles" });
  }
};
