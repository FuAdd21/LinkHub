import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import ProfileHeader from "../components/ProfileHeader";
import LinkCard from "../components/LinkCard";
import SocialProfileCard, { SocialCardSkeleton } from "../components/SocialProfileCard";
import ShareButtons from "../components/ShareButtons";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { fetchSocialProfiles } from "../api/socialApi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

// Social key mapping to backend query param names
const SOCIAL_KEY_MAP = {
  youtubeId: "youtube",
  githubUser: "github",
  telegramUser: "telegram",
  instagram: "instagram",
  twitter: "twitter",
  linkedin: "linkedin",
  tiktok: "tiktok",
};

// Map backend query param to platform name for card rendering
const PARAM_TO_PLATFORM = {
  youtube: "youtube",
  github: "github",
  telegram: "telegram",
  instagram: "instagram",
  twitter: "twitter",
  linkedin: "linkedin",
  tiktok: "tiktok",
};

const PublicProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [socialsLoading, setSocialsLoading] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/profile/${username}`
        );
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "User not found");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Fetch social data once we have user data with social handles
  useEffect(() => {
    if (!userData?.socials) return;

    const socials = userData.socials;
    // Build the params for the social API
    const hasAnySocial = Object.values(socials).some((v) => v);
    if (!hasAnySocial) return;

    setSocialsLoading(true);

    const fetchData = async () => {
      try {
        const result = await fetchSocialProfiles({
          youtubeId: socials.youtube || socials.youtubeId || null,
          githubUser: socials.github || socials.githubUser || null,
          telegramUser: socials.telegram || socials.telegramUser || null,
          instagram: socials.instagram || null,
          twitter: socials.twitter || null,
          linkedin: socials.linkedin || null,
          tiktok: socials.tiktok || null,
        });
        setSocialData(result);
      } catch (err) {
        console.error("Failed to fetch social profiles:", err);
      } finally {
        setSocialsLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  // Apply theme via data attribute
  useEffect(() => {
    if (userData?.theme) {
      document.documentElement.setAttribute("data-theme", userData.theme);
    }
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [userData?.theme]);

  const trackClick = async (linkId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/analytics/click/${linkId}`);
    } catch {
      // Silent fail
    }
  };

  // ──── Loading State ────
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary,#0a0a0a)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 w-full max-w-[420px] px-4">
          {/* Skeleton avatar */}
          <div className="w-24 h-24 rounded-full bg-white/5 animate-pulse" />
          <div className="w-32 h-4 rounded-full bg-white/5 animate-pulse" />
          <div className="w-48 h-3 rounded-full bg-white/5 animate-pulse" />
          {/* Skeleton social cards */}
          <div className="w-full mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <SocialCardSkeleton key={i} />
            ))}
          </div>
          {/* Skeleton links */}
          <div className="w-full mt-2 space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div
                key={`link-${i}`}
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

  // Collect active social handles for data display
  const activeSocialPlatforms = Object.entries(userData.socials || {})
    .filter(([_, val]) => val)
    .map(([key]) => key);

  return (
    <div
      className="min-h-screen flex items-start justify-center py-8 px-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
          style={{
            background: `radial-gradient(circle, var(--glow-color, rgba(139, 92, 246, 0.15)), transparent)`,
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

        {/* ─── Rich Social Profile Cards ─── */}
        {activeSocialPlatforms.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 mb-6"
          >
            {socialsLoading ? (
              // Skeleton loaders while fetching
              activeSocialPlatforms.map((platform) => (
                <SocialCardSkeleton key={platform} />
              ))
            ) : (
              activeSocialPlatforms.map((platform, index) => (
                <SocialProfileCard
                  key={platform}
                  platform={platform}
                  data={socialData?.[platform]}
                  index={index}
                  showDisconnected={true}
                />
              ))
            )}
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
          activeSocialPlatforms.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm mt-8"
              style={{ color: "var(--text-muted)" }}
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
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            ⚡ Powered by
          </span>
          <a
            href="/"
            className="text-[11px] font-medium transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            LinkHub
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PublicProfile;
