import { Eye, Save } from "lucide-react";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardCard from "../../Components/dashboard/DashboardCard";
import SocialProfileCard, { SocialCardSkeleton } from "../../Components/SocialProfileCard";
import { SOCIAL_PLATFORM_FIELDS } from "../../Components/dashboard/dashboardConfig";
import { API_BASE_URL, getDashboardAuthConfig } from "../../api/dashboardApi";
import { fetchSocialProfiles } from "../../api/socialApi";

function buildForm(userData) {
  return {
    youtubeId: userData?.youtubeId || "",
    githubUser: userData?.githubUser || "",
    telegramUser: userData?.telegramUser || "",
    instagram: userData?.instagram || "",
    twitter: userData?.twitter || "",
    linkedin: userData?.linkedin || "",
    tiktok: userData?.tiktok || "",
  };
}

export default function DashboardSocials({
  userData,
  onRefresh,
  onUserChange,
  socialPreviewData,
  onSocialPreviewChange,
}) {
  const [form, setForm] = useState(() => buildForm(userData));
  const [saving, setSaving] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    setForm(buildForm(userData));
  }, [userData]);

  const connectedPlatforms = SOCIAL_PLATFORM_FIELDS.filter(({ key }) => Boolean(form[key]));

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await axios.put(
        `${API_BASE_URL}/api/users/social-profiles`,
        form,
        getDashboardAuthConfig(),
      );
      onUserChange?.((currentUser) => ({ ...currentUser, ...form }));
      onRefresh?.();
      toast.success("Social accounts saved");
    } catch {
      toast.error("Failed to save social accounts");
    } finally {
      setSaving(false);
    }
  }

  async function handlePreview() {
    setPreviewLoading(true);

    try {
      const result = await fetchSocialProfiles({
        youtubeId: form.youtubeId || null,
        githubUser: form.githubUser || null,
        telegramUser: form.telegramUser || null,
        instagram: form.instagram || null,
        twitter: form.twitter || null,
        linkedin: form.linkedin || null,
        tiktok: form.tiktok || null,
      });
      onSocialPreviewChange?.(result);
    } catch {
      toast.error("Failed to fetch social preview data");
    } finally {
      setPreviewLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">Social Accounts</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Turn plain handles into richer proof and social trust
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
          Connect the platforms your audience already recognizes so your page feels
          more credible and more current at a glance.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DashboardCard>
          <form onSubmit={handleSave} className="space-y-4">
            {SOCIAL_PLATFORM_FIELDS.map((platform) => {
              const Icon = platform.icon;
              const isConnected = Boolean(form[platform.key]);

              return (
                <div
                  key={platform.key}
                  className="flex items-center gap-4 rounded-[24px] border border-[var(--card-border)] bg-white/5 px-4 py-4"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${platform.color}18` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: platform.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className="text-sm font-semibold text-[var(--text-primary)]">
                      {platform.label}
                    </label>
                    <input
                      value={form[platform.key]}
                      onChange={(event) =>
                        setForm((currentForm) => ({
                          ...currentForm,
                          [platform.key]: event.target.value,
                        }))
                      }
                      placeholder={platform.placeholder}
                      className="mt-1 w-full bg-transparent text-sm text-[var(--text-secondary)] outline-none placeholder:text-[var(--text-muted)]"
                    />
                  </div>
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-emerald-400" : "bg-white/15"}`}
                  />
                </div>
              );
            })}

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={saving}
                className="dashboard-primary-button disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Social Accounts"}
              </motion.button>
              <button
                type="button"
                onClick={handlePreview}
                disabled={!connectedPlatforms.length || previewLoading}
                className="dashboard-secondary-button disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Eye className="h-4 w-4" />
                {previewLoading ? "Refreshing preview..." : "Preview social cards"}
              </button>
            </div>
          </form>
        </DashboardCard>

        <DashboardCard className="h-fit">
          <p className="text-sm font-medium text-[var(--text-secondary)]">Preview cards</p>
          <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
            How your social proof will look
          </h3>
          <div className="mt-5 space-y-3">
            {previewLoading ? (
              connectedPlatforms.map((platform) => (
                <SocialCardSkeleton key={platform.key} />
              ))
            ) : connectedPlatforms.length ? (
              connectedPlatforms.map((platform, index) => (
                <SocialProfileCard
                  key={platform.key}
                  platform={platform.socialKey}
                  data={socialPreviewData?.[platform.socialKey]}
                  index={index}
                  showDisconnected={true}
                />
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-[var(--card-border)] px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                Connect at least one platform to preview social cards.
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}



