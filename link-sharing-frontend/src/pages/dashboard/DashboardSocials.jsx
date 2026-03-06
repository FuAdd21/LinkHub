import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Loader2, Eye } from "lucide-react";
import {
  FaYoutube,
  FaGithub,
  FaTelegram,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";
import SocialProfileCard, { SocialCardSkeleton } from "../../components/SocialProfileCard";
import { fetchSocialProfiles } from "../../api/socialApi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const PLATFORMS = [
  {
    key: "youtubeId",
    label: "YouTube",
    icon: FaYoutube,
    color: "#FF0000",
    placeholder: "Channel ID or @handle",
    socialKey: "youtube",
  },
  {
    key: "githubUser",
    label: "GitHub",
    icon: FaGithub,
    color: "#ffffff",
    placeholder: "Username",
    socialKey: "github",
  },
  {
    key: "telegramUser",
    label: "Telegram",
    icon: FaTelegram,
    color: "#0088cc",
    placeholder: "Username",
    socialKey: "telegram",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    color: "#E4405F",
    placeholder: "Username",
    socialKey: "instagram",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: FaTwitter,
    color: "#1DA1F2",
    placeholder: "Handle",
    socialKey: "twitter",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
    color: "#0A66C2",
    placeholder: "Profile slug",
    socialKey: "linkedin",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
    color: "#ff0050",
    placeholder: "Username",
    socialKey: "tiktok",
  },
];

const DashboardSocials = ({ userData, onRefresh }) => {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [socialData, setSocialData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

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

  const handlePreview = async () => {
    setShowPreview(true);
    setPreviewLoading(true);

    try {
      const result = await fetchSocialProfiles({
        youtubeId: form.youtubeId || null,
        githubUser: form.githubUser || null,
        telegramUser: form.telegramUser || null,
        instagram: form.instagram || null,
        twitter: form.twitter || null,
        linkedin: form.linkedin || null,
        tiktok: form.tiktok || null,
      });
      setSocialData(result);
    } catch (err) {
      console.error("Preview fetch failed:", err);
      toast.error("Failed to fetch social profile previews");
    } finally {
      setPreviewLoading(false);
    }
  };

  // Get connected platforms for preview
  const connectedPlatforms = PLATFORMS.filter((p) => form[p.key]?.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
        Socials
      </h2>
      <p className="text-[var(--text-muted)] text-sm mb-8">
        Connect your social media accounts to show rich profile cards
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input form */}
        <form onSubmit={handleSave} className="space-y-4 flex-1 max-w-xl">
          {PLATFORMS.map((platform) => {
            const IconComponent = platform.icon;
            const value = form[platform.key] || "";
            const isConnected = value.length > 0;

            return (
              <div
                key={platform.key}
                className="flex items-center gap-4 p-4 rounded-xl border transition-colors"
                style={{
                  backgroundColor: isConnected ? "var(--card-bg)" : "transparent",
                  borderColor: isConnected ? "var(--card-border)" : "var(--input-border)",
                }}
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
                  <label className="block text-xs font-medium mb-1"
                         style={{ color: "var(--text-secondary)" }}>
                    {platform.label}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setForm({ ...form, [platform.key]: e.target.value })
                    }
                    placeholder={platform.placeholder}
                    className="w-full bg-transparent text-sm outline-none"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {isConnected && (
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                )}
              </div>
            );
          })}

          <div className="flex items-center gap-3 mt-6">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white
                       text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{ background: "var(--accent-gradient)" }}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Socials"}
            </motion.button>

            {connectedPlatforms.length > 0 && (
              <motion.button
                type="button"
                onClick={handlePreview}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{
                  color: "var(--accent)",
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                }}
              >
                <Eye className="w-4 h-4" />
                Preview Cards
              </motion.button>
            )}
          </div>
        </form>

        {/* Live Preview Panel */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 max-w-md"
          >
            <h3 className="text-sm font-medium mb-4"
                style={{ color: "var(--text-secondary)" }}>
              Card Preview
            </h3>
            <div className="space-y-3">
              {previewLoading ? (
                connectedPlatforms.map((p) => (
                  <SocialCardSkeleton key={p.key} />
                ))
              ) : (
                connectedPlatforms.map((p, index) => (
                  <SocialProfileCard
                    key={p.key}
                    platform={p.socialKey}
                    data={socialData?.[p.socialKey]}
                    index={index}
                    showDisconnected={true}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardSocials;
