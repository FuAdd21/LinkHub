import {
  Github,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Music2,
  Users,
  Eye,
  FileCode,
  Send,
} from "lucide-react";

const platformConfig = {
  instagram: {
    name: "Instagram",
    color: "from-pink-500 to-purple-600",
    icon: Instagram,
    hoverColor: "hover:shadow-pink-500/30",
    statsIcon: Users,
    statsLabels: { followers: "Followers" },
  },
  tiktok: {
    name: "TikTok",
    color: "from-black to-gray-800",
    icon: Music2,
    hoverColor: "hover:shadow-cyan-500/30",
    statsIcon: Users,
    statsLabels: { followers: "Followers" },
  },
  youtube: {
    name: "YouTube",
    color: "from-red-600 to-red-700",
    icon: Youtube,
    hoverColor: "hover:shadow-red-500/30",
    statsIcon: Eye,
    statsLabels: {
      subscribers: "Subscribers",
      videos: "Videos",
      views: "Views",
    },
  },
  twitter: {
    name: "Twitter",
    color: "from-blue-400 to-blue-600",
    icon: Twitter,
    hoverColor: "hover:shadow-blue-500/30",
    statsIcon: Users,
    statsLabels: { followers: "Followers" },
  },
  linkedin: {
    name: "LinkedIn",
    color: "from-blue-700 to-blue-800",
    icon: Linkedin,
    hoverColor: "hover:shadow-blue-600/30",
    statsIcon: Users,
    statsLabels: { connections: "Connections" },
  },
  github: {
    name: "GitHub",
    color: "from-gray-700 to-gray-900",
    icon: Github,
    hoverColor: "hover:shadow-gray-500/30",
    statsIcon: FileCode,
    statsLabels: { followers: "Followers", repos: "Repos" },
  },
  telegram: {
    name: "Telegram",
    color: "from-blue-500 to-cyan-500",
    icon: Send,
    hoverColor: "hover:shadow-blue-500/30",
    statsIcon: Users,
    statsLabels: { members: "Members" },
  },
};

function getPlatformInfo(platform) {
  return platformConfig[platform?.toLowerCase()] || platformConfig.github;
}

function getInitials(username) {
  if (!username) return "?";
  return username.charAt(0).toUpperCase();
}

function formatNumber(num) {
  if (!num && num !== 0) return null;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default function SocialProfileCard({
  platform,
  name,
  username,
  avatar,
  profileUrl,
  extraData = {},
}) {
  const config = getPlatformInfo(platform);
  const Icon = config.icon;
  const StatsIcon = config.statsIcon;

  const handleClick = () => {
    if (profileUrl) {
      window.open(profileUrl, "_blank");
    }
  };

  const displayName = name || username;
  const hasStats = Object.keys(extraData).some((key) => extraData[key]);

  return (
    <div
      onClick={handleClick}
      className={`
        group relative overflow-hidden rounded-2xl p-4
        bg-white/10 backdrop-blur-md border border-white/20
        cursor-pointer transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl ${config.hoverColor}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatar && !avatar.includes("placeholder") ? (
            <img
              src={avatar}
              alt={`${platform} profile`}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-lg"
            />
          ) : (
            <div
              className={`
                w-16 h-16 rounded-full flex items-center justify-center
                bg-gradient-to-br ${config.color} text-white
                text-2xl font-bold shadow-lg
              `}
            >
              {getInitials(username || name)}
            </div>
          )}
          {/* Platform badge */}
          <div
            className={`
              absolute -bottom-1 -right-1 w-6 h-6 rounded-full
              bg-gradient-to-br ${config.color}
              flex items-center justify-center
              border-2 border-white
            `}
          >
            <Icon className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">
            {displayName}
          </h3>
          {username && (
            <p className="text-white/70 text-sm truncate">@{username}</p>
          )}

          {/* Dynamic Stats */}
          {hasStats && (
            <div className="flex items-center gap-3 mt-2 text-white/60 text-xs">
              {extraData.members !== undefined && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {formatNumber(extraData.members)} members
                </span>
              )}
              {extraData.subscribers !== undefined && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {formatNumber(extraData.subscribers)} subscribers
                </span>
              )}
              {extraData.followers !== undefined && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {formatNumber(extraData.followers)} followers
                </span>
              )}
              {extraData.videos !== undefined && (
                <span className="flex items-center gap-1">
                  {formatNumber(extraData.videos)} videos
                </span>
              )}
              {extraData.repos !== undefined && (
                <span className="flex items-center gap-1">
                  <FileCode className="w-3 h-3" />
                  {formatNumber(extraData.repos)} repos
                </span>
              )}
              {extraData.views !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(extraData.views)} views
                </span>
              )}
              {extraData.connections !== undefined && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {formatNumber(extraData.connections)} connections
                </span>
              )}
              {extraData.bio !== undefined && extraData.bio && (
                <span className="text-white/60 text-xs truncate max-w-[200px]">
                  {extraData.bio}
                </span>
              )}
            </div>
          )}

          <p className="text-white/50 text-xs mt-1 flex items-center gap-1 group-hover:text-white transition-colors">
            Visit on {config.name} →
          </p>
        </div>

        {/* Arrow */}
        <div className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Glow effect */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-r ${config.color}
          transition-opacity duration-300 -z-10 blur-xl
        `}
      />
    </div>
  );
}
