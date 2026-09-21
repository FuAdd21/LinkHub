import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/config";
import { invalidateDashboardSnapshot } from "../../api/dashboardApi";
import { getAvatarUrl, getBannerUrl } from "../../Components/dashboard/dashboardUtils";

export default function DashboardProfile({ userData, onRefresh, onUserChange }) {
  const [formData, setFormData] = useState({
    name: userData?.name || userData?.full_name || "",
    username: userData?.username || "",
    bio: userData?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    setFormData({
      name: userData?.name || userData?.full_name || "",
      username: userData?.username || "",
      bio: userData?.bio || "",
    });
    setAvatarError(false);
    setBannerError(false);
  }, [userData]);

  async function handleUpdate(e) {
    if (e) e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Saving changes...");
    try {
      const payload = {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
      };

      const { data } = await api.put("/api/profile", payload);
      invalidateDashboardSnapshot();

      // If username changed, update username endpoint
      const currentUsername = (userData?.username || "").toLowerCase().trim();
      const nextUsername = formData.username.toLowerCase().trim();
      if (nextUsername && nextUsername !== currentUsername) {
        try {
          await api.put("/api/profile/username", { username: nextUsername });
          if (data.user) {
            data.user.username = nextUsername;
          }
        } catch (uErr) {
          toast.error(uErr.response?.data?.message || "Could not update username", { id: loadingToast });
          setLoading(false);
          return;
        }
      }

      if (onUserChange && data.user) onUserChange(data.user);
      if (onRefresh) onRefresh();
      toast.success("Profile materialized successfully", { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Profile sync error", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(e, type) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview for immediate visual feedback
    const objectUrl = URL.createObjectURL(file);
    if (type === "avatar") {
      setAvatarPreview(objectUrl);
      setAvatarError(false);
    } else {
      setBannerPreview(objectUrl);
      setBannerError(false);
    }

    const data = new FormData();
    data.append(type, file);

    const loadingToast = toast.loading(`Uploading ${type}...`);
    try {
      const response = await api.put(`/api/users/${type}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      invalidateDashboardSnapshot();

      if (response.data.user) {
        if (onUserChange) onUserChange(response.data.user);
      } else if (response.data.avatar) {
        if (onUserChange) onUserChange((prev) => ({ ...prev, avatar: response.data.avatar }));
      } else if (response.data.banner_url) {
        if (onUserChange) onUserChange((prev) => ({ ...prev, banner_url: response.data.banner_url }));
      }

      if (onRefresh) onRefresh();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`, { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || `Upload failed`, { id: loadingToast });
    }
  }

  const avatarUrl = avatarPreview || getAvatarUrl(userData);
  const bannerUrl = bannerPreview || getBannerUrl(userData);
  const initials = (formData.name || userData?.username || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customize how your public bio, avatar, and banner imagery appear to visitors.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Banner Section */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-1">Banner Image</label>
          <div 
            className="w-full h-48 rounded-[2rem] bg-surface-container-high/40 border border-outline-variant/10 overflow-hidden relative group cursor-pointer"
            onClick={() => bannerInputRef.current?.click()}
          >
            {bannerUrl && !bannerError ? (
              <img
                src={bannerUrl}
                onError={() => setBannerError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Banner"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-surface-container-highest to-surface-dim" />
            )}
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="bg-surface-container-lowest/80 backdrop-blur-md px-6 py-3 rounded-xl flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl border border-white/10 active:scale-95 transition-transform"
                >
                    <span className="material-symbols-outlined text-lg">upload_file</span>
                    Replace Banner
                </button>
            </div>
          </div>
          <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "banner")} />
        </div>

        {/* Profile Details Section */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="relative group shrink-0">
                <div 
                    className="w-40 h-40 rounded-full border-4 border-primary ring-offset-4 ring-offset-[#0b0e14] ring-4 ring-primary/20 overflow-hidden bg-[#161a16] cursor-pointer shadow-2xl flex items-center justify-center"
                    onClick={() => avatarInputRef.current?.click()}
                >
                    {avatarUrl && !avatarError ? (
                        <img
                          src={avatarUrl}
                          onError={() => setAvatarError(true)}
                          className="w-full h-full object-cover"
                          alt="Avatar"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary font-black text-4xl select-none">
                            {initials}
                        </div>
                    )}
                </div>
                <button 
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-1 right-2 w-10 h-10 bg-primary text-on-primary rounded-full border-4 border-[#0b0e14] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                    aria-label="Upload profile photo"
                >
                    <span className="material-symbols-outlined text-xl">edit</span>
                </button>
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "avatar")} />
            </div>

            <div className="flex-1 w-full space-y-6">
                <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">Display Name</label>
                    <input
                        className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4.5 text-on-surface font-bold text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Alex Rivera"
                    />
                </div>
                <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">Handle</label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-outline font-bold text-sm">@</span>
                        <input
                            className="w-full bg-surface-container-high border-none rounded-xl pl-10 pr-5 py-4.5 text-on-surface font-bold text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                            value={formData.username}
                            onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                            placeholder="arivera_studio"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-2 text-left">
            <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Bio</label>
                <span className="text-[10px] font-bold text-outline opacity-40">{formData.bio.length} / 200</span>
            </div>
            <textarea
                className="w-full bg-surface-container-high border-none rounded-2xl px-5 py-5 text-on-surface font-medium text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none resize-none leading-relaxed"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value.slice(0, 200) }))}
                placeholder="Digital curator and visual storyteller. Exploring the intersection of tech and human emotion."
            />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-6">
            <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className="px-10 py-4 bg-primary text-on-primary font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase tracking-widest disabled:opacity-50"
            >
                {loading ? "Synchronizing..." : "Save Changes"}
            </button>
            <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: userData?.name || userData?.full_name || "",
                    username: userData?.username || "",
                    bio: userData?.bio || "",
                  });
                  setAvatarPreview(null);
                  setBannerPreview(null);
                  setAvatarError(false);
                  setBannerError(false);
                }}
                className="px-10 py-4 bg-surface-container-highest/50 text-white font-black rounded-2xl hover:bg-surface-container-highest transition-all text-[11px] uppercase tracking-widest active:scale-95"
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
}
