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

const PLATFORM_CONFIG = {
  youtube: {
    icon: FaYoutube,
    label: "YouTube",
  },
  github: {
    icon: FaGithub,
    label: "GitHub",
  },
  telegram: {
    icon: FaTelegram,
    label: "Telegram",
  },
  instagram: {
    icon: FaInstagram,
    label: "Instagram",
  },
  twitter: {
    icon: FaTwitter,
    label: "Twitter",
  },
  linkedin: {
    icon: FaLinkedin,
    label: "LinkedIn",
  },
  tiktok: {
    icon: FaTiktok,
    label: "TikTok",
  },
  spotify: {
    icon: FaSpotify,
    label: "Spotify",
  },
  facebook: {
    icon: FaFacebook,
    label: "Facebook",
  },
};

const LinkCard = ({ link, index, onTrackClick }) => {
  const platform = link.platform || link.icon;
  const config = PLATFORM_CONFIG[platform] || {
    icon: FaGlobe,
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
      <div className="relative flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-neutral-900 transition-all duration-200 cursor-pointer group overflow-hidden">
        {/* Platform icon */}
        <div className="relative z-10 flex-shrink-0 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Link title */}
        <span className="relative z-10 flex-1 text-gray-900 dark:text-gray-100 text-sm font-medium truncate group-hover:text-black dark:group-hover:text-white transition-colors">
          {link.title}
        </span>

        {/* Arrow indicator */}
        <svg
          className="relative z-10 w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-all duration-200 group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.a>
  );
};

export default LinkCard;
export { PLATFORM_CONFIG };
