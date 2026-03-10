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
          "fixed inset-y-0 left-0 z-50 flex w-[284px] flex-col border-r border-[#1e1e1e] bg-[#09090b] px-4 py-5 transition-transform duration-300 lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-black">
              L
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-zinc-100">
                LinkHub
              </p>
              <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
                CREATOR SPACE
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition hover:bg-zinc-800 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-[#1e1e1e] bg-[#121214] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Page Health
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                {completion}%
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e1e1e]">
              <Sparkles className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-[#1e1e1e]">
            <MotionDiv
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              className="h-full rounded-full bg-white"
            />
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Add a bio and your first links to reach 100%.
          </p>
        </div>

        <nav className="mt-6 flex-1 space-y-1">
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
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition",
                      isActive
                        ? "bg-[#1e1e1e] text-zinc-100"
                        : "text-zinc-400 hover:bg-[#121214] hover:text-zinc-100",
                    )}
                  >
                    <IconComponent
                      className={cx(
                        "h-4 w-4 shrink-0 transition",
                        isActive
                          ? "text-zinc-100"
                          : "text-zinc-500 group-hover:text-zinc-300",
                      )}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
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
          className="mt-4 flex items-center justify-between rounded-xl border border-[#1e1e1e] bg-[#121214] px-4 py-3 transition hover:bg-[#1e1e1e]"
        >
          <div>
            <p className="text-xs font-semibold text-zinc-100">Live preview</p>
            <p className="text-[10px] text-zinc-500">
              {user?.username ? `linkhub.com/${user.username}` : "Not claimed"}
            </p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-400" />
        </a>
      </aside>
    </>
  );
}
