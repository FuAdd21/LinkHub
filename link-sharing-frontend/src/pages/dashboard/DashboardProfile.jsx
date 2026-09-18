import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/config";
import { getAvatarUrl, getBannerUrl } from "../../Components/dashboard/dashboardUtils";

export default function DashboardProfile({ userData, onRefresh, onUserChange }) {
  const [formData, setFormData] = useState({
    full_name: userData?.full_name || "",
    username: userData?.username || "",
    bio: userData?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    setFormData({
      full_name: userData?.full_name || "",
      username: userData?.username || "",
      bio: userData?.bio || "",
    });
  }, [userData]);

  async function handleUpdate(e) {
    if (e) e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Saving changes...");
    try {
      const { data } = await api.put("/api/profile", formData);
      if (onUserChange && data.user) onUserChange(data.user);
      if (onRefresh) onRefresh();
      toast.success("Profile materialized successfully", { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.error || "Profile sync error", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(e, type) {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append(type, file);

    const loadingToast = toast.loading(`Uploading ${type}...`);
    try {
      const response = await api.put(`/api/users/${type}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (onUserChange && response.data.user) onUserChange(response.data.user);
      if (onRefresh) onRefresh();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded`, { id: loadingToast });
    } catch (err) {
      toast.error(`Upload failed`, { id: loadingToast });
    }
  }

  const avatarUrl = getAvatarUrl(userData);
  const bannerUrl = getBannerUrl(userData);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Profile Management</h1>
        <p className="text-on-surface-variant font-medium">Customize how your public profile looks to the world.</p>
      </div>

      <div className="space-y-10">
        {/* Banner Section */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-1">Banner Image</label>
          <div 
            className="w-full h-48 rounded-[2rem] bg-surface-container-high/40 border border-outline-variant/10 overflow-hidden relative group cursor-pointer"
            onClick={() => bannerInputRef.current?.click()}
          >
            {bannerUrl ? (
              <img src={bannerUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Banner" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-surface-container-highest to-surface-dim" />
            )}
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-surface-container-lowest/80 backdrop-blur-md px-6 py-3 rounded-xl flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl border border-white/10 active:scale-95 transition-transform">
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
                    className="w-40 h-40 rounded-full border-4 border-primary ring-offset-4 ring-offset-[#0b0e14] ring-4 ring-primary/20 overflow-hidden bg-surface-container-high cursor-pointer shadow-2xl"
                    onClick={() => avatarInputRef.current?.click()}
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/40 text-4xl font-black">
                            {userData?.full_name?.charAt(0) || userData?.username?.charAt(0) || "U"}
                        </div>
                    )}
                </div>
                <button 
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-1 right-2 w-10 h-10 bg-primary text-on-primary rounded-full border-4 border-[#0b0e14] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
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
                        value={formData.full_name}
                        onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
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
                            onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
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
                onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value.slice(0, 200) }))}
                placeholder="Digital curator and visual storyteller. Exploring the intersection of tech and human emotion."
            />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-6">
            <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-10 py-4 bg-primary text-on-primary font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase tracking-widest disabled:opacity-50"
            >
                {loading ? "Synchronizing..." : "Save Changes"}
            </button>
            <button
                className="px-10 py-4 bg-surface-container-highest/50 text-white font-black rounded-2xl hover:bg-surface-container-highest transition-all text-[11px] uppercase tracking-widest active:scale-95"
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
}
