import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { LogOut, Edit3, Link2, Palette, ChevronDown } from "lucide-react";
import ProfileHeader from "../Components/ProfileHeader";
import LinkCard from "../Components/LinkCard";
import SocialProfileCard, {
  SocialCardSkeleton,
} from "../Components/SocialProfileCard";
import ShareButtons from "../Components/ShareButtons";
import QRCodeGenerator from "../Components/QRCodeGenerator";
import { fetchSocialProfiles } from "../api/socialApi";
import EditProfileModal from "../Components/EditProfileModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [socialsLoading, setSocialsLoading] = useState(false);

  // Owner State
  const isOwner = isAuthenticated && user?.username === username;
  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API_BASE_URL}/api/profile/${username}`,
      );
      setUserData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [fetchProfile, username]);

  const handleProfileUpdate = (newUsername) => {
    if (newUsername && newUsername !== username) {
      navigate(`/${newUsername}`);
    } else {
      fetchProfile();
    }
  };

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
            The user <span className="text-purple-400">@{username}</span>{" "}
            doesn't exist yet.
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
      className="min-h-screen flex flex-col items-center justify-start py-12 px-4 relative"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* ─── OWNER NAVIGATION MENU ─── */}
      {isOwner && (
        <div className="fixed top-4 right-4 z-50">
          <div className="relative">
            <button
              onClick={() => setOwnerMenuOpen(!ownerMenuOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium transition-all shadow-lg"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
                {userData.avatar ? (
                  <img
                    src={
                      userData.avatar.startsWith("http")
                        ? userData.avatar
                        : `${API_BASE_URL}${userData.avatar}`
                    }
                    alt="Owner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-bold">You</span>
                )}
              </div>
              My Profile
              <ChevronDown
                className={`w-4 h-4 transition-transform ${ownerMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {ownerMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-[#151515] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 py-2"
                >
                  <button
                    onClick={() => {
                      setOwnerMenuOpen(false);
                      setEditModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setOwnerMenuOpen(false);
                      navigate("/dashboard/links");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <Link2 className="w-4 h-4" />
                    Manage Links
                  </button>
                  <button
                    onClick={() => {
                      setOwnerMenuOpen(false);
                      navigate("/dashboard/settings");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <Palette className="w-4 h-4" />
                    Change Theme
                  </button>
                  <div className="h-px w-full bg-white/10 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

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
            {socialsLoading
              ? // Skeleton loaders while fetching
                activeSocialPlatforms.map((platform) => (
                  <SocialCardSkeleton key={platform} />
                ))
              : activeSocialPlatforms.map((platform, index) => (
                  <SocialProfileCard
                    key={platform}
                    platform={platform}
                    data={socialData?.[platform]}
                    index={index}
                    showDisconnected={true}
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

      {/* ─── LIVE EDITING MODAL ─── */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userData={userData}
        onSaveSuccess={handleProfileUpdate}
      />
    </div>
  );
};

export default PublicProfile;
