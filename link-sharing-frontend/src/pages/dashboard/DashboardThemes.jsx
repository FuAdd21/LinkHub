import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { api } from "../../api/config";
import LiveCanvasPreview from "../../Components/dashboard/LiveCanvasPreview/LiveCanvasPreview";

const THEMES = [
  { id: "Obsidian", name: "Obsidian", bg: "#11120F", dot: "#c6f035", text: "#ffffff" },
  { id: "Paper", name: "Paper", bg: "#f3f4f3", dot: "#11120F", text: "#11120F" },
  { id: "Signal", name: "Signal", bg: "#0d131a", dot: "#00d2ff", text: "#ffffff" },
];

const ACCENT_PALETTE = [
  "#c6f035", // Electric Lime
  "#00d2ff", // Cyan
  "#ff8c42", // Orange / Amber
  "#f43f5e", // Pink / Coral
  "#ffffff", // White
];

const HEADING_FONTS = [
  "Manrope / Semibold",
  "Inter / Bold",
  "Space Grotesk / Medium",
  "Outfit / Semibold",
];

const LABEL_FONTS = [
  "IBM Plex Mono / Medium",
  "JetBrains Mono / Regular",
  "Fira Code / Medium",
];

export default function DashboardThemes({
  userData,
  links = [],
  integrations,
  onRefresh,
  onUserChange,
}) {
  const [theme, setTheme] = useState(userData?.theme || "Obsidian");
  const [accent, setAccent] = useState(userData?.accent_color || "#c6f035");
  const [surface, setSurface] = useState(userData?.surface_color || "#11120F");
  const [headingFont, setHeadingFont] = useState(userData?.font_heading || "Manrope / Semibold");
  const [labelFont, setLabelFont] = useState(userData?.font_labels || "IBM Plex Mono / Medium");
  const [displayName, setDisplayName] = useState(userData?.name || userData?.username || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [showVerified, setShowVerified] = useState(
    userData?.show_verified_badge !== 0 && userData?.show_verified_badge !== false
  );
  const [showSocials, setShowSocials] = useState(
    userData?.show_social_row !== 0 && userData?.show_social_row !== false
  );

  const [activeMobileTab, setActiveMobileTab] = useState("design");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userData) {
      if (userData.theme) setTheme(userData.theme);
      if (userData.accent_color) setAccent(userData.accent_color);
      if (userData.surface_color) setSurface(userData.surface_color);
      if (userData.font_heading) setHeadingFont(userData.font_heading);
      if (userData.font_labels) setLabelFont(userData.font_labels);
      if (userData.name) setDisplayName(userData.name);
      if (userData.bio) setBio(userData.bio);
      setShowVerified(userData.show_verified_badge !== 0 && userData.show_verified_badge !== false);
      setShowSocials(userData.show_social_row !== 0 && userData.show_social_row !== false);
    }
  }, [userData]);

  const handlePublish = async () => {
    setSaving(true);
    const loadingToast = toast.loading("Publishing appearance...");
    try {
      const payload = {
        name: displayName.trim(),
        bio: bio.trim(),
        theme,
        accent_color: accent,
        surface_color: surface,
        font_heading: headingFont,
        font_labels: labelFont,
        show_verified_badge: showVerified ? 1 : 0,
        show_social_row: showSocials ? 1 : 0,
      };

      const res = await api.put("/api/profile", payload);
      onUserChange?.(res.data.user || res.data.profile);
      onRefresh?.();
      toast.success("Appearance published successfully", { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish appearance", {
        id: loadingToast,
      });
    } finally {
      setSaving(false);
    }
  };

  const previewUser = {
    ...userData,
    name: displayName || userData?.username || "Your Name",
    bio: bio,
    theme: theme,
    accent_color: accent,
    surface_color: surface,
    font_heading: headingFont,
    font_labels: labelFont,
    show_verified_badge: showVerified,
    show_social_row: showSocials,
  };

  const renderPreviewFrame = () => (
    <div className="w-full flex justify-center">
      <LiveCanvasPreview
        user={previewUser}
        links={links}
        integrations={integrations}
      />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-12">
      {/* Left Column: Customization Controls */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Appearance
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Shape the visual system, themes, and styling behind your public identity.
            </p>
          </div>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-[#c6f035]/10 disabled:opacity-50"
          >
            {saving ? "Publishing..." : "Publish changes"}
          </button>
        </div>

        {/* Mobile Sub-tabs: Design | Profile | Preview */}
        <div className="flex md:hidden items-center gap-2 pt-1 pb-1">
          <button
            type="button"
            onClick={() => setActiveMobileTab("design")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
              activeMobileTab === "design"
                ? "border-[#c6f035] text-[#c6f035] bg-[#161510]"
                : "border-white/5 text-slate-400 bg-[#13120D] hover:text-white"
            }`}
          >
            Design
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab("profile")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
              activeMobileTab === "profile"
                ? "border-[#c6f035] text-[#c6f035] bg-[#161510]"
                : "border-white/5 text-slate-400 bg-[#13120D] hover:text-white"
            }`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab("preview")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
              activeMobileTab === "preview"
                ? "border-[#c6f035] text-[#c6f035] bg-[#161510]"
                : "border-white/5 text-slate-400 bg-[#13120D] hover:text-white"
            }`}
          >
            Preview
          </button>
        </div>

        {/* Mobile "Preview" tab view */}
        {activeMobileTab === "preview" && (
          <div className="md:hidden space-y-4 pt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Profile
              </span>
              <span className="px-2.5 py-0.5 rounded-md border border-[#c6f035] text-[11px] font-bold text-[#c6f035]">
                Mobile
              </span>
            </div>
            {renderPreviewFrame(true)}
          </div>
        )}

        {/* Main Appearance Controls (Design / Profile) */}
        <div
          className={`rounded-2xl bg-[#13120D] border border-white/5 p-5 sm:p-7 space-y-7 ${
            activeMobileTab === "preview" ? "hidden md:block" : "block"
          }`}
        >
          {/* SECTION 1: THEME (Show on desktop/tablet, or mobile if 'design') */}
          <div
            className={`space-y-3 ${
              activeMobileTab === "profile" ? "hidden md:block" : "block"
            }`}
          >
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Theme
            </span>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`relative p-3.5 sm:p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all ${
                      isSelected
                        ? "border-[#c6f035] ring-1 ring-[#c6f035]/50 bg-[#1a1914]"
                        : "border-white/5 hover:border-white/15 bg-[#11120F]"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: t.dot }}
                    />
                    <span className="text-xs font-bold text-white tracking-wide">
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: COLOR SYSTEM */}
          <div
            className={`space-y-5 ${
              activeMobileTab === "profile" ? "hidden md:block" : "block"
            }`}
          >
            <div className="border-t border-white/5" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Color system
            </span>

            {/* Accent Swatches */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Accent</span>
              <div className="flex items-center gap-2.5 sm:gap-3">
                {ACCENT_PALETTE.map((color) => {
                  const isSelected = accent.toLowerCase() === color.toLowerCase();
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAccent(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${
                        isSelected
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#13120D] scale-110"
                          : "hover:scale-105 opacity-90 hover:opacity-100"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-black" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Surface Hex Input */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-slate-400">Surface</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-lg bg-[#11120F] border border-white/10 text-xs font-mono text-white text-center focus:border-[#c6f035] focus:outline-none"
                />
                <div
                  className="w-6 h-6 rounded-md border border-white/10 shrink-0"
                  style={{ backgroundColor: surface }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: TYPOGRAPHY */}
          <div
            className={`space-y-4 ${
              activeMobileTab === "profile" ? "hidden md:block" : "block"
            }`}
          >
            <div className="border-t border-white/5" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Typography
            </span>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-400">Heading</span>
                <select
                  value={headingFont}
                  onChange={(e) => setHeadingFont(e.target.value)}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none"
                >
                  {HEADING_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-400">Labels</span>
                <select
                  value={labelFont}
                  onChange={(e) => setLabelFont(e.target.value)}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none"
                >
                  {LABEL_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: PROFILE DETAILS */}
          <div
            className={`space-y-4 ${
              activeMobileTab === "design" ? "hidden md:block" : "block"
            }`}
          >
            <div className="border-t border-white/5" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Profile details
            </span>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-400">Display name</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <span className="text-xs font-medium text-slate-400 pt-2">Bio</span>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-slate-400">Show verified badge</span>
                <button
                  type="button"
                  onClick={() => setShowVerified(!showVerified)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showVerified ? "bg-[#c6f035]" : "bg-[#25241f]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0B0A07] shadow-lg ring-0 transition duration-200 ease-in-out ${
                      showVerified ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-slate-400">Show social row</span>
                <button
                  type="button"
                  onClick={() => setShowSocials(!showSocials)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showSocials ? "bg-[#c6f035]" : "bg-[#25241f]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0B0A07] shadow-lg ring-0 transition duration-200 ease-in-out ${
                      showSocials ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: In 'design' tab, show live profile preview box right below theme card (matching mobile-02 screenshot!) */}
        {activeMobileTab === "design" && (
          <div className="md:hidden space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#c6f035]">
                Live Profile
              </span>
              <span className="px-2.5 py-0.5 rounded-md border border-[#c6f035] text-[10px] font-bold text-[#c6f035]">
                Mobile
              </span>
            </div>
            {renderPreviewFrame(true)}
          </div>
        )}
      </div>

      {/* Right Column: Live Preview (Tablet & Desktop 2-column view matching tablet-02) */}
      <div className="hidden md:block w-full md:w-[320px] xl:w-[380px] shrink-0 space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#c6f035]">
            Live Preview
          </span>
          <span className="px-2.5 py-0.5 rounded-md border border-[#c6f035] text-[10px] font-bold text-[#c6f035]">
            Mobile
          </span>
        </div>

        {renderPreviewFrame(false)}
      </div>
    </div>
  );
}
