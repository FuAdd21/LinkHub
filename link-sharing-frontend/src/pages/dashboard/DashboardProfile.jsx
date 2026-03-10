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
    if (!file) {
      return;
    }

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
      toast.success("Banner uploaded");
    } catch {
      toast.error("Failed to upload banner");
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
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

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
      toast.success("Avatar uploaded");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  }

  const avatarUrl = avatarPreview || getAvatarUrl(userData);
  const bannerUrl = bannerPreview || resolveBannerUrl(userData?.banner_url);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          My Page
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Shape the identity behind your LinkHub page
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
          Keep your public page polished with a clear username, a concise bio,
          and a profile image that feels instantly recognizable.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <DashboardCard>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Banner image
              </p>
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="group relative flex h-40 w-full items-center justify-center overflow-hidden rounded-[24px] border border-[var(--card-border)] bg-white/5"
              >
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    alt="Profile banner"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(135deg,rgba(147,51,234,0.35),rgba(236,72,153,0.2),rgba(59,130,246,0.2))]" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/25 text-white opacity-0 transition group-hover:opacity-100">
                  {uploadingBanner ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/50 px-3 py-1.5 text-xs">
                      <ImagePlus className="h-4 w-4" />
                      Upload Banner
                    </div>
                  )}
                </div>
              </button>
              <p className="text-xs text-[var(--text-muted)]">
                Recommended size: 1500 x 500.
              </p>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-24 w-24 overflow-hidden rounded-[28px] border border-[var(--card-border)] bg-white/5 shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={
                      userData?.name || userData?.username || "Creator avatar"
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-[var(--text-primary)]">
                    {(userData?.username || userData?.name || "L")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 text-white opacity-0 transition group-hover:bg-slate-950/55 group-hover:opacity-100">
                  {uploadingAvatar ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </div>
              </button>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Profile photo
                </p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
                  Upload a square image for the cleanest dashboard and mobile
                  preview.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div>
                <label className="dashboard-field-label" htmlFor="username">
                  Username
                </label>
                <div className="dashboard-input-shell mt-2">
                  <span className="text-sm text-[var(--text-muted)]">
                    linkhub.com/
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => checkUsername(event.target.value)}
                    placeholder="yourname"
                    className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  />
                  {usernameStatus === "checking" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)]" />
                  ) : null}
                  {usernameStatus === "available" ? (
                    <Check className="h-4 w-4 text-emerald-300" />
                  ) : null}
                </div>
                {usernameStatus === "taken" ? (
                  <p className="mt-2 text-sm text-rose-300">
                    That username is already taken.
                  </p>
                ) : null}
              </div>

              <div className="rounded-[24px] border border-[var(--card-border)] bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Public page
                </p>
                <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                  {username ? `linkhub.com/${username}` : "Choose a username"}
                </p>
                <a
                  href={getPublicProfileUrl(userData?.username || username)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]"
                >
                  <ExternalLink className="h-4 w-4" />
                  View public page
                </a>
              </div>
            </div>

            <div>
              <label className="dashboard-field-label" htmlFor="bio">
                Bio
              </label>
              <div className="dashboard-textarea-shell mt-2">
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Tell visitors what you create and why they should follow along."
                  rows={5}
                  maxLength={160}
                  className="min-h-[140px] w-full resize-none bg-transparent text-sm leading-7 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>
              <p className="mt-2 text-right text-xs text-[var(--text-muted)]">
                {bio.length}/160
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving || usernameStatus === "taken"}
                className="dashboard-primary-button disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save profile"}
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
                className="dashboard-secondary-button"
              >
                Reset changes
              </button>
            </div>
          </form>
        </DashboardCard>

        <DashboardCard className="h-fit">
          <div className="dashboard-accent-icon h-12 w-12">
            <UserCircle2 className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">
            Profile checklist
          </h3>
          <div className="mt-5 space-y-3 text-sm text-[var(--text-muted)]">
            <div className="rounded-[22px] border border-[var(--card-border)] bg-white/5 p-4">
              <p className="font-medium text-[var(--text-primary)]">Avatar</p>
              <p className="mt-1">Use a clean portrait or creator mark.</p>
            </div>
            <div className="rounded-[22px] border border-[var(--card-border)] bg-white/5 p-4">
              <p className="font-medium text-[var(--text-primary)]">Username</p>
              <p className="mt-1">
                Short, memorable, and easy to say out loud.
              </p>
            </div>
            <div className="rounded-[22px] border border-[var(--card-border)] bg-white/5 p-4">
              <p className="font-medium text-[var(--text-primary)]">Bio</p>
              <p className="mt-1">Explain your niche in one clear sentence.</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
