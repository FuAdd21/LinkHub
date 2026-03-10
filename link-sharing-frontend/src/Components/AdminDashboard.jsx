import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import toast from "react-hot-toast";
import SocialProfilesSection from "./SocialProfilesSection";
import {
  Link as LinkIcon,
  Plus,
  Copy,
  Check,
  Edit3,
  Trash2,
  Globe,
  TrendingUp,
  Upload,
  LogOut,
  X,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const ItemType = "LINK";

const LinkItem = ({
  id,
  title,
  url,
  platform,
  username,
  profileData,
  avatar_url,
  index,
  moveLink,
  startEdit,
  handleDelete,
}) => {
  const [, drag] = useDrag({ type: ItemType, item: { id, index } });
  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveLink(item.index, index);
        item.index = index;
      }
    },
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getFavicon = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const getPlatformIcon = () => {
    const icons = {
      github: "🐙",
      youtube: "▶️",
      instagram: "📸",
      tiktok: "🎵",
      twitter: "🐦",
      linkedin: "💼",
      facebook: "📘",
      telegram: "✈️",
    };
    return icons[platform] || null;
  };

  const getPlatformColor = () => {
    const colors = {
      github: "from-gray-600 to-gray-700",
      youtube: "from-red-600 to-red-700",
      instagram: "from-pink-500 to-purple-600",
      tiktok: "from-black to-gray-800",
      twitter: "from-blue-400 to-blue-600",
      linkedin: "from-blue-700 to-blue-800",
      facebook: "from-blue-600 to-blue-700",
      telegram: "from-blue-400 to-cyan-500",
    };
    return colors[platform] || "from-purple-500 to-pink-500";
  };

  const displayImage = avatar_url || profileData?.avatar || getFavicon(url);
  const displayName = profileData?.name || title;
  const displayUsername = username || platform || "profile";
  const platformLabel = platform
    ? platform.charAt(0).toUpperCase() + platform.slice(1)
    : "Link";

  const handleVisit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) window.open(url, "_blank");
  };

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      className="group relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 cursor-move transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={`${displayImage ? "hidden" : ""} w-12 h-12 rounded-full bg-gradient-to-br ${getPlatformColor()} flex items-center justify-center text-white font-semibold shadow-lg`}
          >
            {(displayUsername || "?").charAt(0).toUpperCase()}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${getPlatformColor()} flex items-center justify-center border border-white/40`}
          >
            <span className="text-[10px]">{getPlatformIcon() || "🔗"}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-medium truncate text-sm">
              {platformLabel}
            </h4>
            {profileData?.verified && (
              <span className="text-blue-400 text-xs" title="Verified">
                ✓
              </span>
            )}
          </div>

          <p className="text-white/70 text-xs truncate mt-0.5">
            @{displayUsername}
          </p>

          <button
            onClick={handleVisit}
            className="text-white/50 text-xs mt-1 hover:text-white transition-colors"
            type="button"
          >
            Visit on {platformLabel} →
          </button>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => startEdit({ id, title, url })}
            className="p-2 rounded-lg bg-white/5 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(id)}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:border-white/20 hover:shadow-xl"
  >
    <div
      className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`}
    />

    <div className="relative z-10">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>

      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <p className="text-white text-2xl font-bold mt-1">{value}</p>

      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-xs font-medium">{trend}</span>
        </div>
      )}
    </div>
  </motion.div>
);

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md"
        >
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [me, setMe] = useState(null);

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingLink, setEditingLink] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Social profiles form state
  const [socialForm, setSocialForm] = useState({
    youtubeId: "",
    githubUser: "",
    telegramUser: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    tiktok: "",
  });
  const [showSocialForm, setShowSocialForm] = useState(false);

  // Fetch user + links
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [userRes, linksRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/mylinks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setMe(userRes.data);
        setLinks(linksRes.data);
        if (userRes.data.avatar) {
          setAvatar(`${API_BASE_URL}${userRes.data.avatar}`);
        }
        // Populate social form with existing data
        setSocialForm({
          youtubeId: userRes.data.youtubeId || "",
          githubUser: userRes.data.githubUser || "",
          telegramUser: userRes.data.telegramUser || "",
          instagram: userRes.data.instagram || "",
          twitter: userRes.data.twitter || "",
          linkedin: userRes.data.linkedin || "",
          tiktok: userRes.data.tiktok || "",
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err.response?.data?.message || err.message || "Error loading data",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim())
      return toast.error("Both fields required!");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/mylinks`,
        { title: newTitle, url: newUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const res = await axios.get(`${API_BASE_URL}/api/mylinks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks(res.data);
      setNewTitle("");
      setNewUrl("");
      setShowForm(false);
      toast.success("Link created!");
    } catch {
      toast.error("Error creating link");
    }
  };

  const startEdit = (link) => {
    setEditingLink(link);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/mylinks/${editingLink.id}`,
        { title: editTitle, url: editUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const res = await axios.get(`${API_BASE_URL}/api/mylinks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks(res.data);
      setEditingLink(null);
      toast.success("Updated!");
    } catch {
      toast.error("Error updating link");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/mylinks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks((prev) => prev.filter((link) => link.id !== id));
      toast.success("Deleted!");
    } catch {
      toast.error("Error deleting link");
    }
  };

  const moveLink = async (from, to) => {
    const updated = [...links];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setLinks(updated);
    const token = localStorage.getItem("token");
    await axios.put(
      `${API_BASE_URL}/api/mylinks/order`,
      { order: updated.map((l) => l.id) },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  };

  // Avatar Upload Logic
  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/users/social-profiles`, socialForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh user data
      const userRes = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMe(userRes.data);

      setShowSocialForm(false);
      toast.success("Social profiles updated!");
    } catch {
      toast.error("Error updating social profiles");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
      await handleAvatarUpload(file);
    }
  };

  const handleAvatarUpload = async (selectedFile = avatarFile) => {
    if (!selectedFile) {
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const res = await axios.post(
        `${API_BASE_URL}/api/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setAvatar(`${API_BASE_URL}${res.data.avatar}`);
      toast.success("Profile updated!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
        />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
          {error}
        </div>
      </div>
    );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-400 transition-colors"
                >
                  {uploading ? (
                    <div className="w-3 h-3 rounded-full border border-white/40 border-t-white animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3 text-white" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {user?.name || "Admin"} 👋
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Manage your links and track your performance
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-xl text-gray-300 hover:text-red-400 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={LinkIcon}
              label="Total Links"
              value={links.length}
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              icon={Globe}
              label="Active Links"
              value={links.length}
              color="from-pink-500 to-rose-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Growth"
              value="+12%"
              trend="This month"
              color="from-pink-500 to-red-500"
            />
          </div>

          {/* Social Aggregator Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white">
                  Connected Social Profiles
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Powered by the Social Aggregator Engine
                </p>
              </div>
              <div className="p-6">
                <SocialProfilesSection
                  youtubeId={me?.youtubeId}
                  githubUser={me?.githubUser}
                  telegramUser={me?.telegramUser}
                  instagram={me?.instagram}
                  twitter={me?.twitter}
                  linkedin={me?.linkedin}
                  tiktok={me?.tiktok}
                />
              </div>

              {/* Connect Social Profiles Form */}
              <div className="border-t border-white/5">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">
                      Connect Social Profiles
                    </h3>
                    <button
                      onClick={() => setShowSocialForm(!showSocialForm)}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {showSocialForm ? "Cancel" : "Add"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showSocialForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-gray-400 text-xs font-medium mb-2">
                              YouTube Channel ID
                            </label>
                            <input
                              type="text"
                              placeholder="UC_x5XG1OV2P6uZZ5FSM9Ttw"
                              value={socialForm.youtubeId}
                              onChange={(e) =>
                                setSocialForm({
                                  ...socialForm,
                                  youtubeId: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-400 text-xs font-medium mb-2">
                              GitHub Username
                            </label>
                            <input
                              type="text"
                              placeholder="octocat"
                              value={socialForm.githubUser}
                              onChange={(e) =>
                                setSocialForm({
                                  ...socialForm,
                                  githubUser: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-400 text-xs font-medium mb-2">
                              Telegram Username
                            </label>
                            <input
                              type="text"
                              placeholder="telegram"
                              value={socialForm.telegramUser}
                              onChange={(e) =>
                                setSocialForm({
                                  ...socialForm,
                                  telegramUser: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-400 text-xs font-medium mb-2">
                              Instagram Username
                            </label>
                            <input
                              type="text"
                              placeholder="natgeo"
                              value={socialForm.instagram}
                              onChange={(e) =>
                                setSocialForm({
                                  ...socialForm,
                                  instagram: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-400 text-xs font-medium mb-2">
                              Twitter Username
                            </label>
                            <input
                              type="text"
                              placeholder="elonmusk"
                              value={socialForm.twitter}
                              onChange={(e) =>
                                setSocialForm({
                                  ...socialForm,
                                  twitter: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-400 text-xs font-medium mb-2">
                              LinkedIn Username
                            </label>
                            <input
                              type="text"
                              placeholder="username"
                              value={socialForm.linkedin}
                              onChange={(e) =>
                                setSocialForm({
                                  ...socialForm,
                                  linkedin: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-400 text-xs font-medium mb-2">
                              TikTok Username
                            </label>
                            <input
                              type="text"
                              placeholder="@khaby.lame"
                              value={socialForm.tiktok}
                              onChange={(e) =>
                                setSocialForm({
                                  ...socialForm,
                                  tiktok: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={handleSocialSubmit}
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl text-white font-medium text-sm shadow-lg shadow-purple-500/25 transition-all"
                          >
                            Save Social Profiles
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
          >
            {/* Content Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Your Links
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Drag to reorder • Click to edit
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl text-white font-medium text-sm shadow-lg shadow-purple-500/25 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </motion.button>
              </div>
            </div>

            {/* Links List */}
            <div className="p-6">
              <AnimatePresence mode="popLayout">
                {links.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                      <LinkIcon className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400">No links yet</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Click "Add Link" to get started
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {links.map((link, index) => (
                      <LinkItem
                        key={link.id}
                        {...link}
                        index={index}
                        moveLink={moveLink}
                        startEdit={startEdit}
                        handleDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Add Link Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/5"
                >
                  <div className="p-6">
                    <form onSubmit={handleCreate} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-400 text-xs font-medium mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            placeholder="My Awesome Link"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs font-medium mb-2">
                            URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl text-white font-medium text-sm shadow-lg shadow-purple-500/25 transition-all"
                        >
                          Save Link
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-500 text-sm mt-8"
          >
            Linkhub • Your personal link management platform
          </motion.p>
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={!!editingLink}
          onClose={() => setEditingLink(null)}
          title="Edit Link"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-2">
                URL
              </label>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingLink(null)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl text-white font-medium text-sm shadow-lg shadow-purple-500/25 transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DndProvider>
  );
};

export default AdminDashboard;
