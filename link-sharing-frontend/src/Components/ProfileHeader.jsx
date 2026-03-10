import React from "react";
import { motion } from "framer-motion";
import { assetUrl } from "../api/config.js";

const ProfileHeader = ({ user }) => {
  const avatarUrl = user.avatar ? assetUrl(user.avatar) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center mb-8"
    >
      {/* Avatar with glow ring */}
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 blur-md opacity-60 animate-pulse" />
        <div className="relative w-24 h-24 rounded-full border-2 border-white/20 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user.username || user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/80">
              {(user.username || user.name || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Username with verified badge */}
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-xl font-bold text-white">
          {user.username || user.name}
        </h1>
        {/* Verified badge - show if user has many social connections */}
        {user.isVerified && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-5 h-5 text-blue-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </motion.svg>
        )}
      </div>

      {/* Bio */}
      {user.bio && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-sm text-center max-w-[280px] leading-relaxed"
        >
          {user.bio}
        </motion.p>
      )}
    </motion.div>
  );
};

export default ProfileHeader;
