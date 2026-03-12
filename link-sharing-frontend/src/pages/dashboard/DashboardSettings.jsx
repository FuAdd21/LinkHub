import { ArrowUpRight, LogOut, Mail, Settings2, Sparkles, User, Shield, Terminal } from "lucide-react";
import DashboardCard from "../../Components/dashboard/DashboardCard";
import {
  getPageCompletion,
  getPublicProfileUrl,
} from "../../Components/dashboard/dashboardUtils";

export default function DashboardSettings({ userData, links, onLogout }) {
  const pageCompletion = getPageCompletion(userData, links);

  return (
    <div className="space-y-10 pb-12">
      <div className="max-w-2xl">
         <div className="flex items-center gap-2 mb-3">
              <Settings2 className="h-4 w-4 text-[var(--saas-accent-primary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-accent-primary)]">Control Plane</span>
          </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--saas-text-primary)] sm:text-4xl">
          Workspace shortcuts and nodal parameters
        </h1>
        <p className="mt-4 text-[15px] font-medium leading-relaxed text-[var(--saas-text-secondary)]">
          Manage your identity and operational status. Fine-tune your account snapshot and session parameters.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <DashboardCard className="p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] shadow-inner">
                <Shield className="h-6 w-6 text-[var(--saas-accent-primary)]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--saas-text-secondary)]">
                  Account Snap
                </p>
                <h3 className="text-xl font-extrabold text-[var(--saas-text-primary)] tracking-tight">
                  Status Parameters
                </h3>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="group relative rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 p-5 transition-all hover:border-[var(--saas-accent-primary)]/30">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-3">
                  Primary Node
                </p>
                <p className="text-[15px] font-bold text-[var(--saas-text-primary)] truncate">
                  {userData?.email || "Not available"}
                </p>
                <Mail className="absolute right-5 top-5 h-4 w-4 text-[var(--saas-text-secondary)] opacity-20" />
              </div>
              
              <div className="group relative rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 p-5 transition-all hover:border-[var(--saas-accent-primary)]/30">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-3">
                  Active Aura
                </p>
                <p className="text-[15px] font-bold text-[var(--saas-text-primary)]">
                  {userData?.theme || "Atmospheric Dark"}
                </p>
                <Sparkles className="absolute right-5 top-5 h-4 w-4 text-[var(--saas-text-secondary)] opacity-20" />
              </div>
              
              <div className="group relative rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 p-5 transition-all hover:border-[var(--saas-accent-primary)]/30">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-3">
                  Nodal Path
                </p>
                <p className="text-[15px] font-bold text-[var(--saas-accent-primary)]">
                  /{userData?.username || "username"}
                </p>
                <Terminal className="absolute right-5 top-5 h-4 w-4 text-[var(--saas-text-secondary)] opacity-20" />
              </div>
              
              <div className="group relative rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 p-5 transition-all hover:border-[var(--saas-accent-primary)]/30">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-3">
                  Manifestation %
                </p>
                <div className="flex items-center gap-3">
                    <p className="text-[15px] font-bold text-[var(--saas-text-primary)]">
                    {pageCompletion}%
                    </p>
                    <div className="h-1.5 flex-1 bg-[var(--saas-border)] rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[var(--saas-accent-primary)] shadow-[0_0_8px_var(--saas-accent-glow)]" 
                            style={{ width: `${pageCompletion}%` }}
                        />
                    </div>
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] shadow-inner">
                <Sparkles className="h-6 w-6 text-[var(--saas-accent-primary)]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--saas-text-secondary)]">
                  Operational Flow
                </p>
                <h3 className="text-xl font-extrabold text-[var(--saas-text-primary)] tracking-tight">
                  Accelerated Shortcuts
                </h3>
              </div>
            </div>
            
            <div className="grid gap-4">
              <a
                href={getPublicProfileUrl(userData?.username)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-[32px] border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 px-6 py-5 transition-all hover:border-[var(--saas-accent-primary)]/40 hover:bg-[var(--saas-bg-elevated)]/60"
              >
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-[var(--saas-bg-surface)] flex items-center justify-center text-[var(--saas-text-secondary)] group-hover:text-[var(--saas-accent-primary)] transition-colors border border-[var(--saas-border)]">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-[var(--saas-text-primary)]">Materialize Page</p>
                        <p className="text-[11px] font-bold text-[var(--saas-text-secondary)] opacity-50 italic">View your public-facing hub.</p>
                    </div>
                </div>
                <div className="h-6 w-6 rounded-full bg-[var(--saas-bg-surface)] flex items-center justify-center text-[var(--saas-text-secondary)]/30 group-hover:text-[var(--saas-accent-primary)] transition-all">
                    <ArrowRight className="h-3 w-3" />
                </div>
              </a>
              
              <a
                href={`mailto:${userData?.email || "hello@linkhub.app"}`}
                className="group flex items-center justify-between rounded-[32px] border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 px-6 py-5 transition-all hover:border-[var(--saas-accent-primary)]/40 hover:bg-[var(--saas-bg-elevated)]/60"
              >
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-[var(--saas-bg-surface)] flex items-center justify-center text-[var(--saas-text-secondary)] group-hover:text-[var(--saas-accent-primary)] transition-colors border border-[var(--saas-border)]">
                        <Mail className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-[var(--saas-text-primary)]">Support Terminal</p>
                        <p className="text-[11px] font-bold text-[var(--saas-text-secondary)] opacity-50 italic">Direct link to technical oversight.</p>
                    </div>
                </div>
                <div className="h-6 w-6 rounded-full bg-[var(--saas-bg-surface)] flex items-center justify-center text-[var(--saas-text-secondary)]/30 group-hover:text-[var(--saas-accent-primary)] transition-all">
                    <ArrowRight className="h-3 w-3" />
                </div>
              </a>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
            <DashboardCard className="h-fit p-8 relative overflow-hidden group">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-2">
                Session Control
              </p>
              <h3 className="text-xl font-extrabold text-[var(--saas-text-primary)] tracking-tight">
                Sever Connection
              </h3>
              <p className="mt-6 text-xs font-bold leading-relaxed text-[var(--saas-text-secondary)] opacity-60">
                Logging out will dissolve the active session and return you to the authentication matrix.
              </p>
              <button
                type="button"
                onClick={onLogout}
                className="mt-8 w-full h-14 inline-flex items-center justify-center gap-3 rounded-[24px] border border-rose-500/20 bg-rose-500/5 text-sm font-black text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-500 shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20"
              >
                <LogOut className="h-5 w-5" />
                Dissolve Session
              </button>
              
              <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-rose-500/10 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />
            </DashboardCard>
            
            <div className="rounded-[40px] bg-[var(--saas-bg-elevated)]/30 border border-[var(--saas-border)] p-8 text-center relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-[var(--saas-accent-primary)]/10 flex items-center justify-center text-[var(--saas-accent-primary)] mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="h-6 w-6 fill-current" />
                    </div>
                    <h4 className="text-sm font-black text-[var(--saas-text-primary)] tracking-tight">System Optimal</h4>
                    <p className="mt-2 text-xs font-bold text-[var(--saas-text-secondary)] opacity-40">All nodal endpoints are synchronized.</p>
                </div>
                {/* Visual noise background effect */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")'}} />
            </div>
        </div>
      </div>
    </div>
  );
}
