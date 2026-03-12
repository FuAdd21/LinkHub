import React, { useState, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Camera, Check, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../api/config.js";

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
      toast.error("Resource unavailable: unique username required.");
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

      toast.success("Operational matrix configured.");

      // 5. Redirect to owner view
      setTimeout(() => navigate(`/${username}`), 1000);
    } catch (err) {
      console.error(err);
      toast.error("Synchronization failed. Check system logs.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic atmospheric background */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(112,0,255,0.08),transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px]" />
        {/* Subtle moving grid */}
        <div className="absolute inset-0 opacity-[0.03] invert transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="w-full max-w-2xl bg-black/40 border border-white/10 rounded-[48px] p-10 md:p-16 backdrop-blur-3xl relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col items-center"
      >
        <div className="mb-14 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 p-[1.5px] mb-8 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
             <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center font-black text-white text-2xl italic tracking-tighter">
                LH
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tighter italic">
            CLAIM YOUR FREQUENCY
          </h1>
          <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em]">
            Initializing identity matrix v2.0
          </p>
        </div>

        <div className="w-full space-y-12">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center group">
            <div
              className="relative cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-28 h-28 rounded-[40px] overflow-hidden border border-white/10 group-hover:border-cyan-500 group-hover:rotate-6 transition-all duration-700 bg-white/5 flex items-center justify-center p-1">
                 <div className="w-full h-full rounded-[34px] overflow-hidden bg-black/50 flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera className="w-8 h-8 text-white/10 group-hover:text-cyan-500/50 transition-colors" />
                      </div>
                    )}
                 </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center text-black hover:scale-110 transition-transform">
                 <Camera className="w-4 h-4" strokeWidth={3} />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-6 group-hover:text-cyan-500/50 transition-colors">
              Nodal Visualization
            </p>
          </div>

          <div className="space-y-8">
            {/* Username Input */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 ml-1">
                Establish primary path
              </label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 text-sm font-black italic tracking-tighter transition-colors group-focus-within:text-cyan-500/30">
                  linkhub.to/
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => checkUsername(e.target.value)}
                  placeholder="alias"
                  className="w-full pl-32 pr-12 h-16 bg-white/5 border border-white/5 rounded-3xl text-white font-black italic tracking-tight focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder:text-white/5"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  )}
                  {usernameStatus === "available" && (
                    <Check className="w-5 h-5 text-cyan-400" />
                  )}
                  {usernameStatus === "taken" && (
                    <AlertCircle className="w-5 h-5 text-red-500/50" />
                  )}
                </div>
              </div>
              {usernameStatus === "taken" && (
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60 mt-4 ml-6 italic">
                  Critical Error: Path occupied
                </p>
              )}
            </div>

            {/* Bio Input */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 ml-1">
                Archetype Signature
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief existence summary..."
                maxLength={60}
                className="w-full px-8 h-16 bg-white/5 border border-white/5 rounded-3xl text-white font-bold italic tracking-tight focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/5"
              />
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-5 ml-1">
                Visual Matrix Configuration
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {THEMES.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`relative h-20 rounded-2xl overflow-hidden transition-all duration-500 group/item ${
                        isSelected
                          ? "ring-2 ring-cyan-400 scale-[0.98] shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                          : "border border-white/5 hover:border-white/20"
                      }`}
                      style={{
                        background: t.color,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/0 transition-colors" />
                      <span className="absolute bottom-3 left-3 text-[9px] font-black uppercase tracking-widest mix-blend-difference text-white">
                        {t.name}
                      </span>
                      {isSelected && (
                         <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-cyan-500 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-black" strokeWidth={4} />
                         </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handleComplete}
            disabled={loading || usernameStatus !== "available" || !username}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-16 mt-8 flex items-center justify-center gap-4 bg-white text-black rounded-3xl font-black text-sm uppercase tracking-[0.3em] disabled:opacity-20 disabled:grayscale transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Initialize Matrix <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>

        <div className="mt-14 flex items-center gap-3">
           <div className="w-8 h-px bg-white/5" />
           <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Phase 1 Complete</span>
           <div className="w-8 h-px bg-white/5" />
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
