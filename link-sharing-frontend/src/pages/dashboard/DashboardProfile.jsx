import {
  ImagePlus,
  Camera,
  Check,
  ExternalLink,
  Loader2,
  Save,
  UserCircle2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardCard from "../../Components/dashboard/DashboardCard";
import { API_BASE_URL, getDashboardAuthConfig } from "../../api/dashboardApi";
import {
  getAvatarUrl,
  getPublicProfileUrl,
} from "../../Components/dashboard/dashboardUtils";

export default function DashboardProfile({
  userData,
  onRefresh,
  onUserChange,
}) {
  const resolveBannerUrl = (value) => {
    if (!value) return null;
    if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
      return value;
    }
    return `${API_BASE_URL}${value.startsWith("/") ? value : `/${value}`}`;
  };

  const [username, setUsername] = useState(userData?.username || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setBio(userData.bio || "");
      setAvatarPreview(null);
      setBannerPreview(null);
    }
  }, [userData]);

  async function handleBannerUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("banner", file);
    const authConfig = getDashboardAuthConfig();
    setUploadingBanner(true);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/users/banner`,
        formData,
        {
          ...authConfig,
          headers: {
            ...authConfig.headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      onUserChange?.((currentUser) => ({
        ...currentUser,
        banner_url: response.data.banner_url,
      }));
      onRefresh?.();
      toast.success("Architectural banner updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Banner sync failed");
    } finally {
      setUploadingBanner(false);
    }
  }

  async function checkUsername(value) {
    const cleanedValue = value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    setUsername(cleanedValue);

    if (cleanedValue.length < 3) {
      setUsernameStatus(null);
      return;
    }

    if (cleanedValue === userData?.username) {
      setUsernameStatus("available");
      return;
    }

    setUsernameStatus("checking");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/profile/check/${cleanedValue}`,
      );
      setUsernameStatus(response.data.available ? "available" : "taken");
    } catch {
      setUsernameStatus(null);
    }
  }

  async function handleSaveProfile(event) {
    event.preventDefault();
    setSaving(true);

    try {
      if (username && username !== userData?.username) {
        await axios.put(
          `${API_BASE_URL}/api/profile/username`,
          { username },
          getDashboardAuthConfig(),
        );
      }

      await axios.put(
        `${API_BASE_URL}/api/profile`,
        { bio },
        getDashboardAuthConfig(),
      );

      onUserChange?.({
        ...userData,
        username,
        bio,
      });
      onRefresh?.();
      toast.success("Profile parameters successfully synthesized");
    } catch (error) {
      toast.error(error.response?.data?.message || "Synthesis failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("avatar", file);
    const authConfig = getDashboardAuthConfig();
    setUploadingAvatar(true);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/users/avatar`,
        formData,
        {
          ...authConfig,
          headers: {
            ...authConfig.headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      onUserChange?.((currentUser) => ({
        ...currentUser,
        avatar: response.data.avatar,
      }));
      onRefresh?.();
      toast.success("Identity visual updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Avatar upload failed");
    } finally {
      setUploadingAvatar(false);
    }
  }

  const avatarUrl = avatarPreview || getAvatarUrl(userData);
  const bannerUrl = bannerPreview || resolveBannerUrl(userData?.banner_url);

  return (
    <div className="space-y-10 pb-12">
      <div className="max-w-2xl">
         <div className="flex items-center gap-2 mb-3">
              <UserCircle2 className="h-4 w-4 text-[var(--saas-accent-primary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-accent-primary)]">Identity Core</span>
          </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--saas-text-primary)] sm:text-4xl">
          Shape the identity behind your digital estate
        </h1>
        <p className="mt-4 text-[15px] font-medium leading-relaxed text-[var(--saas-text-secondary)]">
          Manage your public presence, experimental bio, and visual recognition parameters.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <DashboardCard className="p-0 overflow-hidden">
          <form onSubmit={handleSaveProfile}>
            {/* Banner Section */}
            <div className="relative group/banner border-b border-[var(--saas-border)]">
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-[var(--saas-bg-surface)] transition-all"
              >
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    alt="Profile banner"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/banner:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-[var(--saas-bg-elevated)] flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-[var(--saas-text-secondary)]/20" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 transition group-hover/banner:opacity-100">
                  {uploadingBanner ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    <div className="flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 text-xs font-black text-white uppercase tracking-widest shadow-xl">
                      <ImagePlus className="h-4 w-4" />
                      Swap Banner
                    </div>
                  )}
                </div>
              </button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
            </div>

            <div className="px-8 pb-10">
              {/* Avatar & Basic Info */}
              <div className="relative -mt-14 mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-end">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group/avatar relative h-32 w-32 shrink-0 overflow-hidden rounded-[42px] border-4 border-[var(--saas-card)] bg-[var(--saas-bg-elevated)] shadow-2xl"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userData?.username || "Creator"}
                      className="h-full w-full object-cover transition-transform group-hover/avatar:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-black text-[var(--saas-text-primary)]">
                      {(userData?.username || "L").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover/avatar:opacity-100">
                    {uploadingAvatar ? (
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    ) : (
                      <Camera className="h-6 w-6 text-white" />
                    )}
                  </div>
                </button>
                <div className="pb-2">
                  <h3 className="text-xl font-black text-[var(--saas-text-primary)] tracking-tight">
                    {userData?.name || userData?.username || "Incognito Creator"}
                  </h3>
                  <p className="text-sm font-bold text-[var(--saas-accent-primary)] mt-1">
                    @{userData?.username || "unregistered"}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div className="grid gap-8">
                <div className="grid gap-8 lg:grid-cols-2">
                   <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] ml-1" htmlFor="username">
                      Discovery ID
                    </label>
                    <div className="group relative">
                       <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                           <span className="text-[14px] font-bold text-[var(--saas-text-secondary)]/40">linkhub.me/</span>
                       </div>
                       <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) => checkUsername(event.target.value)}
                        placeholder="yourname"
                        className="w-full bg-[var(--saas-bg-elevated)]/50 rounded-2xl border border-[var(--saas-border)] pl-[104px] pr-12 py-4 text-[15px] font-bold text-[var(--saas-text-primary)] outline-none hover:border-[var(--saas-border-hover)] focus:border-[var(--saas-accent-primary)]/50 transition-all"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center">
                        {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-[var(--saas-accent-primary)]" />}
                        {usernameStatus === "available" && <div className="h-6 px-2 rounded-lg bg-emerald-500/10 flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /><span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Valid</span></div>}
                        {usernameStatus === "taken" && <div className="h-6 px-2 rounded-lg bg-rose-500/10 flex items-center gap-1.5"><X className="h-3.5 w-3.5 text-rose-400" /><span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Reserved</span></div>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] ml-1">
                      Direct Linkage
                    </label>
                    <div className="flex h-[58px] items-center justify-between gap-4 rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] px-5">
                       <p className="truncate text-sm font-bold text-[var(--saas-text-primary)]">
                        linkhub.me/{userData?.username || username}
                      </p>
                      <a
                        href={getPublicProfileUrl(userData?.username || username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--saas-bg-elevated)] text-[var(--saas-text-secondary)] hover:text-[var(--saas-accent-primary)] transition-all"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] ml-1" htmlFor="bio">
                    Strategic Bio
                  </label>
                  <div className="relative group">
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      placeholder="Synthesize your mission in a few high-impact words."
                      rows={5}
                      maxLength={160}
                      className="w-full min-h-[160px] resize-none bg-[var(--saas-bg-elevated)]/50 rounded-3xl border border-[var(--saas-border)] p-6 text-[15px] font-bold leading-relaxed text-[var(--saas-text-primary)] outline-none hover:border-[var(--saas-border-hover)] focus:border-[var(--saas-accent-primary)]/50 transition-all placeholder:text-[var(--saas-text-secondary)]/40"
                    />
                    <div className="absolute bottom-5 right-5 h-8 px-3 rounded-lg bg-[var(--saas-bg-surface)] flex items-center text-[10px] font-black text-[var(--saas-text-secondary)] border border-[var(--saas-border)]">
                      {bio.length}/160
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving || usernameStatus === "taken"}
                    className="flex h-14 items-center gap-3 rounded-2xl bg-[var(--saas-accent-gradient)] px-10 text-[15px] font-black text-white transition-all hover:scale-[1.03] shadow-lg shadow-[var(--saas-accent-glow)]/20 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {saving ? "Synthesizing..." : "Synchronize Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername(userData?.username || "");
                      setBio(userData?.bio || "");
                      setUsernameStatus(null);
                      setAvatarPreview(null);
                      setBannerPreview(null);
                    }}
                    className="flex h-14 items-center gap-2 rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] px-8 text-[15px] font-bold text-[var(--saas-text-primary)] hover:bg-[var(--saas-bg-elevated)] transition-all"
                  >
                    Reset Constants
                  </button>
                </div>
              </div>
            </div>
          </form>
        </DashboardCard>

        <div className="space-y-6">
            <DashboardCard className="p-8">
               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--saas-accent-primary)]/10 text-[var(--saas-accent-primary)] mb-6">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-2">
                  Optimization Check
              </p>
              <h3 className="text-xl font-extrabold text-[var(--saas-text-primary)] tracking-tight">
                  Identity Checklist
              </h3>
              <div className="mt-8 space-y-4">
                {[
                  { label: "Avatar Visual", desc: "Instantly recognizable creator mark." },
                  { label: "Searchable ID", desc: "Short, verbalizable, and memorable." },
                  { label: "Engaging Bio", desc: "Explain the mission in one sentence." }
                ].map((item, i) => (
                  <div key={i} className="group p-4 rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 hover:bg-[var(--saas-bg-elevated)]/50 transition-all">
                    <p className="text-[13px] font-black text-[var(--saas-text-primary)]">{item.label}</p>
                    <p className="mt-1 text-[11px] font-semibold text-[var(--saas-text-secondary)]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </DashboardCard>
            
            <div className="rounded-[32px] overflow-hidden bg-[var(--saas-bg-surface)] border border-[var(--saas-border)] p-8 relative group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--saas-bg-elevated)] text-[var(--saas-accent-primary)] mb-6 ring-1 ring-[var(--saas-border)] group-hover:bg-[var(--saas-accent-primary)] group-hover:text-white transition-all duration-500">
                    <Flame className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-black text-[var(--saas-text-primary)] tracking-tight">Pro Velocity</h4>
                <p className="mt-2 text-xs font-bold text-[var(--saas-text-secondary)] leading-relaxed">Verified creators see 14% higher click-through on average.</p>
                
                {/* Visual accent */}
                <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-[var(--saas-accent-primary)] opacity-[0.05] blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
        </div>
      </div>
    </div>
  );
}
