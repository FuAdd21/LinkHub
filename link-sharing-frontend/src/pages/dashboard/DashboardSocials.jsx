import { Eye, Save, Share2, Loader2, Zap, Users } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardCard from "../../Components/dashboard/DashboardCard";
import SocialProfileCard, {
  SocialCardSkeleton,
} from "../../Components/SocialProfileCard";
import { SOCIAL_PLATFORM_FIELDS } from "../../Components/dashboard/dashboardConfig";
import { API_BASE_URL, getDashboardAuthConfig } from "../../api/dashboardApi";
import { fetchSocialProfiles } from "../../api/socialApi";
import { cx } from "../../Components/dashboard/dashboardUtils";

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

  const connectedPlatforms = SOCIAL_PLATFORM_FIELDS.filter(({ key }) =>
    Boolean(form[key]),
  );

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
      toast.success("Social infrastructure synchronized");
    } catch {
      toast.error("Failed to sync social parameters");
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
      toast.success("Social proof materialized");
    } catch {
      toast.error("Resource acquisition: Preview data failed");
    } finally {
      setPreviewLoading(false);
    }
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="max-w-2xl">
         <div className="flex items-center gap-2 mb-3">
              <Share2 className="h-4 w-4 text-[var(--saas-accent-primary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-accent-primary)]">Amplification Layer</span>
          </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--saas-text-primary)] sm:text-4xl">
          Turn plain handles into atmospheric social proof
        </h1>
        <p className="mt-4 text-[15px] font-medium leading-relaxed text-[var(--saas-text-secondary)]">
          Connect your ecosystem. Materializing your audience across platforms builds instant recognition and trust.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <DashboardCard className="p-8">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4">
              {SOCIAL_PLATFORM_FIELDS.map((platform) => {
                const Icon = platform.icon;
                const isConnected = Boolean(form[platform.key]);

                return (
                  <div
                    key={platform.key}
                    className="group relative flex items-center gap-5 rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 px-5 py-4 transition-all hover:border-[var(--saas-accent-primary)]/30 hover:bg-[var(--saas-bg-elevated)]/50"
                  >
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner"
                      style={{ 
                        backgroundColor: `${platform.color}15`,
                        border: `1px solid ${platform.color}20`
                      }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color: platform.color }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="text-[11px] font-black uppercase tracking-widest text-[var(--saas-text-secondary)]">
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
                        className="mt-1 w-full bg-transparent text-[15px] font-bold text-[var(--saas-text-primary)] outline-none placeholder:text-[var(--saas-text-secondary)]/30"
                      />
                    </div>
                    <div
                      className={cx(
                        "h-2 w-2 rounded-full transition-all duration-500",
                        isConnected 
                          ? "bg-[var(--saas-accent-primary)] shadow-[0_0_8px_var(--saas-accent-glow)] scale-110" 
                          : "bg-[var(--saas-border)] scale-100"
                      )}
                    />
                    
                    {/* Hover indicator */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[var(--saas-accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full" />
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 h-14 inline-flex items-center justify-center gap-3 rounded-2xl bg-[var(--saas-accent-gradient)] text-sm font-black text-white shadow-lg shadow-[var(--saas-accent-glow)]/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {saving ? "Saving..." : "Synchronize Nodes"}
              </button>
              <button
                type="button"
                onClick={handlePreview}
                disabled={!connectedPlatforms.length || previewLoading}
                className="h-14 px-8 inline-flex items-center justify-center gap-3 rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] text-sm font-bold text-[var(--saas-text-primary)] hover:bg-[var(--saas-bg-elevated)] transition-all disabled:opacity-50"
              >
                {previewLoading ? <Loader2 className="h-5 w-5 animate-spin text-[var(--saas-accent-primary)]" /> : <Eye className="h-5 w-5" />}
                <span className="hidden sm:inline">Materialize Preview</span>
              </button>
            </div>
          </form>
        </DashboardCard>

        <div className="space-y-6">
            <DashboardCard className="h-fit p-8">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-2">
                Real-time Rendering
              </p>
              <h3 className="text-xl font-extrabold text-[var(--saas-text-primary)] tracking-tight">
                Live Verification
              </h3>
              <div className="mt-8 space-y-4">
                {previewLoading ? (
                  connectedPlatforms.map((platform) => (
                    <SocialCardSkeleton key={platform.key} />
                  ))
                ) : connectedPlatforms.length ? (
                  connectedPlatforms.map((platform, index) => (
                    <div key={platform.key} className="relative group">
                        <SocialProfileCard
                            platform={platform.socialKey}
                            data={socialPreviewData?.[platform.socialKey]}
                            index={index}
                            showDisconnected={true}
                        />
                        <div className="absolute -inset-px rounded-[28px] border border-[var(--saas-accent-primary)]/0 group-hover:border-[var(--saas-accent-primary)]/20 transition-all pointer-events-none" />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/20 px-6 py-12 text-center group">
                    <div className="h-12 w-12 rounded-2xl bg-[var(--saas-bg-surface)] flex items-center justify-center text-[var(--saas-text-secondary)]/30 mb-4 ring-1 ring-[var(--saas-border)] group-hover:bg-[var(--saas-accent-primary)]/10 group-hover:text-[var(--saas-accent-primary)] transition-all">
                        <Share2 className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-[var(--saas-text-secondary)] leading-relaxed">
                      Initialize at least one nodal point to materialize social proof.
                    </p>
                  </div>
                )}
              </div>
            </DashboardCard>
            
            <div className="rounded-[32px] overflow-hidden bg-[var(--saas-accent-gradient)] p-8 text-white relative group">
                <div className="relative z-10">
                    <Zap className="h-8 w-8 text-white mb-4 opacity-80 group-hover:scale-125 transition-transform duration-500" />
                    <h4 className="text-lg font-black tracking-tight italic">"Social proof is non-negotiable."</h4>
                    <p className="mt-4 text-xs font-bold opacity-90 leading-relaxed">Connected profiles increase conversion rates by up to 28% for top creators.</p>
                </div>
                <Users className="absolute -bottom-6 -right-6 h-32 w-32 opacity-10 -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
            </div>
        </div>
      </div>
    </div>
  );
}
