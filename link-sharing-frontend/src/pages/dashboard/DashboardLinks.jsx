import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  GripVertical,
  Plus,
  CheckCircle2,
  MoreVertical,
  ArrowUpRight,
  ExternalLink,
  Trash2,
  Edit2,
  Copy,
  Globe,
  Github,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Radio,
  FileText,
  Calendar,
  X,
  Sparkles,
  Layers,
  Tag,
  AlertCircle,
} from "lucide-react";
import { api } from "../../api/config";
import { linksApi } from "../../api/linksApi";
import { getErrorMessage } from "../../api/responseHandler";
import { getAvatarUrl } from "../../Components/dashboard/dashboardUtils";

// Helper to pick platform icon
function getPlatformIcon(url = "", platform = "") {
  const lowerUrl = (url + " " + platform).toLowerCase();
  if (lowerUrl.includes("github")) return Github;
  if (lowerUrl.includes("youtube") || lowerUrl.includes("youtu.be")) return Youtube;
  if (lowerUrl.includes("instagram")) return Instagram;
  if (lowerUrl.includes("twitter") || lowerUrl.includes("x.com")) return Twitter;
  if (lowerUrl.includes("linkedin")) return Linkedin;
  if (lowerUrl.includes("cal.com") || lowerUrl.includes("calendar")) return Calendar;
  if (lowerUrl.includes("essay") || lowerUrl.includes("blog") || lowerUrl.includes("notes")) return FileText;
  if (lowerUrl.includes("podcast") || lowerUrl.includes("spotify")) return Radio;
  return ArrowUpRight;
}

export default function DashboardLinks({
  userData,
  links = [],
  integrations,
  onRefresh,
  onUserChange,
  onLinksChange,
}) {
  const [localLinks, setLocalLinks] = useState(links);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [form, setForm] = useState({
    title: "",
    url: "",
    platform: "General",
    display_mode: "link",
  });
  const [saving, setSaving] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState(null);

  // Set of connected integration providers to warn against duplicates
  const connectedList = Array.isArray(integrations)
    ? integrations
    : integrations?.connected || [];

  const connectedProviders = new Set(
    connectedList.map((i) => (i.provider || "").toLowerCase().trim()).filter(Boolean)
  );

  const checkConnectedIntegration = (url = "", platform = "") => {
    const u = (url || "").toLowerCase();
    const p = (platform || "").toLowerCase();
    if (connectedProviders.has(p)) return platform || p;
    if (connectedProviders.has("linkedin") && (p.includes("linkedin") || u.includes("linkedin.com"))) return "LinkedIn";
    if (connectedProviders.has("youtube") && (p.includes("youtube") || u.includes("youtube.com") || u.includes("youtu.be"))) return "YouTube";
    if (connectedProviders.has("github") && (p.includes("github") || u.includes("github.com"))) return "GitHub";
    if (connectedProviders.has("instagram") && (p.includes("instagram") || u.includes("instagram.com"))) return "Instagram";
    if (connectedProviders.has("tiktok") && (p.includes("tiktok") || u.includes("tiktok.com"))) return "TikTok";
    if (connectedProviders.has("twitter") && (p.includes("twitter") || p.includes("x") || u.includes("twitter.com") || u.includes("x.com"))) return "Twitter / X";
    if (connectedProviders.has("telegram") && (p.includes("telegram") || u.includes("t.me") || u.includes("telegram.me"))) return "Telegram";
    if (connectedProviders.has("spotify") && (p.includes("spotify") || u.includes("spotify.com"))) return "Spotify";
    return null;
  };

  const matchedConnectedProvider = checkConnectedIntegration(form.url, form.platform);

  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Drag & drop reordering
  const handleDragStart = (e, index) => {
    setDraggingIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggingIdx === null || draggingIdx === index) return;

    const updated = [...localLinks];
    const [draggedItem] = updated.splice(draggingIdx, 1);
    updated.splice(index, 0, draggedItem);
    setDraggingIdx(index);
    setLocalLinks(updated);
  };

  const handleDragEnd = async () => {
    setDraggingIdx(null);
    try {
      const order = localLinks.map((l) => l.id);
      await linksApi.reorderLinks(order);
      onLinksChange?.(localLinks);
      toast.success("Link order updated");
    } catch (err) {
      setLocalLinks(links); // Rollback to authoritative links prop on failure
      toast.error(getErrorMessage(err, "Failed to save link order"));
      onRefresh?.();
    }
  };

  // Visibility toggle
  const handleToggleVisibility = async (link) => {
    const currentVal = link.is_visible !== 0 && link.is_visible !== false;
    const nextVal = currentVal ? 0 : 1;

    // Optimistic UI update
    const updated = localLinks.map((l) =>
      l.id === link.id ? { ...l, is_visible: nextVal } : l
    );
    setLocalLinks(updated);

    try {
      await linksApi.toggleVisibility(link.id, nextVal);
      onLinksChange?.(updated);
      toast.success(nextVal ? "Link is now visible" : "Link is hidden");
    } catch (err) {
      setLocalLinks(localLinks); // Rollback
      toast.error(getErrorMessage(err, "Failed to update link visibility"));
      onRefresh?.();
    }
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingLink(null);
    setForm({ title: "", url: "", platform: "General", display_mode: "link" });
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (link) => {
    setEditingLink(link);
    setForm({
      title: link.title || "",
      url: link.url || "",
      platform: link.platform || "General",
      display_mode: link.display_mode || "link",
    });
    setModalOpen(true);
  };

  // Smart URL input handler — auto-detects platform and suggests display mode
  const handleUrlChange = (e) => {
    const val = e.target.value;
    const lower = val.toLowerCase();
    let detectedPlatform = form.platform;
    let autoTitle = form.title;
    let autoDisplayMode = form.display_mode;

    if (lower.includes("linkedin.com")) {
      detectedPlatform = "LinkedIn";
      if (!form.title || form.title === "General" || form.title === "Link") autoTitle = "LinkedIn";
      if ((!form.display_mode || form.display_mode === "link") && !editingLink) autoDisplayMode = "header_pill";
    } else if (lower.includes("github.com")) {
      detectedPlatform = "GitHub";
      if (!form.title || form.title === "General" || form.title === "Link") autoTitle = "GitHub";
    } else if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
      detectedPlatform = "YouTube";
      if (!form.title || form.title === "General" || form.title === "Link") autoTitle = "YouTube Channel";
    } else if (lower.includes("twitter.com") || lower.includes("x.com")) {
      detectedPlatform = "Twitter";
      if (!form.title || form.title === "General" || form.title === "Link") autoTitle = "X (Twitter)";
      if ((!form.display_mode || form.display_mode === "link") && !editingLink) autoDisplayMode = "header_pill";
    } else if (lower.includes("instagram.com")) {
      detectedPlatform = "Instagram";
      if (!form.title || form.title === "General" || form.title === "Link") autoTitle = "Instagram";
      if ((!form.display_mode || form.display_mode === "link") && !editingLink) autoDisplayMode = "header_pill";
    } else if (lower.includes("tiktok.com")) {
      detectedPlatform = "TikTok";
      if (!form.title || form.title === "General" || form.title === "Link") autoTitle = "TikTok";
      if ((!form.display_mode || form.display_mode === "link") && !editingLink) autoDisplayMode = "header_pill";
    } else if (lower.includes("spotify.com")) {
      detectedPlatform = "Spotify";
      if (!form.title || form.title === "General" || form.title === "Link") autoTitle = "Spotify";
    } else if (lower.includes("t.me") || lower.includes("telegram.me")) {
      detectedPlatform = "Telegram";
      if (!form.title || form.title === "General" || form.title === "Link") autoTitle = "Telegram";
      if ((!form.display_mode || form.display_mode === "link") && !editingLink) autoDisplayMode = "header_pill";
    }

    setForm((prev) => ({
      ...prev,
      url: val,
      platform: detectedPlatform,
      title: autoTitle || prev.title,
      display_mode: autoDisplayMode,
    }));
  };

  // Quick toggle display mode directly from card or dropdown
  const handleToggleDisplayMode = async (link, newMode) => {
    const previousLinks = [...localLinks];
    const updated = localLinks.map((l) =>
      l.id === link.id ? { ...l, display_mode: newMode } : l
    );
    setLocalLinks(updated);
    try {
      await linksApi.updateDisplayMode(link.id, newMode);
      onLinksChange?.(updated);
      const label = newMode === "header_pill" ? "Header Icon" : newMode === "rich_card" ? "Rich Live Card" : "Link Card";
      toast.success(`Display mode set to ${label}`);
      onRefresh?.();
    } catch (err) {
      setLocalLinks(previousLinks); // Rollback
      toast.error(getErrorMessage(err, "Failed to update display mode"));
      onRefresh?.();
    }
  };

  // Save Link (Create or Edit)
  const handleSaveLink = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      toast.error("Title and URL are required");
      return;
    }

    let normalizedUrl = form.url.trim();
    // Clean accidental repeated prefixes like tiktok.com/@https://...
    if (normalizedUrl.includes("tiktok.com/@https://")) {
      normalizedUrl = normalizedUrl.replace(/.*tiktok\.com\/@https?:\/\//i, "https://");
    } else if (normalizedUrl.includes("tiktok.com/@http://")) {
      normalizedUrl = normalizedUrl.replace(/.*tiktok\.com\/@https?:\/\//i, "http://");
    } else if (normalizedUrl.includes("linkedin.com/in/https://")) {
      normalizedUrl = normalizedUrl.replace(/.*linkedin\.com\/in\/https?:\/\//i, "https://");
    }

    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        url: normalizedUrl,
        platform: form.platform,
        display_mode: form.display_mode || "link",
      };

      if (editingLink) {
        const res = await linksApi.updateLink(editingLink.id, payload);
        const updatedLink = res.link || res;
        const updated = localLinks.map((l) =>
          l.id === editingLink.id ? { ...l, ...updatedLink } : l
        );
        setLocalLinks(updated);
        onLinksChange?.(updated);
        toast.success("Link updated");
      } else {
        const res = await linksApi.createLink(payload);
        const createdLink = res.link || res;
        const updated = [createdLink, ...localLinks];
        setLocalLinks(updated);
        onLinksChange?.(updated);
        toast.success("Link published");
      }
      if (matchedConnectedProvider) {
        toast(
          `${matchedConnectedProvider} is already integrated. Profile automatically highlights your live card without duplicates.`,
          { icon: "💡", duration: 4000 }
        );
      }
      setModalOpen(false);
      onRefresh?.();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save link"));
    } finally {
      setSaving(false);
    }
  };

  // Delete Link
  const handleDeleteLink = async (linkId) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await linksApi.deleteLink(linkId);
      const updated = localLinks.filter((l) => l.id !== linkId);
      setLocalLinks(updated);
      onLinksChange?.(updated);
      toast.success("Link removed");
      onRefresh?.();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete link"));
    }
  };

  // Copy link to clipboard
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const avatarUrl = getAvatarUrl(userData?.avatar);
  const userInitials = (userData?.name || "MK")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const activeCount = localLinks.filter((l) => l.is_visible !== 0 && l.is_visible !== false).length;

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-12">
      {/* Center Column: Links Editor */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Links
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono font-semibold text-[#c6f035]">
                {activeCount} active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Add, reorder, and organize your destination links and social pills.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-[#c6f035]/10"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add link
          </button>
        </div>

        {/* Status Notification Banner */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#13120D] border border-white/5 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c6f035] shadow-[0_0_8px_#c6f035]" />
            <span className="font-bold text-white">All changes published</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
            LIVE
          </span>
        </div>

        {/* Multi-account & Integration guidance banner */}
        <div className="flex items-start sm:items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#161510] border border-white/5 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c6f035] shrink-0" />
            <span>
              <strong className="text-white">Multi-account ready:</strong> Add multiple channels (e.g. 2nd YouTube, extra Telegram group, portfolio, or custom link) anytime here.
            </span>
          </div>
          <span className="text-[#c6f035] font-semibold shrink-0 hidden sm:inline">
            Auto-synced with Integrations
          </span>
        </div>

        {/* Reorderable Links List */}
        <div className="space-y-3">
          {localLinks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#13120D] border border-white/5 space-y-3">
              <Globe className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No links active yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your first link destination to share your tools, content, and socials with the world.
              </p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-1.5 mt-2"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                Add your first link
              </button>
            </div>
          ) : (
            localLinks.map((link, index) => {
              const isVisible = link.is_visible !== 0 && link.is_visible !== false;
              const cleanUrl = (link.url || "").replace(/^https?:\/\//i, "");
              const isIntegrated = checkConnectedIntegration(link.url, link.platform);

              return (
                <div
                  key={link.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative rounded-xl border transition-all duration-200 p-4 ${
                    draggingIdx === index
                      ? "opacity-40 bg-[#1f1d16] border-[#c6f035]/40"
                      : isVisible
                      ? "bg-[#13120D] border-white/5 hover:border-white/10 hover:bg-[#161510]"
                      : "bg-[#13120D]/60 border-white/5 opacity-60"
                  }`}
                >
                  {/* Mobile Top Row (hidden on sm+) */}
                  <div className="flex items-center justify-between sm:hidden">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <button
                        type="button"
                        className="text-slate-600 hover:text-slate-300 cursor-grab active:cursor-grabbing p-0.5 transition-colors shrink-0"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate">
                            {link.title}
                          </h4>
                          {isIntegrated && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 flex items-center gap-1"
                              title={`${isIntegrated} is active in Integrations`}
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                              Integrated
                            </span>
                          )}
                          {link.display_mode === "header_pill" && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                              Header Icon
                            </span>
                          )}
                          {link.display_mode === "rich_card" && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                              Rich Card
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-500 truncate mt-0.5">
                          {cleanUrl}
                        </p>
                      </div>
                    </div>
                    {/* Switch Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(link)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isVisible ? "bg-[#c6f035]" : "bg-[#25241f]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0B0A07] shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isVisible ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Tablet & Desktop Top Row (hidden on mobile) */}
                  <div className="hidden sm:flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        className="text-slate-600 hover:text-slate-300 cursor-grab active:cursor-grabbing p-1 transition-colors shrink-0"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-[#c6f035] transition-colors">
                            {link.title}
                          </h4>
                          {isIntegrated && (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 flex items-center gap-1"
                              title={`${isIntegrated} is actively connected in your Integrations`}
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Integrated in Socials
                            </span>
                          )}
                          {link.display_mode === "header_pill" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                              Header Icon
                            </span>
                          )}
                          {link.display_mode === "rich_card" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                              Rich Card
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-500 truncate mt-0.5">
                          {cleanUrl}
                        </p>
                        {isIntegrated && (
                          <p className="text-[10px] font-mono text-emerald-400/80 mt-0.5 flex items-center gap-1">
                            Live integration active · Rich card and stats auto-displayed on public profile
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-8 font-mono text-xs shrink-0">
                      <div className="text-left">
                        <div className="text-sm font-bold text-white">
                          {(Number(link.clicks) || 0).toLocaleString()}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">
                          Clicks
                        </div>
                      </div>
                      <div className="text-left min-w-[64px]">
                        <div className="text-sm font-bold text-white">
                          {link.conversionRate || "0.0%"}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">
                          Conversion
                        </div>
                      </div>

                      {/* Switch Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(link)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isVisible ? "bg-[#c6f035]" : "bg-[#25241f]"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0B0A07] shadow-lg ring-0 transition duration-200 ease-in-out ${
                            isVisible ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/5 my-3" />

                  {/* Bottom Row - Mobile (Clicks, Conv, and Menu) */}
                  <div className="flex items-center justify-between sm:hidden pt-0.5">
                    <div className="flex items-center gap-8 font-mono">
                      <div>
                        <div className="text-sm font-bold text-white">
                          {(Number(link.clicks) || 0).toLocaleString()}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">
                          Clicks
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {link.conversionRate || "0.0%"}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">
                          Conversion
                        </div>
                      </div>
                    </div>

                    {/* Three Dots Menu Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === link.id ? null : link.id);
                        }}
                        className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === link.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 bottom-9 w-44 rounded-xl bg-[#1a1914] border border-white/10 shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150"
                        >
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleOpenEdit(link);
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit link
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleCopyLink(link.url);
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Copy link URL
                          </button>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setActiveMenuId(null)}
                            className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open in new tab
                          </a>
                          <div className="my-1 border-t border-white/5" />
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleToggleDisplayMode(link, link.display_mode === "header_pill" ? "link" : "header_pill");
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Tag className="w-3.5 h-3.5 text-[#c6f035]" />
                            {link.display_mode === "header_pill" ? "Convert to Link Card" : "Move to Header Icon"}
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleToggleDisplayMode(link, link.display_mode === "rich_card" ? "link" : "rich_card");
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#c6f035]" />
                            {link.display_mode === "rich_card" ? "Convert to Link Card" : "Move to Rich Card"}
                          </button>
                          <div className="my-1 border-t border-white/5" />
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleDeleteLink(link.id);
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row - Tablet & Desktop ("Open destination" on left, Menu on right) */}
                  <div className="hidden sm:flex items-center justify-between pt-0.5 text-xs">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-[#c6f035] transition-colors inline-flex items-center gap-1.5 font-mono text-xs"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Open destination
                    </a>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === link.id ? null : link.id);
                        }}
                        className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === link.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-10 w-48 rounded-xl bg-[#1a1914] border border-white/10 shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150"
                        >
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleOpenEdit(link);
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit link
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleCopyLink(link.url);
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Copy link URL
                          </button>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setActiveMenuId(null)}
                            className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open in new tab
                          </a>
                          <div className="my-1 border-t border-white/5" />
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleToggleDisplayMode(link, link.display_mode === "header_pill" ? "link" : "header_pill");
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Tag className="w-3.5 h-3.5 text-[#c6f035]" />
                            {link.display_mode === "header_pill" ? "Convert to Link Card" : "Move to Header Icon"}
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleToggleDisplayMode(link, link.display_mode === "rich_card" ? "link" : "rich_card");
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#c6f035]" />
                            {link.display_mode === "rich_card" ? "Convert to Link Card" : "Move to Rich Card"}
                          </button>
                          <div className="my-1 border-t border-white/5" />
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleDeleteLink(link.id);
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Profile Preview (Desktop View matching image copy.png, hidden on tablet and mobile) */}
      <div className="hidden xl:block w-[380px] shrink-0 space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Profile preview
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#13120D] border border-white/5 text-[11px] font-semibold text-slate-400">
            Desktop
          </span>
        </div>

        {/* Mockup Frame */}
        <div className="rounded-2xl bg-[#13120D] border border-white/5 p-6 flex flex-col items-center justify-between min-h-[520px] shadow-2xl">
          <div className="w-full flex flex-col items-center text-center space-y-4 pt-4">
            {/* Avatar Circle */}
            <div className="w-20 h-20 rounded-full border-2 border-[#c6f035] p-1 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userData?.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#1a1914] flex items-center justify-center font-bold text-lg text-[#c6f035]">
                  {userInitials}
                </div>
              )}
            </div>

            {/* Name & Bio */}
            <div>
              <h3 className="text-base font-black text-white">
                {userData?.name || userData?.username || "Your Name"}
              </h3>
              {userData?.bio && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {userData.bio}
                </p>
              )}
            </div>

            {/* Connected Networks Metrics & Summary */}
            {connectedList.length > 0 && (
              <div className="w-full space-y-2 pt-1">
                <div className="text-[11px] font-bold text-[#c6f035]">
                  {connectedList
                    .reduce((acc, curr) => acc + (Number(curr.followers) || 0), 0)
                    .toLocaleString()}{" "}
                  combined audience
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  {connectedList.map((net) => {
                    const p = (net.provider || "").toLowerCase();
                    const code =
                      p === "youtube"
                        ? "YT"
                        : p === "github"
                        ? "GH"
                        : p === "instagram"
                        ? "IG"
                        : p === "tiktok"
                        ? "TK"
                        : p === "linkedin"
                        ? "IN"
                        : p === "telegram"
                        ? "TG"
                        : p === "twitter"
                        ? "X"
                        : net.badge || p.slice(0, 2).toUpperCase();
                    const color =
                      net.color ||
                      (p === "youtube"
                        ? "#ff0000"
                        : p === "tiktok"
                        ? "#00f2ff"
                        : p === "linkedin"
                        ? "#0A66C2"
                        : p === "github"
                        ? "#24292e"
                        : p === "instagram"
                        ? "#e1306c"
                        : "#c6f035");
                    return (
                      <div
                        key={net.provider}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#161510] border border-white/5 text-[11px]"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-slate-400 font-bold truncate">
                            {code}
                          </span>
                        </div>
                        <span className="text-white font-bold shrink-0">
                          {net.formattedFollowers || net.followers || (p === "linkedin" ? "500+" : "0")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Header Icons in preview */}
            {localLinks.some((l) => l.display_mode === "header_pill" && l.is_visible !== 0 && l.is_visible !== false) && (
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {localLinks
                  .filter((l) => l.display_mode === "header_pill" && l.is_visible !== 0 && l.is_visible !== false)
                  .slice(0, 5)
                  .map((pill) => {
                    const IconComp = getPlatformIcon(pill.url, pill.platform);
                    return (
                      <div
                        key={pill.id}
                        className="w-7 h-7 rounded-lg bg-[#1a1914] border border-white/5 flex items-center justify-center text-slate-400"
                        title={pill.title}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Destination Links Stack in preview (deduplicating links that are already active in Connected Networks) */}
            <div className="w-full space-y-2.5 pt-2">
              {(() => {
                const previewLinks = localLinks
                  .filter((l) => {
                    if (l.is_visible === 0 || l.is_visible === false) return false;
                    if ((l.display_mode || "link") !== "link") return false;
                    // Deduplicate against connected networks so no duplicate buttons appear
                    return !checkConnectedIntegration(l.url, l.platform);
                  })
                  .slice(0, 4);

                if (previewLinks.length === 0) {
                  return connectedList.length > 0 ? (
                    <div className="w-full py-2.5 px-3 rounded-xl bg-[#161510]/60 border border-white/5 text-[11px] font-mono text-slate-500 text-center">
                      Connected networks active above
                    </div>
                  ) : (
                    <div className="w-full py-2.5 px-3 rounded-xl bg-[#161510]/60 border border-white/5 text-[11px] font-mono text-slate-500 text-center">
                      No custom destination links
                    </div>
                  );
                }

                return previewLinks.map((link) => (
                  <div
                    key={link.id}
                    className="w-full py-3 px-4 rounded-xl bg-[#1a1914] border border-white/5 text-xs font-semibold text-slate-300 text-center hover:border-white/20 transition-colors truncate"
                  >
                    {link.title}
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Footer branding */}
          <div className="pt-6 pb-2 text-[10px] font-mono tracking-widest text-slate-600 uppercase">
            linkhub
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#161510] border border-white/10 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h3 className="text-base font-bold text-white">
                {editingLink ? "Edit Destination" : "Add New Destination"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Open-Source Toolkit"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white placeholder:text-slate-600 focus:border-[#c6f035] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://github.com/..."
                  value={form.url}
                  onChange={handleUrlChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white placeholder:text-slate-600 focus:border-[#c6f035] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none"
                >
                  <option value="General">General Web Link</option>
                  <option value="GitHub">GitHub</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Spotify">Spotify / Podcast</option>
                  <option value="Calendar">Calendar (Cal.com / Calendly)</option>
                  <option value="Newsletter">Newsletter / Substack</option>
                </select>
              </div>

              {matchedConnectedProvider && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-amber-300">
                      {matchedConnectedProvider} is already integrated
                    </div>
                    <p className="text-[11px] text-amber-200/80 leading-relaxed">
                      You already connected {matchedConnectedProvider} in Integrations. Your public profile and live preview automatically display a live rich card with followers/connections. Any manual link here will be deduplicated to avoid duplicates on your live card.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Display Mode</span>
                  <span className="text-[10px] font-mono text-[#c6f035]">Unified Layout</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, display_mode: "link" })}
                    className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                      form.display_mode === "link"
                        ? "bg-[#c6f035]/10 border-[#c6f035] text-white"
                        : "bg-[#11120F] border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#c6f035]" />
                      Link Card
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      Primary destination in link list
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, display_mode: "header_pill" })}
                    className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                      form.display_mode === "header_pill"
                        ? "bg-[#c6f035]/10 border-[#c6f035] text-white"
                        : "bg-[#11120F] border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Tag className="w-3.5 h-3.5 text-[#c6f035]" />
                      Header Icon
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      Quick icon pill under profile bio
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, display_mode: "rich_card" })}
                    className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                      form.display_mode === "rich_card"
                        ? "bg-[#c6f035]/10 border-[#c6f035] text-white"
                        : "bg-[#11120F] border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-[#c6f035]" />
                      Rich Card
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      Live metric / social bento card
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingLink ? "Save Changes" : "Create Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
