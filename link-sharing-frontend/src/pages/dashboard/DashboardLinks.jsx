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
} from "lucide-react";
import { api } from "../../api/config";
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
  onRefresh,
  onUserChange,
  onLinksChange,
}) {
  const [localLinks, setLocalLinks] = useState(links);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [form, setForm] = useState({ title: "", url: "", platform: "General" });
  const [saving, setSaving] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState(null);

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
      await api.put("/api/mylinks/order", { order });
      onLinksChange?.(localLinks);
      toast.success("Link order updated");
    } catch {
      toast.error("Failed to save link order");
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
      await api.put(`/api/mylinks/${link.id}/visibility`, { is_visible: nextVal });
      onLinksChange?.(updated);
      toast.success(nextVal ? "Link is now visible" : "Link is hidden");
    } catch {
      toast.error("Failed to update link visibility");
      onRefresh?.();
    }
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingLink(null);
    setForm({ title: "", url: "", platform: "General" });
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (link) => {
    setEditingLink(link);
    setForm({
      title: link.title || "",
      url: link.url || "",
      platform: link.platform || "General",
    });
    setModalOpen(true);
  };

  // Save Link (Create or Edit)
  const handleSaveLink = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      toast.error("Title and URL are required");
      return;
    }

    let normalizedUrl = form.url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    setSaving(true);
    try {
      if (editingLink) {
        const res = await api.put(`/api/mylinks/${editingLink.id}`, {
          title: form.title.trim(),
          url: normalizedUrl,
          platform: form.platform,
        });
        const updated = localLinks.map((l) =>
          l.id === editingLink.id ? { ...l, ...res.data } : l
        );
        setLocalLinks(updated);
        onLinksChange?.(updated);
        toast.success("Link updated");
      } else {
        const res = await api.post("/api/mylinks", {
          title: form.title.trim(),
          url: normalizedUrl,
          platform: form.platform,
        });
        const updated = [res.data, ...localLinks];
        setLocalLinks(updated);
        onLinksChange?.(updated);
        toast.success("Link published");
      }
      setModalOpen(false);
      onRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save link");
    } finally {
      setSaving(false);
    }
  };

  // Delete Link
  const handleDeleteLink = async (linkId) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await api.delete(`/api/mylinks/${linkId}`);
      const updated = localLinks.filter((l) => l.id !== linkId);
      setLocalLinks(updated);
      onLinksChange?.(updated);
      toast.success("Link removed");
      onRefresh?.();
    } catch {
      toast.error("Failed to delete link");
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

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-12">
      {/* Center Column: Links Editor */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header Section */}
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">
            Build and organize your public destinations.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Your links
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Drag to reorder. Changes publish instantly.
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
        </div>

        {/* Status Notification Banner */}
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#13120D] border border-white/5 text-xs text-slate-300">
          <span className="w-5 h-5 rounded-md bg-[#c6f035]/15 text-[#c6f035] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-white">All changes published</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Your public profile is up to date.</span>
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
              const IconComponent = getPlatformIcon(link.url, link.platform);
              const isVisible = link.is_visible !== 0 && link.is_visible !== false;
              const cleanUrl = (link.url || "").replace(/^https?:\/\//i, "");

              return (
                <div
                  key={link.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-200 ${
                    draggingIdx === index
                      ? "opacity-40 bg-[#1f1d16] border-[#c6f035]/40"
                      : isVisible
                      ? "bg-[#13120D] border-white/5 hover:border-white/10 hover:bg-[#161510]"
                      : "bg-[#13120D]/60 border-white/5 opacity-60"
                  }`}
                >
                  {/* Drag Handle */}
                  <button
                    type="button"
                    className="text-slate-600 hover:text-slate-300 cursor-grab active:cursor-grabbing p-1 transition-colors"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>

                  {/* Icon Box */}
                  <div className="w-10 h-10 rounded-lg bg-[#1a1914] border border-white/5 flex items-center justify-center text-slate-300 shrink-0">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Title & URL */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-[#c6f035] transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-xs font-mono text-slate-500 truncate mt-0.5">
                      {cleanUrl}
                    </p>
                  </div>

                  {/* Stats (Clicks & Conversion) */}
                  <div className="hidden sm:flex items-center gap-6 font-mono text-xs shrink-0 px-2">
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-500 tracking-wider mr-2">
                        Clicks
                      </span>
                      <span className="text-slate-300 font-bold">
                        {(Number(link.clicks) || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-500 tracking-wider mr-2">
                        Conv.
                      </span>
                      <span className="text-slate-300 font-bold">
                        {link.conversionRate || "0.0%"}
                      </span>
                    </div>
                  </div>

                  {/* Luminous Switch Toggle */}
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

                  {/* Three Dots Menu */}
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
                        className="absolute right-0 top-10 w-44 rounded-xl bg-[#1a1914] border border-white/10 shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150"
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
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Profile Preview (Desktop View matching image copy.png) */}
      <div className="w-full xl:w-[380px] shrink-0 space-y-4">
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
                {userData?.name || "Maya Kim"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {userData?.bio || "Creator · Developer"}
              </p>
            </div>

            {/* Links Stack in preview */}
            <div className="w-full space-y-2.5 pt-4">
              {localLinks
                .filter((l) => l.is_visible !== 0 && l.is_visible !== false)
                .slice(0, 4)
                .map((link) => (
                  <div
                    key={link.id}
                    className="w-full py-3 px-4 rounded-xl bg-[#1a1914] border border-white/5 text-xs font-semibold text-slate-300 text-center hover:border-white/20 transition-colors truncate"
                  >
                    {link.title}
                  </div>
                ))}
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
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
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
