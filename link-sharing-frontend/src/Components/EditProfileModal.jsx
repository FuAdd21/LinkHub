import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Camera, Save, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../api/config.js";

const THEMES = [
  { id: "dark-pro", name: "Dark Pro", color: "#1a1a1a" },
  { id: "minimal-light", name: "Light", color: "#f8f9fa" },
  { id: "neon-creator", name: "Neon", color: "#0B0B1A" },
  {
    id: "gradient-studio",
    name: "Gradient",
    color: "linear-gradient(135deg, #1e3a8a 0%, #701a75 100%)",
  },
];

const EditProfileModal = ({ isOpen, onClose, userData, onSaveSuccess }) => {
  // General State
  const [username, setUsername] = useState(userData?.username || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [theme, setTheme] = useState(userData?.theme || "dark-pro");
  const [usernameStatus, setUsernameStatus] = useState(null);

  // Avatar State
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userData && isOpen) {
      setUsername(userData.username || "");
      setBio(userData.bio || "");
      setTheme(userData.theme || "dark-pro");
      setAvatarPreview(null);
      setAvatarFile(null);
      setUsernameStatus("available");
    }
  }, [userData, isOpen]);

  const checkUsername = async (value) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    setUsername(clean);

    if (clean.length < 3) {
      setUsernameStatus(null);
      return;
    }
    if (clean === userData?.username) {
      setUsernameStatus("available");
      return;
    }

    setUsernameStatus("checking");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/profile/check/${clean}`);
      setUsernameStatus(res.data.available ? "available" : "taken");
    } catch {
      setUsernameStatus(null);
    }
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (usernameStatus === "taken") {
      toast.error("Please choose a unique username.");
      return;
    }

    setSaving(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // 1. Save Username (if changed)
      if (username !== userData?.username) {
        await axios.put(
          `${API_BASE_URL}/api/profile/username`,
          { username },
          { headers },
        );
      }

      // 2. Save Bio and Theme
      await axios.put(
        `${API_BASE_URL}/api/profile`,
        { bio, theme },
        { headers },
      );

      // 3. Upload Avatar
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        await axios.put(`${API_BASE_URL}/api/users/avatar`, formData, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Profile updated successfully!");
      onSaveSuccess(username); // Pass back the potentially new username
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const avatarSrc =
    avatarPreview ||
    (userData?.avatar?.startsWith("http")
      ? userData.avatar
      : `${API_BASE_URL}${userData.avatar}`);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#111] border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Update Profile</h2>
              <button
                onClick={onClose}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Avatar section */}
                <div className="flex items-center gap-6">
                  <div
                    className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarSrc && avatarSrc !== API_BASE_URL + "null" ? (
                      <img
                        src={avatarSrc}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-white/30" />
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Profile Photo
                    </p>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white transition-colors"
                      >
                        Change
                      </button>
                      {avatarFile && (
                        <button
                          onClick={clearAvatar}
                          className="text-xs text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                </div>

                {/* Username section */}
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                      linkhub.com/
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => checkUsername(e.target.value)}
                      className="w-full pl-[105px] pr-10 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === "checking" && (
                        <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
                      )}
                      {usernameStatus === "available" && (
                        <Check className="w-4 h-4 text-green-400" />
                      )}
                      {usernameStatus === "taken" && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio section */}
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={160}
                    rows={3}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none"
                  />
                </div>

                {/* Theme section */}
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-3">
                    Global Theme
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`relative h-14 rounded-xl overflow-hidden transition-all duration-300 ${
                          theme === t.id
                            ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-[#111]"
                            : "hover:scale-[1.02] border border-white/5"
                        }`}
                        style={{ background: t.color }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold mix-blend-difference text-white">
                          {t.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-[#111]">
              <motion.button
                onClick={handleSave}
                disabled={saving || usernameStatus === "taken" || !username}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
