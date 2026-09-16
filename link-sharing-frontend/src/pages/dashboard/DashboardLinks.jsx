import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { API_BASE_URL, getDashboardAuthConfig } from "../../api/dashboardApi";
import { getAvatarUrl, getBannerUrl } from "../../Components/dashboard/dashboardUtils";

const DND_TYPE = "DASHBOARD_LINK_ITEM";

function DraggableLinkCard({
  link,
  index,
  moveLink,
  commitReorder,
  onDelete,
  onToggleVisibility,
  onUpdateLink,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title || "");
  const [editUrl, setEditUrl] = useState(link.url || "");
  const [isSaving, setIsSaving] = useState(false);

  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_TYPE,
    item: () => ({ id: link.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      commitReorder();
    },
  });

  const [, drop] = useDrop({
    accept: DND_TYPE,
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveLink(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  preview(drop(ref));

  const isVisible = link.is_visible !== 0 && link.is_visible !== false;

  async function handleSaveEdit() {
    if (!editTitle.trim() || !editUrl.trim()) {
      toast.error("Title and URL cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      await onUpdateLink(link.id, {
        title: editTitle.trim(),
        url: editUrl.trim(),
        platform: link.platform || "General",
      });
      setIsEditing(false);
      toast.success("Link updated");
    } catch {
      toast.error("Failed to update link");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.35 : 1 }}
      className={`group relative p-5 bg-surface-container-high/40 rounded-2xl border transition-all ${
        !isVisible
          ? "border-outline-variant/5 opacity-60 bg-surface-container-high/20"
          : "border-outline-variant/10 hover:bg-surface-container-high hover:border-outline-variant/20"
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              Editing Link
            </span>
            <button
              onClick={() => {
                setEditTitle(link.title || "");
                setEditUrl(link.url || "");
                setIsEditing(false);
              }}
              className="text-xs text-outline hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl px-4 py-2.5 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
            <input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl px-4 py-2.5 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              disabled={isSaving}
              onClick={handleSaveEdit}
              className="px-4 py-2 rounded-xl bg-primary text-black font-bold text-xs hover:bg-primary-hover transition-colors"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-surface-container-highest flex items-center justify-center text-white">
              <span className="material-symbols-outlined">
                {link.platform === "General" ? "link" : "alternate_email"}
              </span>
            </div>
            <div className="text-left min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider truncate">
                  {link.title}
                </h4>
                {!isVisible && (
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-outline tracking-wider">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-[11px] text-outline font-medium opacity-60 truncate">
                {link.url}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            {/* Visibility Toggle */}
            <button
              onClick={() => onToggleVisibility(link.id)}
              title={isVisible ? "Hide link on profile" : "Show link on profile"}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isVisible
                  ? "text-outline hover:text-white hover:bg-white/5"
                  : "text-amber-400/80 hover:text-amber-300 hover:bg-amber-400/10"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isVisible ? "visibility" : "visibility_off"}
              </span>
            </button>

            {/* Inline Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              title="Edit link"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-outline hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(link.id)}
              title="Remove link"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-error-dim hover:text-error hover:bg-error/10 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>

            {/* Drag Handle */}
            <div
              ref={drag}
              title="Drag to reorder"
              className="w-9 h-9 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing text-outline hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">drag_indicator</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLinks({
  userData,
  links = [],
  onRefresh,
  onUserChange,
  onLinksChange,
}) {
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    platform: "General",
  });
  const [loading, setLoading] = useState(false);
  const [localLinks, setLocalLinks] = useState(links);

  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  const avatarUrl = getAvatarUrl(userData);
  const bannerUrl = getBannerUrl(userData);

  async function handleAddLink(e) {
    if (e) e.preventDefault();
    if (!newLink.title || !newLink.url) {
      toast.error("Title and URL required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/mylinks`,
        newLink,
        getDashboardAuthConfig()
      );
      onRefresh();
      setNewLink({ title: "", url: "", platform: "General" });
      toast.success("Link added to your network");
    } catch {
      toast.error("Failed to add link");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/mylinks/${id}`,
        getDashboardAuthConfig()
      );
      setLocalLinks((prev) => prev.filter((l) => l.id !== id));
      onRefresh();
      toast.success("Link removed");
    } catch {
      toast.error("Failed to remove link");
    }
  }

  async function handleToggleVisibility(id) {
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/mylinks/${id}/visibility`,
        {},
        getDashboardAuthConfig()
      );
      const isVisibleNow = data.link?.is_visible !== 0 && data.link?.is_visible !== false;
      setLocalLinks((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, is_visible: data.link?.is_visible } : l
        )
      );
      onRefresh();
      toast.success(isVisibleNow ? "Link is now visible" : "Link is now hidden");
    } catch {
      toast.error("Failed to update link visibility");
    }
  }

  async function handleUpdateLink(id, updateData) {
    await axios.put(
      `${API_BASE_URL}/api/mylinks/${id}`,
      updateData,
      getDashboardAuthConfig()
    );
    setLocalLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updateData } : l))
    );
    onRefresh();
  }

  const moveLink = (dragIndex, hoverIndex) => {
    setLocalLinks((prev) => {
      const updated = [...prev];
      const [dragged] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, dragged);
      return updated;
    });
  };

  const commitReorder = async () => {
    try {
      const order = localLinks.map((l) => l.id);
      await axios.put(
        `${API_BASE_URL}/api/mylinks/order`,
        { order },
        getDashboardAuthConfig()
      );
      onLinksChange?.(localLinks);
      toast.success("Link order updated");
    } catch {
      toast.error("Failed to save link order");
      onRefresh?.();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Profile Identity Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Profile Identity
            </h2>
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">
              {localLinks?.length ?? 0} {localLinks?.length === 1 ? "Link" : "Links"} Active
            </span>
          </div>

          <div className="relative group">
            <div className="bg-surface-container-low/30 backdrop-blur-xl border border-outline-variant/10 rounded-[2rem] p-8 space-y-8 overflow-hidden relative">
              {/* Decorative Banner Background */}
              <div className="absolute top-0 left-0 w-full h-32 opacity-40 blur-sm group-hover:opacity-60 transition-opacity overflow-hidden">
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    className="w-full h-full object-cover"
                    alt="Banner"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-primary/20 via-tertiary/10 to-transparent" />
                )}
              </div>

              <div className="relative pt-12 flex flex-col items-start gap-8">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-tertiary shadow-2xl relative z-10">
                  <div className="w-full h-full rounded-full border-4 border-[#0b0e14] overflow-hidden bg-surface-dim">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        className="w-full h-full object-cover"
                        alt="Avatar"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/40 bg-surface-container-high">
                        <span className="material-symbols-outlined text-4xl">
                          person
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">
                      Full Name
                    </label>
                    <input
                      readOnly
                      value={userData?.full_name || userData?.name || ""}
                      placeholder="Set your name in Profile"
                      className="w-full bg-surface-container-high/50 border border-outline-variant/5 rounded-xl px-5 py-3.5 text-white font-bold text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-outline/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">
                      Username
                    </label>
                    <input
                      readOnly
                      value={userData?.username ? `@${userData.username}` : ""}
                      placeholder="@username"
                      className="w-full bg-surface-container-high/50 border border-outline-variant/5 rounded-xl px-5 py-3.5 text-white font-bold text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-outline/40"
                    />
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">
                    Bio
                  </label>
                  <textarea
                    readOnly
                    value={userData?.bio || ""}
                    placeholder="No bio configured yet. Customize your bio in the Profile tab."
                    rows={3}
                    className="w-full bg-surface-container-high/50 border border-outline-variant/5 rounded-2xl px-5 py-4 text-slate-300 font-medium text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all resize-none leading-relaxed placeholder:text-outline/40"
                  />
                </div>

                <div className="w-full flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-xs text-outline font-medium">
                    Need to change your name, avatar, or bio?
                  </span>
                  <Link
                    to="/dashboard/profile"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Edit Profile{" "}
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Network Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Your Network
          </h2>

          <div className="bg-surface-container-low/30 backdrop-blur-xl border border-outline-variant/10 rounded-[2.5rem] p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">
                  Title
                </label>
                <input
                  placeholder="My Portfolio"
                  className="w-full bg-surface-container-high border-none rounded-xl px-5 py-3.5 text-on-surface font-bold text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">
                  Platform
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-surface-container-high border-none rounded-xl px-5 py-3.5 text-on-surface font-bold text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none appearance-none cursor-pointer"
                    value={newLink.platform}
                    onChange={(e) =>
                      setNewLink((p) => ({ ...p, platform: e.target.value }))
                    }
                  >
                    <option value="General">General</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="GitHub">GitHub</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-lg">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">
                URL
              </label>
              <input
                placeholder="https://"
                className="w-full bg-surface-container-high border-none rounded-xl px-5 py-3.5 text-on-surface font-bold text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                value={newLink.url}
                onChange={(e) =>
                  setNewLink((p) => ({ ...p, url: e.target.value }))
                }
              />
            </div>

            <button
              disabled={loading}
              onClick={handleAddLink}
              className="w-full py-4 flex items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all active:scale-95 group shadow-lg"
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                add
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                {loading ? "Adding Link..." : "Add Link"}
              </span>
            </button>
          </div>

          {/* Existing Links List */}
          <div className="space-y-4 pt-4">
            {localLinks && localLinks.length > 0 ? (
              localLinks.map((link, index) => (
                <DraggableLinkCard
                  key={link.id}
                  link={link}
                  index={index}
                  moveLink={moveLink}
                  commitReorder={commitReorder}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                  onUpdateLink={handleUpdateLink}
                />
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-4xl mb-4">
                  link_off
                </span>
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No links materialized
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </DndProvider>
  );
}
