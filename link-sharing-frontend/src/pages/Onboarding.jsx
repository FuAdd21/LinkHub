import React, { useState, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Camera, Check, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const THEMES = [
  { id: "dark-pro", name: "Dark Pro", color: "#1a1a1a", border: "#333" },
  { id: "minimal", name: "Minimal Light", color: "#f8f9fa", border: "#e5e7eb" },
  {
    id: "neon-glow",
    name: "Neon Creator",
    color: "#0B0B1A",
    border: "#8B5CF6",
  },
  {
    id: "creator-mode",
    name: "Gradient Studio",
    color: "linear-gradient(135deg, #1e3a8a 0%, #701a75 100%)",
    border: "transparent",
  },
];

const Onboarding = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("dark-pro");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // Validate Username
  const checkUsername = async (value) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    setUsername(clean);

    if (clean.length < 3) {
      setUsernameStatus(null);
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

  const handleComplete = async () => {
    if (!username || usernameStatus !== "available") {
      toast.error("Please select a valid unique username.");
      return;
    }

    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // 1. Set Username
      await axios.put(
        `${API_BASE_URL}/api/profile/username`,
        { username },
        { headers },
      );

      // 2. Set Bio and Theme
      await axios.put(
        `${API_BASE_URL}/api/profile`,
        { bio, theme },
        { headers },
      );

      // 3. Upload Avatar if selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        await axios.put(`${API_BASE_URL}/api/users/avatar`, formData, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      }

      // 4. Update local user context
      const updatedUser = { ...user, username };
      login(token, updatedUser);

      toast.success("Profile created successfully!");

      // 5. Redirect to owner view
      setTimeout(() => navigate(`/${username}`), 1000);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during setup.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative z-10 shadow-2xl"
      >
        <div className="mb-10 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-purple-500/20">
            L
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Claim your identity
          </h1>
          <p className="text-white/40">
            Set up your premium LinkHub profile in seconds.
          </p>
        </div>

        <div className="space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-purple-500 transition-colors bg-white/5 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-white/20" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-white font-medium">Upload</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
            <p className="text-white/30 text-xs mt-3">
              Profile Photo (Optional)
            </p>
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-2">
              Choose your username *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-medium">
                linkhub.com/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => checkUsername(e.target.value)}
                placeholder="yourname"
                className="w-full pl-[110px] pr-12 py-4 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder:text-white/20"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {usernameStatus === "checking" && (
                  <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
                )}
                {usernameStatus === "available" && (
                  <Check className="w-5 h-5 text-green-400" />
                )}
                {usernameStatus === "taken" && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            {usernameStatus === "taken" && (
              <p className="text-red-400 text-xs mt-2 ml-1">
                This username is already taken
              </p>
            )}
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-2">
              Short Bio (Optional)
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Digital Creator & Entrepreneur"
              maxLength={60}
              className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder:text-white/20"
            />
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-3">
              Starting Theme
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`relative h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                    theme === t.id
                      ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-[#0a0a0a] scale-95"
                      : "hover:border-white/20 border border-white/10"
                  }`}
                  style={{
                    background: t.color,
                  }}
                >
                  <span className="absolute bottom-2 left-2 text-xs font-semibold mix-blend-difference text-white">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handleComplete}
            disabled={loading || usernameStatus !== "available" || !username}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Create Profile <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
