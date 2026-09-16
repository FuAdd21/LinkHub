import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Link2,
  Palette,
  BarChart2,
  Radio,
  Settings,
  MoreHorizontal,
  ExternalLink,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react";
import { getAvatarUrl, getPageCompletion } from "../dashboardUtils";
import "./SidebarNav.css";

export default function SidebarNav({
  user,
  links = [],
  isOpen = false,
  onClose = () => {},
  onLogout = () => {},
}) {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const currentPath = location.pathname;

  const navItems = [
    { label: "Overview", path: "/dashboard/overview", icon: LayoutGrid },
    { label: "Links", path: "/dashboard/links", icon: Link2, badge: links?.length ?? 0 },
    { label: "Appearance", path: "/dashboard/themes", icon: Palette },
    { label: "Analytics", path: "/dashboard/analytics", icon: BarChart2 },
    {
      label: "Integrations",
      path: "/dashboard/socials",
      icon: Radio,
      dot: true,
    },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const avatarUrl = getAvatarUrl(user);
  const completionPercent = getPageCompletion(user, links);
  const initials = (user?.name || user?.username || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar-container fixed top-0 bottom-0 left-0 z-50 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 pt-2">
          <Link
            to="/dashboard/overview"
            className="flex items-center gap-2.5 group"
            onClick={handleNavClick}
          >
            <div className="w-8 h-8 rounded-lg bg-[#c6f035] flex items-center justify-center text-[#0e1208] font-black shadow-sm group-hover:scale-105 transition-transform">
              <Link2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white">
              LinkHub
            </span>
            <span className="sidebar-brand-badge uppercase">PRO</span>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-2 pt-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#606760]">
          Workspace
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              (item.path === "/dashboard/overview" && currentPath === "/dashboard");

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={handleNavClick}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#c6f035]" : ""}`} />
                <span className="flex-1">{item.label}</span>

                {item.badge !== undefined && (
                  <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}

                {item.dot && (
                  <span className="w-2 h-2 rounded-full bg-[#c6f035] shadow-[0_0_6px_#c6f035]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Health Section */}
        <div className="sidebar-health-card mb-4 mt-auto">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-300">Profile health</span>
            <span className="text-[#c6f035]">{Math.max(completionPercent, 92)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#202520] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c6f035] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(completionPercent, 92)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-[#788278] leading-tight">
            Add a custom domain to complete your identity.
          </p>
        </div>

        {/* User Profile Pill */}
        <div className="relative pt-2 border-t border-white/5">
          <div className="sidebar-user-pill justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || "Avatar"}
                  className="w-8 h-8 rounded-full object-cover border border-white/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c6f035] to-[#22d3ee] flex items-center justify-center text-[#0e1208] text-xs font-black">
                  {initials}
                </div>
              )}
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {user?.name || user?.username || "Maya K."}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {user?.email || (user?.username ? `${user.username}@linkhub` : "user@linkhub")}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="User options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* User Popover Menu */}
          {showMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 p-1.5 bg-[#161a16] border border-white/10 rounded-xl shadow-2xl space-y-1 z-50">
              {user?.username && (
                <Link
                  to={`/${user.username}`}
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                  onClick={() => setShowMenu(false)}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Public Profile
                </Link>
              )}
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                onClick={() => setShowMenu(false)}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Account Settings
              </Link>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
