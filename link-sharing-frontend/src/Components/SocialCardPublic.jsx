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
} from "react-icons/fa";

const SOCIAL_CONFIG = {
  youtube: {
    icon: FaYoutube,
    color: "#FF0000",
    bg: "rgba(255, 0, 0, 0.1)",
    border: "rgba(255, 0, 0, 0.2)",
    label: "YouTube",
    urlPrefix: "https://youtube.com/@",
  },
  github: {
    icon: FaGithub,
    color: "#ffffff",
    bg: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.15)",
    label: "GitHub",
    urlPrefix: "https://github.com/",
  },
  telegram: {
    icon: FaTelegram,
    color: "#0088cc",
    bg: "rgba(0, 136, 204, 0.1)",
    border: "rgba(0, 136, 204, 0.2)",
    label: "Telegram",
    urlPrefix: "https://t.me/",
  },
  instagram: {
    icon: FaInstagram,
    color: "#E4405F",
    bg: "rgba(228, 64, 95, 0.1)",
    border: "rgba(228, 64, 95, 0.2)",
    label: "Instagram",
    urlPrefix: "https://instagram.com/",
  },
  twitter: {
    icon: FaTwitter,
    color: "#1DA1F2",
    bg: "rgba(29, 161, 242, 0.1)",
    border: "rgba(29, 161, 242, 0.2)",
    label: "Twitter / X",
    urlPrefix: "https://twitter.com/",
  },
  linkedin: {
    icon: FaLinkedin,
    color: "#0A66C2",
    bg: "rgba(10, 102, 194, 0.1)",
    border: "rgba(10, 102, 194, 0.2)",
    label: "LinkedIn",
    urlPrefix: "https://linkedin.com/in/",
  },
  tiktok: {
    icon: FaTiktok,
    color: "#ff0050",
    bg: "rgba(255, 0, 80, 0.1)",
    border: "rgba(255, 0, 80, 0.2)",
    label: "TikTok",
    urlPrefix: "https://tiktok.com/@",
  },
};

const SocialCardPublic = ({ platform, username, index }) => {
  const config = SOCIAL_CONFIG[platform];
  if (!config || !username) return null;

  const IconComponent = config.icon;
  const profileUrl = `${config.urlPrefix}${username}`;

  return (
    <motion.a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border backdrop-blur-sm
                 transition-all duration-300 hover:shadow-lg cursor-pointer group"
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      <IconComponent
        className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
        style={{ color: config.color }}
      />
      <span className="text-[10px] text-white/50 font-medium">
        {config.label}
      </span>
    </motion.a>
  );
};

export default SocialCardPublic;
export { SOCIAL_CONFIG };
