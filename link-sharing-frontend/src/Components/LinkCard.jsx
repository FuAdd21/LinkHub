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
  FaGlobe,
  FaSpotify,
  FaFacebook,
} from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const PLATFORM_CONFIG = {
  youtube: {
    icon: FaYoutube,
    color: "#FF0000",
    glow: "rgba(255, 0, 0, 0.3)",
    label: "YouTube",
  },
  github: {
    icon: FaGithub,
    color: "#ffffff",
    glow: "rgba(255, 255, 255, 0.2)",
    label: "GitHub",
  },
  telegram: {
    icon: FaTelegram,
    color: "#0088cc",
    glow: "rgba(0, 136, 204, 0.3)",
    label: "Telegram",
  },
  instagram: {
    icon: FaInstagram,
    color: "#E4405F",
    glow: "rgba(228, 64, 95, 0.3)",
    label: "Instagram",
  },
  twitter: {
    icon: FaTwitter,
    color: "#1DA1F2",
    glow: "rgba(29, 161, 242, 0.3)",
    label: "Twitter",
  },
  linkedin: {
    icon: FaLinkedin,
    color: "#0A66C2",
    glow: "rgba(10, 102, 194, 0.3)",
    label: "LinkedIn",
  },
  tiktok: {
    icon: FaTiktok,
    color: "#ff0050",
    glow: "rgba(255, 0, 80, 0.3)",
    label: "TikTok",
  },
  spotify: {
    icon: FaSpotify,
    color: "#1DB954",
    glow: "rgba(29, 185, 84, 0.3)",
    label: "Spotify",
  },
  facebook: {
    icon: FaFacebook,
    color: "#1877F2",
    glow: "rgba(24, 119, 242, 0.3)",
    label: "Facebook",
  },
};

const LinkCard = ({ link, index, onTrackClick }) => {
  const platform = link.platform || link.icon;
  const config = PLATFORM_CONFIG[platform] || {
    icon: FaGlobe,
    color: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.3)",
    label: "Link",
  };

  const IconComponent = config.icon;

  const handleClick = () => {
    if (onTrackClick) {
      onTrackClick(link.id);
    }
  };

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="block w-full"
    >
      <div
        className="relative flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-white/10 backdrop-blur-md
                   bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group overflow-hidden"
        style={{
          boxShadow: `0 0 0 1px rgba(255,255,255,0.05)`,
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at center, ${config.glow}, transparent 70%)`,
          }}
        />

        {/* Platform icon */}
        <div className="relative z-10 flex-shrink-0">
          <IconComponent
            className="w-5 h-5 transition-colors duration-300"
            style={{ color: config.color }}
          />
        </div>

        {/* Link title */}
        <span className="relative z-10 flex-1 text-white/90 text-sm font-medium truncate group-hover:text-white transition-colors">
          {link.title}
        </span>

        {/* Arrow indicator */}
        <svg
          className="relative z-10 w-4 h-4 text-white/30 group-hover:text-white/60 transition-all duration-300 group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </motion.a>
  );
};

export default LinkCard;
export { PLATFORM_CONFIG };
