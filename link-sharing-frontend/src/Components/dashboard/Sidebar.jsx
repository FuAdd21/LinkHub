import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
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
          "fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm transition lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-[284px] flex-col border-r border-white/10 bg-[color-mix(in_srgb,var(--nav-bg)_96%,transparent)] px-4 py-5 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl font-display text-lg font-semibold text-white shadow-[0_20px_40px_rgba(147,51,234,0.28)]"
              style={{ background: "var(--logo-gradient)" }}
            >
              L
            </div>
            <div>
              <p className="text-sm font-semibold text-white">LinkHub</p>
              <p className="text-xs text-slate-400">Creator control center</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="dashboard-surface mt-8 rounded-[28px] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                Page health
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {completion}%
              </p>
            </div>
            <div className="dashboard-accent-icon h-12 w-12">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <MotionDiv
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              className="h-full rounded-full"
              style={{ background: "var(--accent-gradient)" }}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Add a bio, links, and connected socials to complete the creator
            setup.
          </p>
        </div>

        <nav className="mt-6 flex-1 space-y-1.5">
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
                      "group relative overflow-hidden rounded-2xl px-4 py-3.5 transition",
                      isActive
                        ? "bg-[color-mix(in_srgb,var(--accent)_18%,white_3%)] text-white shadow-[0_18px_45px_rgba(147,51,234,0.22)]"
                        : "text-slate-400 hover:bg-white/6 hover:text-white",
                    )}
                  >
                    <div
                      className={cx(
                        "absolute inset-y-3 left-0 w-1 rounded-full transition",
                        isActive
                          ? "bg-[var(--accent-secondary)]"
                          : "bg-transparent group-hover:bg-white/20",
                      )}
                    />
                    <div className="flex items-start gap-3">
                      <div
                        className={cx(
                          "mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl transition",
                          isActive
                            ? "bg-slate-950/70 text-white"
                            : "bg-white/5 text-slate-300 group-hover:bg-white/10 group-hover:text-white",
                        )}
                      >
                        <IconComponent className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p
                          className={cx(
                            "text-sm font-semibold",
                            isActive ? "text-white" : "text-current",
                          )}
                        >
                          {item.label}
                        </p>
                        <p
                          className={cx(
                            "mt-1 text-xs leading-5",
                            isActive
                              ? "text-white/60"
                              : "text-slate-500 group-hover:text-slate-300",
                          )}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        <a
          href={getPublicProfileUrl(user?.username)}
          target="_blank"
          rel="noopener noreferrer"
          className="dashboard-highlight-panel mt-4 flex items-center justify-between rounded-[26px] px-4 py-4 text-sm text-white transition hover:border-white/20"
        >
          <div>
            <p className="font-semibold">View public page</p>
            <p className="mt-1 text-xs text-slate-300">
              {user?.username
                ? `linkhub.com/${user.username}`
                : "Set a username first"}
            </p>
          </div>
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </aside>
    </>
  );
}
