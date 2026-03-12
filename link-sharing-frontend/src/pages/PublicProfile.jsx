import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { LogOut, Edit3, Link2, Palette, ChevronDown } from "lucide-react";
import ProfileHeader from "../Components/ProfileHeader";
import ShareButtons from "../Components/ShareButtons";
import QRCodeGenerator from "../Components/QRCodeGenerator";
import EditProfileModal from "../Components/EditProfileModal";
import LinkCard from "../Components/LinkCard";
import SocialCardPublic from "../Components/SocialCardPublic";
import { API_BASE_URL, assetUrl } from "../api/config.js";

const SocialCardSkeleton = () => (
  <div className="w-full h-[72px] rounded-xl bg-white/5 border border-white/10 animate-pulse" />
);

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (userData?.theme) {
      document.documentElement.setAttribute("data-theme", userData.theme);
    }
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [userData?.theme]);

  // ──── Loading State ────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 w-full max-w-[440px] px-6">
          <div className="w-28 h-28 rounded-[40px] bg-white/5 border border-white/10 animate-pulse rotate-3" />
          <div className="w-40 h-5 rounded-full bg-white/5 animate-pulse" />
          <div className="w-64 h-3 rounded-full bg-white/5 animate-pulse" />
          <div className="w-full mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={`link-${i}`}
                className="w-full h-16 rounded-3xl bg-white/5 border border-white/10 animate-pulse"
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
      <div className="min-h-screen bg-[#020202] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10 px-6"
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[32px] bg-white/5 border border-white/10 text-4xl mb-6 shadow-2xl">
            ⛓️
          </div>
          <h2 className="text-white text-3xl font-black tracking-tighter mb-4 italic">
            SIGNAL LOST
          </h2>
          <p className="text-white/40 text-sm font-medium mb-10 max-w-[280px] mx-auto">
            The profile at @{username} has not been materialized in this dimension.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl text-[13px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Claim this node
          </a>
        </motion.div>
      </div>
    );
  }

  const activeSocialPlatforms = Object.entries(userData.socials || {})
    .filter(([_, val]) => val)
    .map(([key]) => key);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-16 px-6 relative overflow-x-hidden transition-colors duration-1000"
      style={{ backgroundColor: "var(--bg-primary, #020202)" }}
    >
      {/* ─── OWNER NAVIGATION MENU ─── */}
      {isOwner && (
        <div className="fixed top-6 right-6 z-50">
          <div className="relative">
            <button
              onClick={() => setOwnerMenuOpen(!ownerMenuOpen)}
              className="group flex items-center gap-3 pl-2 pr-5 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl text-white text-[13px] font-black tracking-tight transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-[#00f2ff] to-[#7000ff] p-0.5 transition-transform group-hover:rotate-6">
                 <div className="w-full h-full rounded-[10px] overflow-hidden bg-black">
                    {userData.avatar ? (
                      <img
                        src={assetUrl(userData.avatar)}
                        alt="Owner"
                        className="w-full h-full object-cover opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase">
                        Me
                      </div>
                    )}
                 </div>
              </div>
              <span className="hidden sm:inline">Nodal Controller</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-500 opacity-40 ${ownerMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {ownerMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95, rotate: -2 }}
                  className="absolute right-0 mt-3 w-64 bg-black/40 border border-white/10 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl z-50 p-2"
                >
                  <button
                    onClick={() => {
                      setOwnerMenuOpen(false);
                      setEditModalOpen(true);
                    }}
                    className="w-full flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 rounded-[24px] transition-all"
                  >
                    <Edit3 className="w-4 h-4 text-cyan-400" />
                    Edit Archetype
                  </button>
                  <button
                    onClick={() => {
                      setOwnerMenuOpen(false);
                      navigate("/dashboard/links");
                    }}
                    className="w-full flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 rounded-[24px] transition-all"
                  >
                    <Link2 className="w-4 h-4 text-purple-400" />
                    Manage Flux
                  </button>
                  <button
                    onClick={() => {
                      setOwnerMenuOpen(false);
                      navigate("/dashboard/settings");
                    }}
                    className="w-full flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 rounded-[24px] transition-all"
                  >
                    <Palette className="w-4 h-4 text-pink-400" />
                    Aura Selection
                  </button>
                  <div className="h-px w-full bg-white/5 my-2" />
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-[24px] transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sever Connection
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Experimental atmospheric background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-20"
          style={{ background: `radial-gradient(circle, var(--accent-color, #00f2ff), transparent)` }}
        />
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-20"
          style={{ background: `radial-gradient(circle, var(--accent-secondary, #7000ff), transparent)` }}
        />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] invert transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative w-full max-w-[440px] z-10"
      >
        {/* Profile Header */}
        <ProfileHeader user={userData} previewMode={false} />

        {/* ─── Rich Social Profile Cards ─── */}
        {activeSocialPlatforms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10"
          >
            {activeSocialPlatforms.map((platform, index) => (
              <SocialCardPublic
                key={platform}
                platform={platform}
                username={userData.socials[platform]}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Links */}
        {(userData.links || []).filter(l => l.is_visible !== 0).length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-12"
          >
            {(userData.links || [])
              .filter(l => l.is_visible !== 0)
              .map((link, index) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  index={index}
                  onTrackClick={(linkId) => {
                    axios.post(`${API_BASE_URL}/api/analytics/click/${linkId}`).catch(console.error);
                  }}
                />
              ))}
          </motion.div>
        ) : activeSocialPlatforms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="h-1px w-12 bg-white/10 mx-auto mb-6" />
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">
              No active nodes found.
            </p>
          </motion.div>
        ) : null}

        {/* Share + QR Section */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-4 py-8 border-t border-white/5"
        >
          <ShareButtons username={userData.username || username} />
          <div className="h-4 w-px bg-white/5" />
          <QRCodeGenerator username={userData.username || username} />
        </motion.div>

        {/* Footer branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center justify-center gap-4 mt-12 mb-8 group"
        >
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 group-hover:text-white/30 transition-colors">
              Engineered by
            </span>
            <a
              href="/"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/60 transition-colors"
            >
              LinkHub
            </a>
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-white/5 group-hover:bg-cyan-500/50 transition-colors" />
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
