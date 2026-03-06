import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Palette, Check, Sparkles } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const THEMES = [
  {
    id: "dark-pro",
    name: "Dark Pro",
    preview: "bg-gradient-to-b from-[#0a0a0a] to-[#111111]",
    accent: "#8B5CF6",
    description: "Clean, professional dark theme",
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    preview: "bg-gradient-to-b from-[#0a001a] to-[#0f0028]",
    accent: "#00ff88",
    description: "Futuristic neon vibes",
  },
  {
    id: "minimal",
    name: "Minimal Light",
    preview: "bg-gradient-to-b from-[#f8f9fa] to-[#ffffff]",
    accent: "#6366f1",
    description: "Clean, light & minimal",
  },
  {
    id: "creator-mode",
    name: "Creator Mode",
    preview: "bg-gradient-to-b from-[#0a0a1a] to-[#1a0a2e]",
    accent: "#ff0050",
    description: "Bold creative energy",
  },
];

const BACKGROUNDS = [
  { value: "purple-pink", label: "Purple → Pink", colors: "from-purple-900 to-pink-900" },
  { value: "blue-cyan", label: "Blue → Cyan", colors: "from-blue-900 to-cyan-900" },
  { value: "emerald-teal", label: "Emerald → Teal", colors: "from-emerald-900 to-teal-900" },
  { value: "amber-orange", label: "Amber → Orange", colors: "from-amber-900 to-orange-900" },
];

const DashboardSettings = ({ userData, onRefresh }) => {
  const [selectedTheme, setSelectedTheme] = useState(
    userData?.theme || "dark-pro"
  );
  const [selectedBg, setSelectedBg] = useState(
    userData?.background_value || "purple-pink"
  );
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (userData) {
      setSelectedTheme(userData.theme || "dark-pro");
      setSelectedBg(userData.background_value || "purple-pink");
    }
  }, [userData]);

  // Apply theme INSTANTLY on selection (live preview)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }, [selectedTheme]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/profile`,
        {
          theme: selectedTheme,
          background_type: "gradient",
          background_value: selectedBg,
        },
        { headers }
      );
      toast.success("Settings saved! Theme applied everywhere.");
      onRefresh?.();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        Settings
      </h2>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Customize your entire page — theme changes apply everywhere instantly
      </p>

      {/* Theme Selection */}
      <div className="mb-10">
        <h3 className="font-medium text-sm mb-4 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}>
          <Sparkles className="w-4 h-4" style={{ color: "var(--accent)" }} />
          Theme
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {THEMES.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedTheme(theme.id)}
              className="relative p-4 rounded-xl border-2 transition-all duration-300 text-left"
              style={{
                borderColor:
                  selectedTheme === theme.id
                    ? "var(--accent)"
                    : "var(--card-border)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <div
                className={`w-full h-16 rounded-lg mb-2.5 ${theme.preview}`}
              />
              <p className="text-xs font-semibold" style={{ color: theme.accent }}>
                {theme.name}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                {theme.description}
              </p>
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: "var(--accent)" }}>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Background Gradient */}
      <div className="mb-10">
        <h3 className="font-medium text-sm mb-4 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}>
          <Palette className="w-4 h-4" style={{ color: "var(--accent)" }} />
          Background Gradient
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BACKGROUNDS.map((bg) => (
            <motion.button
              key={bg.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedBg(bg.value)}
              className="relative p-3 rounded-xl border-2 transition-all duration-300"
              style={{
                borderColor:
                  selectedBg === bg.value
                    ? "var(--accent)"
                    : "var(--card-border)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <div
                className={`w-full h-12 rounded-lg bg-gradient-to-br ${bg.colors}`}
              />
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                {bg.label}
              </p>
              {selectedBg === bg.value && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: "var(--accent)" }}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Save */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white
                 text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
        style={{ background: "var(--accent-gradient)" }}
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Settings"}
      </motion.button>
    </motion.div>
  );
};

export default DashboardSettings;
