import React from "react";
import { motion } from "framer-motion";
import {
  FaYoutube,
  FaGithub,
  FaTelegram,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTiktok,
  FaExternalLinkAlt,
} from "react-icons/fa";

const PLATFORM_CONFIG = {
  youtube: {
    icon: FaYoutube,
    color: "#FF0000",
    bg: "rgba(255, 0, 0, 0.08)",
    border: "rgba(255, 0, 0, 0.15)",
    glow: "rgba(255, 0, 0, 0.2)",
    label: "YouTube",
    visitLabel: "Visit Channel",
    urlPrefix: "https://youtube.com/@",
    formatStats: (data) => {
      if (data.subscriberCount || data.subscribers) {
        const count = data.subscriberCount || data.subscribers;
        return `${formatNumber(count)} subscribers`;
      }
      return null;
    },
    getSecondary: (data) =>
      data.videoCount ? `${formatNumber(data.videoCount)} videos` : null,
  },
  github: {
    icon: FaGithub,
    color: "#e6edf3",
    bg: "rgba(255, 255, 255, 0.04)",
    border: "rgba(255, 255, 255, 0.1)",
    glow: "rgba(255, 255, 255, 0.1)",
    label: "GitHub",
    visitLabel: "View Profile",
    urlPrefix: "https://github.com/",
    formatStats: (data) => {
      if (data.followers !== undefined) {
        return `${formatNumber(data.followers)} followers`;
      }
      return null;
    },
    getSecondary: (data) =>
      data.publicRepos || data.public_repos
        ? `${data.publicRepos || data.public_repos} repos`
        : null,
  },
  telegram: {
    icon: FaTelegram,
    color: "#0088cc",
    bg: "rgba(0, 136, 204, 0.08)",
    border: "rgba(0, 136, 204, 0.15)",
    glow: "rgba(0, 136, 204, 0.2)",
    label: "Telegram",
    visitLabel: "Join Channel",
    urlPrefix: "https://t.me/",
    formatStats: (data) => {
      if (data.members || data.memberCount) {
        const count = data.members || data.memberCount;
        return `${formatNumber(count)} members`;
      }
      return null;
    },
    getSecondary: () => null,
  },
  instagram: {
    icon: FaInstagram,
    color: "#E4405F",
    bg: "rgba(228, 64, 95, 0.08)",
    border: "rgba(228, 64, 95, 0.15)",
    glow: "rgba(228, 64, 95, 0.2)",
    label: "Instagram",
    visitLabel: "View Profile",
    urlPrefix: "https://instagram.com/",
    formatStats: (data) => {
      if (data.followers !== undefined) {
        return `${formatNumber(data.followers)} followers`;
      }
      return null;
    },
    getSecondary: () => null,
  },
  twitter: {
    icon: FaTwitter,
    color: "#1DA1F2",
    bg: "rgba(29, 161, 242, 0.08)",
    border: "rgba(29, 161, 242, 0.15)",
    glow: "rgba(29, 161, 242, 0.2)",
    label: "Twitter / X",
    visitLabel: "View Profile",
    urlPrefix: "https://twitter.com/",
    formatStats: (data) => {
      if (data.followers !== undefined) {
        return `${formatNumber(data.followers)} followers`;
      }
      return null;
    },
    getSecondary: () => null,
  },
  linkedin: {
    icon: FaLinkedin,
    color: "#0A66C2",
    bg: "rgba(10, 102, 194, 0.08)",
    border: "rgba(10, 102, 194, 0.15)",
    glow: "rgba(10, 102, 194, 0.2)",
    label: "LinkedIn",
    visitLabel: "View Profile",
    urlPrefix: "https://linkedin.com/in/",
    formatStats: (data) => {
      if (data.followers !== undefined || data.connections !== undefined) {
        const count = data.followers || data.connections;
        return `${formatNumber(count)} connections`;
      }
      return null;
    },
    getSecondary: () => null,
  },
  tiktok: {
    icon: FaTiktok,
    color: "#ff0050",
    bg: "rgba(255, 0, 80, 0.08)",
    border: "rgba(255, 0, 80, 0.15)",
    glow: "rgba(255, 0, 80, 0.2)",
    label: "TikTok",
    visitLabel: "View Profile",
    urlPrefix: "https://tiktok.com/@",
    formatStats: (data) => {
      if (data.followers !== undefined) {
        return `${formatNumber(data.followers)} followers`;
      }
      return null;
    },
    getSecondary: (data) =>
      data.likes !== undefined ? `${formatNumber(data.likes)} likes` : null,
  },
};

function formatNumber(num) {
  if (num === undefined || num === null) return "0";
  const n = typeof num === "string" ? parseInt(num, 10) : num;
  if (isNaN(n)) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

// ── Skeleton Card ──
export const SocialCardSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse">
    <div className="w-12 h-12 rounded-full bg-white/10 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="w-24 h-3 rounded-full bg-white/10" />
      <div className="w-16 h-2.5 rounded-full bg-white/8" />
      <div className="w-20 h-2.5 rounded-full bg-white/5" />
    </div>
  </div>
);

// ── Disconnected State ──
const SocialCardDisconnected = ({ platform, index }) => {
  const config = PLATFORM_CONFIG[platform];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] opacity-50"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.bg }}
      >
        <Icon className="w-5 h-5" style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[var(--text-primary)] text-sm font-medium">
          {config.label}
        </p>
        <p className="text-[var(--text-muted)] text-xs mt-0.5">
          Social profile not connected
        </p>
      </div>
    </motion.div>
  );
};

// ── Main Rich Card ──
const SocialProfileCard = ({ platform, data, index, showDisconnected = false }) => {
  const config = PLATFORM_CONFIG[platform];
  if (!config) return null;

  // If no data or error, show disconnected state
  if (!data || data.error) {
    if (showDisconnected) return <SocialCardDisconnected platform={platform} index={index} />;
    return null;
  }

  const Icon = config.icon;
  const avatar = data.avatar || data.profileImage || data.photo;
  const displayName = data.displayName || data.name || data.title || data.username || platform;
  const bio = data.bio || data.description || null;
  const stats = config.formatStats(data);
  const secondary = config.getSecondary(data);
  const profileUrl = data.profileUrl || data.url || `${config.urlPrefix}${data.username || ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className="group relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden"
      style={{
        borderColor: config.border,
        backgroundColor: config.bg,
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${config.glow}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 relative">
          <div
            className="absolute inset-0 rounded-full blur-sm opacity-40"
            style={{ backgroundColor: config.color }}
          />
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2"
               style={{ borderColor: config.border }}>
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-full h-full items-center justify-center ${avatar ? "hidden" : "flex"}`}
              style={{ backgroundColor: config.bg }}
            >
              <Icon className="w-5 h-5" style={{ color: config.color }} />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: config.color }} />
            <span className="text-[var(--text-primary)] text-sm font-semibold truncate">
              {displayName}
            </span>
          </div>

          {/* Stats row */}
          {(stats || secondary) && (
            <div className="flex items-center gap-2 mt-1">
              {stats && (
                <span className="text-[var(--text-secondary)] text-xs">{stats}</span>
              )}
              {stats && secondary && (
                <span className="text-[var(--text-muted)] text-xs">·</span>
              )}
              {secondary && (
                <span className="text-[var(--text-muted)] text-xs">{secondary}</span>
              )}
            </div>
          )}

          {/* Bio */}
          {bio && (
            <p className="text-[var(--text-muted)] text-[11px] mt-1 truncate max-w-[250px]">
              {bio}
            </p>
          )}
        </div>

        {/* Visit button */}
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: config.bg,
            color: config.color,
            border: `1px solid ${config.border}`,
          }}
        >
          <span className="hidden sm:inline">{config.visitLabel}</span>
          <FaExternalLinkAlt className="w-2.5 h-2.5" />
        </a>
      </div>
    </motion.div>
  );
};

export default SocialProfileCard;
export { PLATFORM_CONFIG, formatNumber };
