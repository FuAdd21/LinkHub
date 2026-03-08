import { Check, Palette, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardCard from "../../Components/dashboard/DashboardCard";
import {
  DASHBOARD_BACKGROUNDS,
  DASHBOARD_THEMES,
} from "../../Components/dashboard/dashboardConfig";
import { API_BASE_URL, getDashboardAuthConfig } from "../../api/dashboardApi";

export default function DashboardThemes({ userData, onRefresh, onUserChange }) {
  const [selectedTheme, setSelectedTheme] = useState(userData?.theme || "dark-pro");
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
      toast.success("Theme updated");
    } catch {
      toast.error("Failed to save theme settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">Themes</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Give your page a polished visual system that feels intentional
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
          Choose a mood, adjust the background energy, and keep the dashboard preview
          in sync while you experiment.
        </p>
      </div>

      <DashboardCard>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/12 text-indigo-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Theme collection</p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
              Pick the foundation for your creator page
            </h3>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {DASHBOARD_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelectedTheme(theme.id)}
              className="relative overflow-hidden rounded-[26px] border p-4 text-left transition hover:-translate-y-1"
              style={{
                borderColor:
                  selectedTheme === theme.id ? "var(--accent)" : "var(--card-border)",
                backgroundColor: "color-mix(in srgb, var(--card-bg) 88%, transparent)",
              }}
            >
              <div
                className="h-28 rounded-[22px] border border-white/10"
                style={{ background: theme.preview }}
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{theme.name}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    {theme.description}
                  </p>
                </div>
                {selectedTheme === theme.id ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                    <Check className="h-4 w-4" />
                  </div>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-200">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Background accents</p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
              Fine-tune the page atmosphere
            </h3>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {DASHBOARD_BACKGROUNDS.map((background) => (
            <button
              key={background.value}
              type="button"
              onClick={() => setSelectedBackground(background.value)}
              className="relative overflow-hidden rounded-[24px] border p-3 text-left transition hover:-translate-y-1"
              style={{
                borderColor:
                  selectedBackground === background.value
                    ? "var(--accent)"
                    : "var(--card-border)",
                backgroundColor: "color-mix(in srgb, var(--card-bg) 88%, transparent)",
              }}
            >
              <div className={`h-16 rounded-[18px] bg-gradient-to-r ${background.colors}`} />
              <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                {background.label}
              </p>
              {selectedBackground === background.value ? (
                <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                  <Check className="h-4 w-4" />
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </DashboardCard>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="dashboard-primary-button disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save theme settings"}
      </button>
    </div>
  );
}