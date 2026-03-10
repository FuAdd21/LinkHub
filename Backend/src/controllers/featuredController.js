import { db } from "../config/db.js";

const MAX_FEATURED_USERS = 3;

const SOCIAL_FIELD_MAP = {
  youtubeId: "youtube",
  githubUser: "github",
  telegramUser: "telegram",
  instagram: "instagram",
  twitter: "twitter",
  linkedin: "linkedin",
  tiktok: "tiktok",
};

const FALLBACK_CREATORS = [
  {
    id: "fallback-aurastack",
    username: "aurastack",
    name: "Aura Stack",
    bio: "Creative engineer building immersive product launches and creator systems.",
    avatar: null,
    banner_url: null,
    theme: "dark-pro",
    backgroundType: "gradient",
    backgroundValue: "linear-gradient(180deg, #09111f 0%, #121f37 100%)",
    socials: [
      { platform: "instagram", handle: "aurastack" },
      { platform: "linkedin", handle: "aura-stack" },
      { platform: "spotify", handle: "aura-radio" },
    ],
    links: [
      {
        id: "fallback-link-1",
        title: "Instagram Reels",
        url: "https://instagram.com",
        platform: "instagram",
        icon: "instagram",
      },
      {
        id: "fallback-link-2",
        title: "LinkedIn Studio",
        url: "https://linkedin.com",
        platform: "linkedin",
        icon: "linkedin",
      },
      {
        id: "fallback-link-3",
        title: "Spotify Sessions",
        url: "https://spotify.com",
        platform: "spotify",
        icon: "spotify",
      },
      {
        id: "fallback-link-4",
        title: "Dribbble Portfolio",
        url: "https://dribbble.com",
        platform: "dribbble",
        icon: "dribbble",
      },
    ],
    stats: {
      followers: 184000,
      linkCount: 4,
      socialCount: 3,
    },
    followerCount: 184000,
    isFallback: true,
  },
  {
    id: "fallback-sunframe",
    username: "sunframe",
    name: "Sunframe Studio",
    bio: "Visual storyteller sharing travel films, tools, and behind-the-scenes breakdowns.",
    avatar: null,
    banner_url: null,
    theme: "creator-mode",
    backgroundType: "gradient",
    backgroundValue: "linear-gradient(180deg, #180614 0%, #331228 100%)",
    socials: [
      { platform: "youtube", handle: "@sunframe" },
      { platform: "instagram", handle: "sunframe.studio" },
      { platform: "tiktok", handle: "sunframe" },
    ],
    links: [
      {
        id: "fallback-link-5",
        title: "Latest Film Drop",
        url: "https://youtube.com",
        platform: "youtube",
        icon: "youtube",
      },
      {
        id: "fallback-link-6",
        title: "BTS on TikTok",
        url: "https://tiktok.com",
        platform: "tiktok",
        icon: "tiktok",
      },
      {
        id: "fallback-link-7",
        title: "Travel LUT Pack",
        url: "https://gumroad.com",
        platform: "globe",
        icon: "globe",
      },
      {
        id: "fallback-link-8",
        title: "Instagram Journal",
        url: "https://instagram.com",
        platform: "instagram",
        icon: "instagram",
      },
    ],
    stats: {
      followers: 92000,
      linkCount: 4,
      socialCount: 3,
    },
    followerCount: 92000,
    isFallback: true,
  },
  {
    id: "fallback-glassnote",
    username: "glassnote",
    name: "Glassnote",
    bio: "Brand strategist turning audience signals into refined digital experiences.",
    avatar: null,
    banner_url: null,
    theme: "minimal",
    backgroundType: "solid",
    backgroundValue: "#f6f7fb",
    socials: [
      { platform: "linkedin", handle: "glassnote" },
      { platform: "github", handle: "glassnotehq" },
      { platform: "twitter", handle: "glassnotehq" },
    ],
    links: [
      {
        id: "fallback-link-9",
        title: "Client Case Studies",
        url: "https://notion.so",
        platform: "globe",
        icon: "globe",
      },
      {
        id: "fallback-link-10",
        title: "LinkedIn Essays",
        url: "https://linkedin.com",
        platform: "linkedin",
        icon: "linkedin",
      },
      {
        id: "fallback-link-11",
        title: "GitHub Experiments",
        url: "https://github.com",
        platform: "github",
        icon: "github",
      },
      {
        id: "fallback-link-12",
        title: "Newsletter Archive",
        url: "https://substack.com",
        platform: "globe",
        icon: "globe",
      },
    ],
    stats: {
      followers: 46300,
      linkCount: 4,
      socialCount: 3,
    },
    followerCount: 46300,
    isFallback: true,
  },
];

function safeParseProfileData(rawProfileData) {
  if (!rawProfileData) return null;

  try {
    return typeof rawProfileData === "string"
      ? JSON.parse(rawProfileData)
      : rawProfileData;
  } catch {
    return null;
  }
}

function normalizeSocials(user) {
  return Object.entries(SOCIAL_FIELD_MAP)
    .filter(([field]) => user[field])
    .map(([field, platform]) => ({
      platform,
      handle: user[field],
    }));
}

function extractAudienceValue(profileData) {
  if (!profileData || typeof profileData !== "object") return 0;

  const possibleValues = [
    profileData.followers,
    profileData.subscriberCount,
    profileData.subscribers,
    profileData.connections,
    profileData.memberCount,
    profileData.members,
    profileData.likes,
  ];

  return possibleValues.reduce((total, value) => {
    const numericValue =
      typeof value === "string" ? parseInt(value.replace(/,/g, ""), 10) : value;
    return Number.isFinite(numericValue) && numericValue > 0
      ? total + numericValue
      : total;
  }, 0);
}

function normalizeCreator(user, linksByUserId) {
  const links = (linksByUserId.get(user.id) || []).slice(0, 5);
  const socials = normalizeSocials(user);
  const followerCount = links.reduce((total, link) => {
    return total + extractAudienceValue(link.profileData);
  }, 0);

  return {
    id: user.id,
    username: user.username || user.name,
    name: user.name,
    bio: user.bio || "Creator page powered by LinkHub.",
    avatar: user.avatar || null,
    banner_url: user.banner_url || null,
    theme: user.theme || "dark-pro",
    backgroundType: user.background_type || "gradient",
    backgroundValue: user.background_value || null,
    socials,
    links,
    stats: {
      followers: followerCount,
      linkCount: links.length,
      socialCount: socials.length,
    },
    followerCount,
    isFallback: false,
  };
}

function fillWithFallbackCreators(creators) {
  const seenUsernames = new Set(creators.map((creator) => creator.username));
  const combined = [...creators];

  for (const fallbackCreator of FALLBACK_CREATORS) {
    if (combined.length >= MAX_FEATURED_USERS) break;
    if (seenUsernames.has(fallbackCreator.username)) continue;

    combined.push(fallbackCreator);
    seenUsernames.add(fallbackCreator.username);
  }

  return combined.slice(0, MAX_FEATURED_USERS);
}

export const getFeaturedUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT
        id,
        name,
        username,
        bio,
        avatar,
        banner_url,
        theme,
        background_type,
        background_value,
        youtubeId,
        githubUser,
        telegramUser,
        instagram,
        twitter,
        linkedin,
        tiktok
      FROM clients
      WHERE username IS NOT NULL
        AND TRIM(username) <> ''
      ORDER BY id DESC
      LIMIT 12`,
    );

    if (!users.length) {
      return res.json(FALLBACK_CREATORS.slice(0, MAX_FEATURED_USERS));
    }

    const userIds = users.map((user) => user.id);
    const [links] = await db.query(
      `SELECT
        id,
        user_id,
        title,
        url,
        platform,
        username,
        profileData,
        avatar_url,
        icon,
        position,
        scheduled_at
      FROM links
      WHERE user_id IN (?)
        AND is_visible = 1
        AND (scheduled_at IS NULL OR scheduled_at <= NOW())
      ORDER BY user_id ASC, position ASC, id DESC`,
      [userIds],
    );

    const linksByUserId = links.reduce((grouped, link) => {
      const normalizedLink = {
        id: link.id,
        title: link.title,
        url: link.url,
        platform: link.platform || link.icon || "globe",
        username: link.username,
        icon: link.icon || link.platform || "globe",
        avatarUrl: link.avatar_url || null,
        profileData: safeParseProfileData(link.profileData),
      };

      if (!grouped.has(link.user_id)) {
        grouped.set(link.user_id, []);
      }

      grouped.get(link.user_id).push(normalizedLink);
      return grouped;
    }, new Map());

    const normalizedCreators = users
      .map((user) => normalizeCreator(user, linksByUserId))
      .filter((creator) => creator.username);

    const featuredCreators = fillWithFallbackCreators(normalizedCreators);
    res.json(featuredCreators);
  } catch (err) {
    console.error("getFeaturedUsers error:", err);
    res.status(500).json(FALLBACK_CREATORS.slice(0, MAX_FEATURED_USERS));
  }
};
