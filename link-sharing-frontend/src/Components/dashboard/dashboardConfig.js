import {
  BarChart3,
  Globe2,
  LayoutDashboard,
  Link2,
  Palette,
  Settings2,
  UserCircle2,
} from "lucide-react";

import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export const DASHBOARD_NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    description: "Overview and creator momentum",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/dashboard/my-page",
    label: "My Page",
    description: "Profile, bio, and avatar",
    icon: Globe2,
  },
  {
    to: "/dashboard/links",
    label: "Links",
    description: "Manage the links on your page",
    icon: Link2,
  },
  {
    to: "/dashboard/themes",
    label: "Themes",
    description: "Change the look of your page",
    icon: Palette,
  },
  {
    to: "/dashboard/analytics",
    label: "Analytics",
    description: "Track clicks and growth",
    icon: BarChart3,
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    description: "Account shortcuts and workspace details",
    icon: Settings2,
  },
];

export const SOCIAL_PLATFORM_FIELDS = [
  {
    key: "youtubeId",
    socialKey: "youtube",
    label: "YouTube",
    placeholder: "Channel ID or @handle",
    icon: FaYoutube,
    color: "#FF0000",
  },
  {
    key: "instagram",
    socialKey: "instagram",
    label: "Instagram",
    placeholder: "Username",
    icon: FaInstagram,
    color: "#E4405F",
  },
  {
    key: "twitter",
    socialKey: "twitter",
    label: "Twitter / X",
    placeholder: "Handle",
    icon: FaTwitter,
    color: "#1DA1F2",
  },
  {
    key: "githubUser",
    socialKey: "github",
    label: "GitHub",
    placeholder: "Username",
    icon: FaGithub,
    color: "#E6EDF3",
  },
  {
    key: "linkedin",
    socialKey: "linkedin",
    label: "LinkedIn",
    placeholder: "Profile slug",
    icon: FaLinkedin,
    color: "#0A66C2",
  },
  {
    key: "telegramUser",
    socialKey: "telegram",
    label: "Telegram",
    placeholder: "Username",
    icon: FaTelegram,
    color: "#0088CC",
  },
  {
    key: "tiktok",
    socialKey: "tiktok",
    label: "TikTok",
    placeholder: "Username",
    icon: FaTiktok,
    color: "#FF0050",
  },
];

export const DASHBOARD_THEMES = [
  {
    id: "dark-pro",
    name: "Midnight Studio",
    accent: "#9333EA",
    description: "Dark, crisp, and premium for creator-first pages.",
    preview:
      "linear-gradient(145deg, rgba(10,10,10,1) 0%, rgba(24,18,37,1) 55%, rgba(12,8,18,1) 100%)",
  },
  {
    id: "neon-glow",
    name: "Signal Glow",
    accent: "#00F5B0",
    description: "A sharper look with bright electric highlights.",
    preview:
      "linear-gradient(145deg, rgba(5,8,22,1) 0%, rgba(10,16,35,1) 48%, rgba(13,27,42,1) 100%)",
  },
  {
    id: "minimal",
    name: "Soft Canvas",
    accent: "#9333EA",
    description: "An airy light theme with minimal contrast.",
    preview:
      "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(241,245,249,1) 60%, rgba(238,242,255,1) 100%)",
  },
  {
    id: "creator-mode",
    name: "Creator Pulse",
    accent: "#FB923C",
    description: "Warm gradients and bold energy for standout profiles.",
    preview:
      "linear-gradient(145deg, rgba(18,8,17,1) 0%, rgba(31,13,28,1) 50%, rgba(46,19,48,1) 100%)",
  },
];

export const DASHBOARD_BACKGROUNDS = [
  {
    value: "purple-pink",
    label: "Violet Bloom",
    colors: "from-violet-600 via-fuchsia-500 to-rose-500",
  },
  {
    value: "blue-cyan",
    label: "Ocean Glass",
    colors: "from-sky-500 via-cyan-400 to-blue-600",
  },
  {
    value: "emerald-teal",
    label: "Rosy Signal",
    colors: "from-fuchsia-500 via-pink-500 to-rose-500",
  },
  {
    value: "amber-orange",
    label: "Warm Spotlight",
    colors: "from-amber-400 via-orange-400 to-rose-400",
  },
];
