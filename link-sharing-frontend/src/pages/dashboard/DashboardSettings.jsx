import { ArrowUpRight, LogOut, Mail, Settings2, Sparkles } from "lucide-react";
import DashboardCard from "../../Components/dashboard/DashboardCard";
import { getPageCompletion, getPublicProfileUrl } from "../../Components/dashboard/dashboardUtils";

export default function DashboardSettings({ userData, links, onLogout }) {
  const pageCompletion = getPageCompletion(userData, links);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">Settings</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Workspace shortcuts and account details that matter most
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
          Keep the essentials close: your profile route, account email, current
          theme, and the quickest path back to editing.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <DashboardCard>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/12 text-indigo-200">
                <Settings2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Account snapshot</p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
                  Current workspace status
                </h3>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-[var(--card-border)] bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Email</p>
                <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{userData?.email || "Not available"}</p>
              </div>
              <div className="rounded-[24px] border border-[var(--card-border)] bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Current theme</p>
                <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{userData?.theme || "dark-pro"}</p>
              </div>
              <div className="rounded-[24px] border border-[var(--card-border)] bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Public path</p>
                <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">/{userData?.username || "username"}</p>
              </div>
              <div className="rounded-[24px] border border-[var(--card-border)] bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Page completion</p>
                <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{pageCompletion}%</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Helpful shortcuts</p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
                  Jump straight into the things creators do most
                </h3>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <a
                href={getPublicProfileUrl(userData?.username)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-[24px] border border-[var(--card-border)] bg-white/5 px-4 py-4 text-sm font-medium text-[var(--text-primary)] transition hover:border-white/20 hover:bg-white/8"
              >
                View public page
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${userData?.email || "hello@linkhub.app"}`}
                className="flex items-center justify-between rounded-[24px] border border-[var(--card-border)] bg-white/5 px-4 py-4 text-sm font-medium text-[var(--text-primary)] transition hover:border-white/20 hover:bg-white/8"
              >
                Contact via email
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </DashboardCard>
        </div>

        <DashboardCard className="h-fit">
          <p className="text-sm font-medium text-[var(--text-secondary)]">Session</p>
          <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
            Securely sign out when you are done
          </h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            Logging out clears the active dashboard session on this device and returns
            you to the login flow.
          </p>
          <button type="button" onClick={onLogout} className="mt-6 dashboard-secondary-button text-rose-200 hover:border-rose-400/35 hover:bg-rose-500/10 hover:text-rose-100">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </DashboardCard>
      </div>
    </div>
  );
}
