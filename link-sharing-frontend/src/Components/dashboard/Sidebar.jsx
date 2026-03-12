import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, X, Layout, Link2, Palette, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { DASHBOARD_NAV_ITEMS } from "./dashboardConfig";
import { cx, getPageCompletion, getPublicProfileUrl } from "./dashboardUtils";

const MotionDiv = motion.div;

export default function Sidebar({ isOpen, onClose, user, links }) {
  const completion = getPageCompletion(user, links);

  return (
    <>
      <div
        className={cx(
          "fixed inset-0 z-40 bg-[var(--saas-bg-main)]/60 backdrop-blur-md transition lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[var(--saas-border)] bg-[var(--saas-sidebar-bg)] px-5 py-8 transition-transform duration-300 lg:sticky lg:translate-x-0 lg:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--saas-accent-gradient)] shadow-lg shadow-[var(--saas-accent-glow)] text-lg font-bold text-white">
              LH
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-[var(--saas-text-primary)]">
                LinkHub
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--saas-accent-primary)] animate-pulse" />
                <p className="text-[10px] text-[var(--saas-text-secondary)] font-bold tracking-[0.1em] uppercase">
                  Pro Creator
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--saas-border)] text-[var(--saas-text-secondary)] transition hover:bg-[var(--saas-bg-elevated)] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Page Health - Premium Integrated Look */}
        <div className="mt-10 group cursor-default">
           <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-[var(--saas-text-secondary)] uppercase tracking-wider">Page Completion</span>
              <span className="text-sm font-bold text-[var(--saas-text-primary)]">{completion}%</span>
           </div>
           <div className="h-1.5 w-full rounded-full bg-[var(--saas-bg-elevated)] overflow-hidden">
              <MotionDiv
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                className="h-full rounded-full bg-[var(--saas-accent-gradient)]"
              />
           </div>
           <p className="mt-2.5 text-[11px] text-[var(--saas-text-secondary)] leading-relaxed px-1">
             Complete your profile to unlock <span className="text-[var(--saas-text-primary)] font-semibold italic">Growth Insights</span>
           </p>
        </div>

        <nav className="mt-10 flex-1 space-y-1.5">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
              >
                {({ isActive }) => (
                  <div
                    className={cx(
                      "group flex items-center gap-3.5 rounded-2xl px-4 py-3 transition-all duration-300",
                      isActive
                        ? "bg-[var(--saas-bg-elevated)] text-[var(--saas-accent-primary)] shadow-sm shadow-[var(--saas-accent-glow)]/10 ring-1 ring-[var(--saas-border)]"
                        : "text-[var(--saas-text-secondary)] hover:bg-[var(--saas-bg-surface)] hover:text-[var(--saas-text-primary)]",
                    )}
                  >
                    <IconComponent
                      className={cx(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        isActive
                          ? "text-[var(--saas-accent-primary)]"
                          : "text-[var(--saas-text-secondary)] group-hover:text-[var(--saas-text-primary)]",
                      )}
                    />
                    <span className="text-[14px] font-semibold tracking-tight">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--saas-accent-primary)] shadow-[0_0_8px_var(--saas-accent-glow)]" />
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Live Preview - Premium Action Block */}
        <div className="mt-auto">
          <a
            href={getPublicProfileUrl(user?.username)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-1 rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)] p-4 transition-all hover:bg-[var(--saas-bg-surface)] hover:border(--saas-accent-primary)/30 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--saas-text-primary)]">Public Profile</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--saas-text-secondary)] group-hover:text-[var(--saas-accent-primary)] transition-colors" />
            </div>
            <p className="text-[11px] text-[var(--saas-text-secondary)] font-medium truncate">
                {user?.username ? `linkhub.to/${user.username}` : "Get your URL"}
            </p>
          </a>
        </div>
      </aside>
    </>
  );
}
