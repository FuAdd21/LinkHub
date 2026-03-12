import { Check, Palette, Save, Sparkles, Layout, Monitor, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardCard from "../../Components/dashboard/DashboardCard";
import {
  DASHBOARD_BACKGROUNDS,
  DASHBOARD_THEMES,
} from "../../Components/dashboard/dashboardConfig";
import { API_BASE_URL, getDashboardAuthConfig } from "../../api/dashboardApi";
import { cx } from "../../Components/dashboard/dashboardUtils";

export default function DashboardThemes({ userData, onRefresh, onUserChange }) {
  const [selectedTheme, setSelectedTheme] = useState(
    userData?.theme || "dark-pro",
  );
  const [selectedBackground, setSelectedBackground] = useState(
    userData?.background_value || "purple-pink",
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedTheme(userData?.theme || "dark-pro");
    setSelectedBackground(userData?.background_value || "purple-pink");
  }, [userData]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }, [selectedTheme]);

  async function handleSave() {
    setSaving(true);

    try {
      await axios.put(
        `${API_BASE_URL}/api/profile`,
        {
          theme: selectedTheme,
          background_type: "gradient",
          background_value: selectedBackground,
        },
        getDashboardAuthConfig(),
      );

      onUserChange?.((currentUser) => ({
        ...currentUser,
        theme: selectedTheme,
        background_type: "gradient",
        background_value: selectedBackground,
      }));
      onRefresh?.();
      toast.success("Visual aura synchronized");
    } catch {
      toast.error("Failed to materialize theme changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="max-w-2xl">
         <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-[var(--saas-accent-primary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-accent-primary)]">Aesthetic Engine</span>
          </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--saas-text-primary)] sm:text-4xl">
          Give your page a polished visual system
        </h1>
        <p className="mt-4 text-[15px] font-medium leading-relaxed text-[var(--saas-text-secondary)]">
          Choose a mood, adjust the background energy, and keep your dashboard environment in sync with your brand's frequency.
        </p>
      </div>

      <div className="grid gap-10">
        <DashboardCard className="p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] shadow-inner">
                <Layout className="h-6 w-6 text-[var(--saas-accent-primary)]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--saas-text-secondary)]">
                  Archetype Selector
                </p>
                <h3 className="text-xl font-extrabold text-[var(--saas-text-primary)] tracking-tight">
                  Core Foundations
                </h3>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DASHBOARD_THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                
                return (
                    <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className={cx(
                        "group relative overflow-hidden rounded-[32px] border p-4 text-left transition-all duration-500 hover:-translate-y-1",
                        isSelected 
                            ? "border-[var(--saas-accent-primary)] bg-[var(--saas-bg-elevated)] shadow-lg shadow-[var(--saas-accent-glow)]/10" 
                            : "border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 hover:border-[var(--saas-accent-primary)]/20 hover:bg-[var(--saas-bg-elevated)]/50"
                    )}
                    >
                    <div
                        className="h-32 rounded-[24px] border border-white/5 shadow-inner"
                        style={{ background: theme.preview }}
                    />
                    <div className="mt-5 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                        <p className="text-sm font-black text-[var(--saas-text-primary)] truncate">
                            {theme.name}
                        </p>
                        <p className="mt-1 text-[11px] font-bold leading-relaxed text-[var(--saas-text-secondary)] opacity-50">
                            {theme.description}
                        </p>
                        </div>
                        {isSelected && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--saas-accent-primary)] text-white shadow-[0_0_12px_var(--saas-accent-glow)]">
                            <Check className="h-3.5 w-3.5" />
                        </div>
                        )}
                    </div>
                    
                    {/* Background glow animation */}
                    {isSelected && (
                        <div className="absolute -inset-1 bg-[var(--saas-accent-gradient)] opacity-[0.05] blur-xl -z-10" />
                    )}
                    </button>
                );
            })}
            </div>
        </DashboardCard>

        <DashboardCard className="p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] shadow-inner">
                <Layers className="h-6 w-6 text-[var(--saas-accent-primary)]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--saas-text-secondary)]">
                  Energy Field
                </p>
                <h3 className="text-xl font-extrabold text-[var(--saas-text-primary)] tracking-tight">
                  Atmospheric Accents
                </h3>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DASHBOARD_BACKGROUNDS.map((background) => {
                const isSelected = selectedBackground === background.value;
                
                return (
                    <button
                        key={background.value}
                        type="button"
                        onClick={() => setSelectedBackground(background.value)}
                        className={cx(
                            "group relative overflow-hidden rounded-[28px] border p-3 text-left transition-all duration-300",
                            isSelected 
                                ? "border-[var(--saas-accent-primary)] bg-[var(--saas-bg-elevated)] shadow-lg shadow-[var(--saas-accent-glow)]/5" 
                                : "border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 hover:border-[var(--saas-accent-primary)]/20 hover:bg-[var(--saas-bg-elevated)]/50"
                        )}
                    >
                        <div
                            className={cx(
                                "h-20 rounded-[20px] bg-gradient-to-r shadow-inner transition-transform duration-500 group-hover:scale-[1.02]",
                                background.colors
                            )}
                        />
                        <div className="mt-4 px-1 flex items-center justify-between">
                            <p className="text-xs font-black text-[var(--saas-text-primary)] uppercase tracking-widest">
                                {background.label}
                            </p>
                            {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-[var(--saas-accent-primary)] flex items-center justify-center text-white">
                                <Check className="h-3 w-3" />
                            </div>
                            )}
                        </div>
                    </button>
                );
            })}
            </div>
        </DashboardCard>
      </div>

      <div className="flex items-center gap-4 pt-6">
        <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="group relative h-16 px-10 inline-flex items-center justify-center gap-3 rounded-3xl bg-[var(--saas-accent-gradient)] text-[15px] font-black text-white shadow-xl shadow-[var(--saas-accent-glow)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
            {saving ? <Sparkles className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? "Synchronizing..." : "Apply Visual Aura"}
            
            {/* Soft pulse effect */}
            <div className="absolute inset-0 rounded-3xl bg-white/20 animate-pulse opacity-0 group-hover:opacity-10 pointer-events-none" />
        </button>
        
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-[var(--saas-text-secondary)] opacity-40 uppercase tracking-[0.2em]">
            <Monitor className="h-3.5 w-3.5" />
            Live Preview Synchronized
        </div>
      </div>
    </div>
  );
}
