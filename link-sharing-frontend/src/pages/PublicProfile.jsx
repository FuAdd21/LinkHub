import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import ProfileHeader from "../components/ProfileHeader";
import LinkCard from "../components/LinkCard";
import SocialCardPublic from "../components/SocialCardPublic";
import ShareButtons from "../components/ShareButtons";
import QRCodeGenerator from "../components/QRCodeGenerator";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

// Theme configurations
const THEMES = {
  "dark-pro": {
    bg: "bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#0a0a0a]",
    particleColor: "rgba(139, 92, 246, 0.08)",
  },
  "neon-glow": {
    bg: "bg-gradient-to-b from-[#0a001a] via-[#0f0028] to-[#0a001a]",
    particleColor: "rgba(0, 255, 136, 0.08)",
  },
  minimal: {
    bg: "bg-gradient-to-b from-[#f8f9fa] via-[#ffffff] to-[#f8f9fa]",
    particleColor: "rgba(0, 0, 0, 0.03)",
    light: true,
  },
  "creator-mode": {
    bg: "bg-gradient-to-b from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a]",
    particleColor: "rgba(255, 0, 80, 0.08)",
  },
};

const PublicProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/profile/${username}`
        );
        setUserData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "User not found"
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const trackClick = async (linkId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/analytics/click/${linkId}`);
    } catch {
      // Silent fail - don't interrupt user experience
    }
  };

  // ──── Loading State ────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Skeleton avatar */}
          <div className="w-24 h-24 rounded-full bg-white/5 animate-pulse" />
          {/* Skeleton text */}
          <div className="w-32 h-4 rounded-full bg-white/5 animate-pulse" />
          <div className="w-48 h-3 rounded-full bg-white/5 animate-pulse" />
          {/* Skeleton links */}
          <div className="w-64 mt-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full h-12 rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ──── Error State ────
  if (error || !userData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Page not found
          </h2>
          <p className="text-white/40 text-sm">
            The user <span className="text-purple-400">@{username}</span> doesn't
            exist yet.
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create your own LinkHub
          </a>
        </motion.div>
      </div>
    );
  }

  const theme = THEMES[userData.theme] || THEMES["dark-pro"];
  const isLight = theme.light;

  // Collect active socials
  const activeSocials = Object.entries(userData.socials || {}).filter(
    ([_, username]) => username
  );

  return (
    <div
      className={`min-h-screen ${theme.bg} flex items-start justify-center py-8 px-4`}
    >
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent)",
          }}
        />
      </div>

      {/* Phone-style container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[420px] z-10"
      >
        {/* Profile Header */}
        <ProfileHeader user={userData} />

        {/* Social Cards Row */}
        {activeSocials.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mb-6"
          >
            {activeSocials.map(([platform, uname], index) => (
              <SocialCardPublic
                key={platform}
                platform={platform}
                username={uname}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Links */}
        {userData.links && userData.links.length > 0 && (
          <div className="space-y-2.5 mb-6">
            {userData.links.map((link, index) => (
              <LinkCard
                key={link.id}
                link={link}
                index={index}
                onTrackClick={trackClick}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {(!userData.links || userData.links.length === 0) &&
          activeSocials.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center text-sm ${
                isLight ? "text-gray-500" : "text-white/30"
              } mt-8`}
            >
              No links yet — check back soon!
            </motion.p>
          )}

        {/* Share + QR */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <ShareButtons username={userData.username || username} />
          <QRCodeGenerator username={userData.username || username} />
        </div>

        {/* Footer branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-1.5 mt-8 mb-4"
        >
          <span className="text-[11px] text-white/20">⚡ Powered by</span>
          <a
            href="/"
            className="text-[11px] text-white/30 hover:text-white/50 transition-colors font-medium"
          >
            LinkHub
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PublicProfile;
