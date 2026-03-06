import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import {
  FaYoutube,
  FaGithub,
  FaTelegram,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const PLATFORMS = [
  {
    key: "youtubeId",
    label: "YouTube",
    icon: FaYoutube,
    color: "#FF0000",
    placeholder: "Channel ID or @handle",
  },
  {
    key: "githubUser",
    label: "GitHub",
    icon: FaGithub,
    color: "#ffffff",
    placeholder: "Username",
  },
  {
    key: "telegramUser",
    label: "Telegram",
    icon: FaTelegram,
    color: "#0088cc",
    placeholder: "Username",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    color: "#E4405F",
    placeholder: "Username",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: FaTwitter,
    color: "#1DA1F2",
    placeholder: "Handle",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
    color: "#0A66C2",
    placeholder: "Profile slug",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
    color: "#ff0050",
    placeholder: "Username",
  },
];

const DashboardSocials = ({ userData, onRefresh }) => {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (userData) {
      setForm({
        youtubeId: userData.youtubeId || "",
        githubUser: userData.githubUser || "",
        telegramUser: userData.telegramUser || "",
        instagram: userData.instagram || "",
        twitter: userData.twitter || "",
        linkedin: userData.linkedin || "",
        tiktok: userData.tiktok || "",
      });
    }
  }, [userData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(
        `${API_BASE_URL}/api/users/social-profiles`,
        form,
        { headers }
      );
      toast.success("Social profiles saved!");
      onRefresh?.();
    } catch (err) {
      toast.error("Failed to save social profiles");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-white mb-1">Socials</h2>
      <p className="text-white/40 text-sm mb-8">
        Connect your social media accounts
      </p>

      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        {PLATFORMS.map((platform) => {
          const IconComponent = platform.icon;
          const value = form[platform.key] || "";
          const isConnected = value.length > 0;

          return (
            <div
              key={platform.key}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                isConnected
                  ? "bg-white/5 border-white/10"
                  : "bg-transparent border-white/5"
              }`}
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${platform.color}15` }}
              >
                <IconComponent
                  className="w-5 h-5"
                  style={{ color: platform.color }}
                />
              </div>

              <div className="flex-1">
                <label className="block text-white/70 text-xs font-medium mb-1">
                  {platform.label}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setForm({ ...form, [platform.key]: e.target.value })
                  }
                  placeholder={platform.placeholder}
                  className="w-full bg-transparent text-white text-sm outline-none placeholder-white/20"
                />
              </div>

              {isConnected && (
                <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              )}
            </div>
          );
        })}

        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl
                   text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Socials"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DashboardSocials;
