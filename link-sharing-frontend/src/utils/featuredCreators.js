const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

export const FEATURED_CREATORS_CACHE_TTL = 5 * 60 * 1000;

export const FEATURED_FALLBACK_CREATORS = [
  {
    id: "fallback-aurastack",
    username: "aurastack",
    name: "Aura Stack",
    bio: "Creative engineer building immersive product launches and creator systems.",
    avatar: null,
    theme: "glass-dark",
    backgroundType: "gradient",
    backgroundValue: "linear-gradient(180deg, #0d172b 0%, #172440 100%)",
    socials: [
      { platform: "instagram", handle: "aurastack" },
      { platform: "linkedin", handle: "aura-stack" },
      { platform: "spotify", handle: "aura-radio" },
    ],
    links: [
      { id: "fallback-link-1", title: "Instagram Reels", url: "https://instagram.com", platform: "instagram", icon: "instagram" },
      { id: "fallback-link-2", title: "LinkedIn Studio", url: "https://linkedin.com", platform: "linkedin", icon: "linkedin" },
      { id: "fallback-link-3", title: "Spotify Sessions", url: "https://spotify.com", platform: "spotify", icon: "spotify" },
      { id: "fallback-link-4", title: "Dribbble Portfolio", url: "https://dribbble.com", platform: "dribbble", icon: "dribbble" },
    ],
    stats: { followers: 184000, linkCount: 4, socialCount: 3 },
    followerCount: 184000,
    isFallback: true,
  },
  {
    id: "fallback-sunframe",
    username: "sunframe",
    name: "Sunframe Studio",
    bio: "Visual storyteller sharing travel films, tools, and behind-the-scenes breakdowns.",
    avatar: null,
    theme: "creator-mode",
    backgroundType: "gradient",
    backgroundValue: "linear-gradient(180deg, #1c0714 0%, #35162a 100%)",
    socials: [
      { platform: "youtube", handle: "@sunframe" },
      { platform: "instagram", handle: "sunframe.studio" },
      { platform: "tiktok", handle: "sunframe" },
    ],
    links: [
      { id: "fallback-link-5", title: "Latest Film Drop", url: "https://youtube.com", platform: "youtube", icon: "youtube" },
      { id: "fallback-link-6", title: "BTS on TikTok", url: "https://tiktok.com", platform: "tiktok", icon: "tiktok" },
      { id: "fallback-link-7", title: "Travel LUT Pack", url: "https://gumroad.com", platform: "globe", icon: "globe" },
      { id: "fallback-link-8", title: "Instagram Journal", url: "https://instagram.com", platform: "instagram", icon: "instagram" },
    ],
    stats: { followers: 92000, linkCount: 4, socialCount: 3 },
    followerCount: 92000,
    isFallback: true,
  },
  {
    id: "fallback-glassnote",
    username: "glassnote",
    name: "Glassnote",
    bio: "Brand strategist turning audience signals into refined digital experiences.",
    avatar: null,
    theme: "minimal",
    backgroundType: "solid",
    backgroundValue: "#f6f7fb",
    socials: [
      { platform: "linkedin", handle: "glassnote" },
      { platform: "github", handle: "glassnotehq" },
      { platform: "twitter", handle: "glassnotehq" },
    ],
    links: [
      { id: "fallback-link-9", title: "Client Case Studies", url: "https://notion.so", platform: "globe", icon: "globe" },
      { id: "fallback-link-10", title: "LinkedIn Essays", url: "https://linkedin.com", platform: "linkedin", icon: "linkedin" },
      { id: "fallback-link-11", title: "GitHub Experiments", url: "https://github.com", platform: "github", icon: "github" },
      { id: "fallback-link-12", title: "Newsletter Archive", url: "https://substack.com", platform: "globe", icon: "globe" },
    ],
    stats: { followers: 46300, linkCount: 4, socialCount: 3 },
    followerCount: 46300,
    isFallback: true,
  },
];

const THEME_PRESETS = {
  "dark-pro": {
    label: "Dark Pro",
    phoneShell: "linear-gradient(180deg, rgba(17, 24, 39, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)",
    phoneBorder: "rgba(255, 255, 255, 0.12)",
    notch: "rgba(2, 6, 23, 0.9)",
    screenBackground: "linear-gradient(180deg, #09111f 0%, #111c33 100%)",
    screenBorder: "rgba(255, 255, 255, 0.08)",
    headerGlow: "radial-gradient(circle at top, rgba(99, 102, 241, 0.32), transparent 62%)",
    accent: "#8b5cf6",
    accentGlow: "radial-gradient(circle, rgba(99, 102, 241, 0.45), transparent 72%)",
    text: "#f8fafc",
    mutedText: "rgba(226, 232, 240, 0.72)",
    softText: "rgba(226, 232, 240, 0.48)",
    statCard: "rgba(255, 255, 255, 0.08)",
    statBorder: "rgba(255, 255, 255, 0.08)",
    socialBg: "rgba(255, 255, 255, 0.08)",
    socialBorder: "rgba(255, 255, 255, 0.08)",
    linkBg: "rgba(255, 255, 255, 0.08)",
    linkBorder: "rgba(255, 255, 255, 0.08)",
    linkText: "#f8fafc",
    badgeBg: "rgba(255, 255, 255, 0.08)",
    badgeBorder: "rgba(255, 255, 255, 0.1)",
    shadow: "0 32px 90px rgba(15, 23, 42, 0.42)",
  },
  "glass-dark": {
    label: "Glass Dark",
    phoneShell: "linear-gradient(180deg, rgba(24, 34, 54, 0.96) 0%, rgba(9, 14, 28, 0.98) 100%)",
    phoneBorder: "rgba(255, 255, 255, 0.14)",
    notch: "rgba(10, 15, 25, 0.92)",
    screenBackground: "linear-gradient(180deg, rgba(11, 20, 35, 0.86) 0%, rgba(26, 38, 62, 0.92) 100%)",
    screenBorder: "rgba(255, 255, 255, 0.09)",
    headerGlow: "radial-gradient(circle at top, rgba(56, 189, 248, 0.28), transparent 58%)",
    accent: "#38bdf8",
    accentGlow: "radial-gradient(circle, rgba(56, 189, 248, 0.42), transparent 72%)",
    text: "#eff6ff",
    mutedText: "rgba(191, 219, 254, 0.76)",
    softText: "rgba(191, 219, 254, 0.46)",
    statCard: "rgba(255, 255, 255, 0.08)",
    statBorder: "rgba(255, 255, 255, 0.1)",
    socialBg: "rgba(255, 255, 255, 0.08)",
    socialBorder: "rgba(255, 255, 255, 0.08)",
    linkBg: "rgba(255, 255, 255, 0.09)",
    linkBorder: "rgba(255, 255, 255, 0.08)",
    linkText: "#eff6ff",
    badgeBg: "rgba(255, 255, 255, 0.08)",
    badgeBorder: "rgba(255, 255, 255, 0.1)",
    shadow: "0 32px 90px rgba(8, 15, 31, 0.46)",
  },
  "neon-glow": {
    label: "Neon Theme",
    phoneShell: "linear-gradient(180deg, rgba(10, 6, 28, 0.98) 0%, rgba(5, 11, 23, 0.98) 100%)",
    phoneBorder: "rgba(0, 255, 170, 0.16)",
    notch: "rgba(2, 8, 18, 0.92)",
    screenBackground: "linear-gradient(180deg, #09061c 0%, #10172f 100%)",
    screenBorder: "rgba(0, 255, 170, 0.12)",
    headerGlow: "radial-gradient(circle at top, rgba(0, 255, 170, 0.28), transparent 58%)",
    accent: "#00f5b0",
    accentGlow: "radial-gradient(circle, rgba(0, 255, 170, 0.42), transparent 72%)",
    text: "#ecfeff",
    mutedText: "rgba(167, 243, 208, 0.78)",
    softText: "rgba(167, 243, 208, 0.42)",
    statCard: "rgba(0, 255, 170, 0.08)",
    statBorder: "rgba(0, 255, 170, 0.14)",
    socialBg: "rgba(0, 255, 170, 0.08)",
    socialBorder: "rgba(0, 255, 170, 0.12)",
    linkBg: "rgba(0, 255, 170, 0.08)",
    linkBorder: "rgba(0, 255, 170, 0.12)",
    linkText: "#ecfeff",
    badgeBg: "rgba(0, 255, 170, 0.08)",
    badgeBorder: "rgba(0, 255, 170, 0.14)",
    shadow: "0 32px 90px rgba(0, 255, 170, 0.14)",
  },
  minimal: {
    label: "Minimal",
    phoneShell: "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(237, 242, 247, 0.98) 100%)",
    phoneBorder: "rgba(15, 23, 42, 0.1)",
    notch: "rgba(226, 232, 240, 0.88)",
    screenBackground: "linear-gradient(180deg, #ffffff 0%, #f6f7fb 100%)",
    screenBorder: "rgba(15, 23, 42, 0.08)",
    headerGlow: "radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 55%)",
    accent: "#6366f1",
    accentGlow: "radial-gradient(circle, rgba(99, 102, 241, 0.22), transparent 72%)",
    text: "#0f172a",
    mutedText: "rgba(15, 23, 42, 0.7)",
    softText: "rgba(15, 23, 42, 0.42)",
    statCard: "rgba(15, 23, 42, 0.04)",
    statBorder: "rgba(15, 23, 42, 0.08)",
    socialBg: "rgba(15, 23, 42, 0.04)",
    socialBorder: "rgba(15, 23, 42, 0.08)",
    linkBg: "rgba(15, 23, 42, 0.04)",
    linkBorder: "rgba(15, 23, 42, 0.08)",
    linkText: "#0f172a",
    badgeBg: "rgba(15, 23, 42, 0.04)",
    badgeBorder: "rgba(15, 23, 42, 0.08)",
    shadow: "0 32px 90px rgba(148, 163, 184, 0.34)",
  },
  "creator-mode": {
    label: "Gradient Theme",
    phoneShell: "linear-gradient(180deg, rgba(44, 10, 33, 0.98) 0%, rgba(18, 10, 34, 0.98) 100%)",
    phoneBorder: "rgba(251, 146, 60, 0.16)",
    notch: "rgba(24, 8, 27, 0.92)",
    screenBackground: "linear-gradient(180deg, #240c1f 0%, #3f1330 100%)",
    screenBorder: "rgba(255, 255, 255, 0.08)",
    headerGlow: "radial-gradient(circle at top, rgba(251, 146, 60, 0.24), transparent 58%)",
    accent: "#fb923c",
    accentGlow: "radial-gradient(circle, rgba(249, 115, 22, 0.34), transparent 72%)",
    text: "#fff7ed",
    mutedText: "rgba(254, 215, 170, 0.76)",
    softText: "rgba(254, 215, 170, 0.44)",
    statCard: "rgba(255, 255, 255, 0.08)",
    statBorder: "rgba(255, 255, 255, 0.08)",
    socialBg: "rgba(255, 255, 255, 0.08)",
    socialBorder: "rgba(255, 255, 255, 0.08)",
    linkBg: "rgba(255, 255, 255, 0.08)",
    linkBorder: "rgba(255, 255, 255, 0.08)",
    linkText: "#fff7ed",
    badgeBg: "rgba(255, 255, 255, 0.08)",
    badgeBorder: "rgba(255, 255, 255, 0.08)",
    shadow: "0 32px 90px rgba(59, 18, 39, 0.42)",
  },
};

export const THEME_SHOWCASE_PRESETS = [
  { id: "dark-pro", title: "Dark theme", description: "High-contrast layouts for polished creator brands." },
  { id: "neon-glow", title: "Neon theme", description: "Electric accents for gaming, music, and culture creators." },
  { id: "glass-dark", title: "Glass theme", description: "Blurred panels and layered depth for premium personal brands." },
  { id: "minimal", title: "Minimal theme", description: "Clean surfaces for consultants, writers, and product teams." },
];

function normalizeSocials(socials) {
  if (Array.isArray(socials)) {
    return socials.filter(Boolean).map((social) => ({
      platform: social.platform || social.label || "globe",
      handle: social.handle || social.username || social.value || "",
    }));
  }

  if (!socials || typeof socials !== "object") {
    return [];
  }

  return Object.entries(socials)
    .filter(([, handle]) => Boolean(handle))
    .map(([platform, handle]) => ({ platform, handle }));
}

function normalizeLinks(links) {
  if (!Array.isArray(links)) return [];

  return links
    .filter(Boolean)
    .map((link, index) => ({
      id: link.id || `link-${index}`,
      title: link.title || link.label || link.platform || "Creator link",
      url: link.url || "#",
      platform: link.platform || link.icon || "globe",
      icon: link.icon || link.platform || "globe",
      username: link.username || "",
      profileData: link.profileData || null,
      avatarUrl: link.avatarUrl || link.avatar_url || null,
    }));
}

export function formatCompactNumber(value) {
  const numericValue = Number(value) || 0;

  if (numericValue >= 1_000_000) {
    return `${(numericValue / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (numericValue >= 1_000) {
    return `${(numericValue / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return `${numericValue}`;
}

export function normalizeCreator(creator) {
  if (!creator) return null;

  const socials = normalizeSocials(creator.socials);
  const links = normalizeLinks(creator.links);
  const followers = Number(creator.followerCount ?? creator.stats?.followers ?? 0) || 0;

  return {
    ...creator,
    id: creator.id || creator.username || creator.name,
    username: creator.username || creator.name || "creator",
    name: creator.name || creator.username || "Creator",
    bio: creator.bio || "Creator page powered by LinkHub.",
    avatar: creator.avatar || null,
    theme: creator.theme || "glass-dark",
    backgroundType: creator.backgroundType || creator.background_type || "gradient",
    backgroundValue: creator.backgroundValue || creator.background_value || null,
    socials,
    links,
    stats: {
      followers,
      linkCount: Number(creator.stats?.linkCount ?? links.length) || links.length,
      socialCount: Number(creator.stats?.socialCount ?? socials.length) || socials.length,
    },
    followerCount: followers,
    isFallback: Boolean(creator.isFallback),
  };
}

export function resolveFeaturedCreators(creators, limit = 3) {
  const normalizedCreators = Array.isArray(creators)
    ? creators.map(normalizeCreator).filter(Boolean)
    : [];
  const fallbackCreators = FEATURED_FALLBACK_CREATORS.map(normalizeCreator);

  const baseCreators = normalizedCreators.length ? normalizedCreators : fallbackCreators;
  const seenIds = new Set(baseCreators.map((creator) => creator.id));
  const mergedCreators = [...baseCreators];

  for (const fallbackCreator of fallbackCreators) {
    if (mergedCreators.length >= limit) break;
    if (seenIds.has(fallbackCreator.id)) continue;
    mergedCreators.push(fallbackCreator);
  }

  return mergedCreators.slice(0, limit);
}

export function resolveAssetUrl(assetPath) {
  if (!assetPath) return null;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  if (assetPath.startsWith("data:")) return assetPath;
  return `${API_BASE_URL}${assetPath.startsWith("/") ? assetPath : `/${assetPath}`}`;
}

function resolveBackground(preset, backgroundType, backgroundValue) {
  if (backgroundValue) {
    return backgroundValue;
  }

  return preset.screenBackground;
}

export function getCreatorTheme(theme, backgroundType, backgroundValue) {
  const preset = THEME_PRESETS[theme] || THEME_PRESETS["glass-dark"];

  return {
    ...preset,
    screenBackground: resolveBackground(preset, backgroundType, backgroundValue),
  };
}

export function getCreatorInitial(value) {
  return (value || "C").trim().charAt(0).toUpperCase();
}

export { API_BASE_URL };


