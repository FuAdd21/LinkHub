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
} from "react-icons/fa";
import { assetUrl } from "../api/config.js";

const PLATFORM_ICONS = {
  youtube: { icon: FaYoutube, color: "#FF0000" },
  github: { icon: FaGithub, color: "#ffffff" },
  telegram: { icon: FaTelegram, color: "#0088cc" },
  instagram: { icon: FaInstagram, color: "#E4405F" },
  twitter: { icon: FaTwitter, color: "#1DA1F2" },
  linkedin: { icon: FaLinkedin, color: "#0A66C2" },
  tiktok: { icon: FaTiktok, color: "#ff0050" },
};

const PhonePreview = ({ userData, links }) => {
  const avatarUrl = userData?.avatar ? assetUrl(userData.avatar) : null;
  const visibleLinks = (links || []).filter((l) => l.is_visible !== 0);

  const getPlatformIcon = (platform) => {
    const config = PLATFORM_ICONS[platform];
    if (!config) return FaGlobe;
    return config.icon;
  };

  const getPlatformColor = (platform) => {
    return PLATFORM_ICONS[platform]?.color || "#8B5CF6";
  };

  return (
    <div className="sticky top-24">
      <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-4 text-center">
        Live Preview
      </p>

      {/* Phone frame */}
      <div className="mx-auto w-[280px]">
        <div className="bg-[#1a1a1a] rounded-[2.5rem] p-3 border border-white/10 shadow-2xl">
          {/* Notch */}
          <div className="flex justify-center mb-2">
            <div className="w-20 h-5 bg-black rounded-full" />
          </div>

          {/* Screen */}
          <div className="bg-[#0a0a0a] rounded-[2rem] min-h-[480px] p-5 overflow-y-auto max-h-[520px] scrollbar-hide">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-5">
              <div className="relative mb-3">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-sm opacity-50" />
                <div className="relative w-16 h-16 rounded-full border border-white/20 overflow-hidden bg-gray-800">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-white/40 font-bold">
                      {(userData?.username || userData?.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-white text-sm font-semibold">
                {userData?.username || userData?.name || "username"}
              </p>
              {userData?.bio && (
                <p className="text-white/30 text-[10px] text-center mt-1 max-w-[200px] leading-relaxed">
                  {userData.bio}
                </p>
              )}
            </div>

            {/* Social icons row */}
            {userData && (
              <div className="flex justify-center gap-2 mb-4">
                {["youtube", "github", "telegram", "instagram", "twitter", "linkedin", "tiktok"].map(
                  (platform) => {
                    const keyMap = {
                      youtube: "youtubeId",
                      github: "githubUser",
                      telegram: "telegramUser",
                      instagram: "instagram",
                      twitter: "twitter",
                      linkedin: "linkedin",
                      tiktok: "tiktok",
                    };
                    const value = userData[keyMap[platform]];
                    if (!value) return null;

                    const Icon = getPlatformIcon(platform);
                    return (
                      <div
                        key={platform}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"
                      >
                        <Icon
                          className="w-3 h-3"
                          style={{ color: getPlatformColor(platform) }}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* Links */}
            <div className="space-y-2">
              {visibleLinks.map((link) => {
                const Icon = getPlatformIcon(link.platform || link.icon);
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5"
                  >
                    <Icon
                      className="w-3 h-3 flex-shrink-0"
                      style={{
                        color: getPlatformColor(link.platform || link.icon),
                      }}
                    />
                    <span className="text-white/70 text-[11px] truncate">
                      {link.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {visibleLinks.length === 0 && (
              <p className="text-white/15 text-[10px] text-center mt-4">
                Add links to see them here
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
