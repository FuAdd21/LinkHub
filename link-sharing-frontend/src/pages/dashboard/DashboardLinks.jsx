import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL, getDashboardAuthConfig } from "../../api/dashboardApi";
import { getAvatarUrl, getBannerUrl } from "../../Components/dashboard/dashboardUtils";

export default function DashboardLinks({ userData, links, onRefresh, onUserChange }) {
  const [newLink, setNewLink] = useState({ title: "", url: "", platform: "General" });
  const [loading, setLoading] = useState(false);
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
    } catch (err) {
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
      onRefresh();
      toast.success("Link removed");
    } catch (err) {
      toast.error("Failed to remove link");
    }
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Identity Section (from Image 1) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tight">Profile Identity</h2>
          <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">
            Step 1 of 3
          </span>
        </div>

        <div className="relative group">
          {/* Identity Card */}
          <div className="bg-surface-container-low/30 backdrop-blur-xl border border-outline-variant/10 rounded-[2rem] p-8 space-y-8 overflow-hidden relative">
             {/* Decorative Banner Background */}
             <div className="absolute top-0 left-0 w-full h-32 opacity-40 blur-sm group-hover:opacity-60 transition-opacity overflow-hidden">
                {bannerUrl ? (
                    <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-primary/20 via-tertiary/10 to-transparent" />
                )}
             </div>

             <div className="relative pt-12 flex flex-col items-start gap-8">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-tertiary shadow-2xl relative z-10">
                    <div className="w-full h-full rounded-full border-4 border-[#0b0e14] overflow-hidden bg-surface-dim">
                        {avatarUrl ? (
                            <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/40 bg-surface-container-high">
                                <span className="material-symbols-outlined text-4xl">person</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">Full Name</label>
                        <input
                            readOnly
                            value={userData?.full_name || "Julian Marcus"}
                            className="w-full bg-surface-container-high/50 border border-outline-variant/5 rounded-xl px-5 py-3.5 text-white font-bold text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">Username</label>
                        <input
                            readOnly
                            value={`@${userData?.username || "julianmarcus"}`}
                            className="w-full bg-surface-container-high/50 border border-outline-variant/5 rounded-xl px-5 py-3.5 text-white font-bold text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="w-full space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">Bio</label>
                    <textarea
                        readOnly
                        value={userData?.bio || "Digital curator exploring the intersection of modern hardware and atmospheric software design."}
                        rows={3}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/5 rounded-2xl px-5 py-4 text-slate-300 font-medium text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all resize-none leading-relaxed"
                    />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Your Network Section (from Image 1) */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-white tracking-tight">Your Network</h2>

        <div className="bg-surface-container-low/30 backdrop-blur-xl border border-outline-variant/10 rounded-[2.5rem] p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">Title</label>
                    <input
                        placeholder="My Portfolio"
                        className="w-full bg-surface-container-high border-none rounded-xl px-5 py-3.5 text-on-surface font-bold text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                        value={newLink.title}
                        onChange={(e) => setNewLink(p => ({ ...p, title: e.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">Platform</label>
                    <div className="relative">
                        <select
                            className="w-full bg-surface-container-high border-none rounded-xl px-5 py-3.5 text-on-surface font-bold text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none appearance-none cursor-pointer"
                            value={newLink.platform}
                            onChange={(e) => setNewLink(p => ({ ...p, platform: e.target.value }))}
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
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">URL</label>
                <input
                    placeholder="https://"
                    className="w-full bg-surface-container-high border-none rounded-xl px-5 py-3.5 text-on-surface font-bold text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                    value={newLink.url}
                    onChange={(e) => setNewLink(p => ({ ...p, url: e.target.value }))}
                />
            </div>

            <button
                disabled={loading}
                onClick={handleAddLink}
                className="w-full py-4 flex items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all active:scale-95 group shadow-lg"
            >
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">add</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Add Link</span>
            </button>
        </div>

        {/* Existing Links List */}
        <div className="space-y-4 pt-4">
            {links && links.length > 0 ? (
                links.map((link) => (
                    <div key={link.id} className="group relative flex items-center justify-between p-5 bg-surface-container-high/40 rounded-2xl border border-outline-variant/10 hover:bg-surface-container-high transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">
                                    {link.platform === "General" ? "link" : "alternate_email"}
                                </span>
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider">{link.title}</h4>
                                <p className="text-[11px] text-outline font-medium opacity-60 truncate max-w-[200px]">{link.url}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(link.id)} className="w-10 h-10 flex items-center justify-center text-error-dim hover:text-error transition-colors">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                            <div className="cursor-grab p-2 text-outline">
                                <span className="material-symbols-outlined">drag_indicator</span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-12 flex flex-col items-center justify-center opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-4xl mb-4">link_off</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">No links materialized</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}
