import {
  Bell,
  ChevronDown,
  ExternalLink,
  Menu,
  Search,
  Settings2,
  UserCircle2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_NAV_ITEMS } from "./dashboardConfig";
import {
  cx,
  getAvatarUrl,
  getPublicProfileUrl,
  getScheduledLinks,
} from "./dashboardUtils";

function SearchResults({ results, onSelect }) {
  if (!results.length) {
    return (
      <div className="px-4 py-5 text-sm text-[var(--text-muted)]">
        No matches yet. Try "links" or "analytics".
      </div>
    );
  }

  return (
    <div className="py-2">
      {results.map((result) => (
        <button
          key={result.key}
          type="button"
          onClick={() => onSelect(result)}
          className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-white/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-[var(--text-primary)]">
            <result.icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {result.label}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {result.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function TopNavbar({
  user,
  links,
  analytics,
  onMenuClick,
  onLogout,
}) {
  const navigate = useNavigate();
  const avatarUrl = getAvatarUrl(user);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const scheduledLinks = getScheduledLinks(links);

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return DASHBOARD_NAV_ITEMS.slice(0, 5).map((item) => ({
        key: item.to,
        label: item.label,
        description: item.description,
        route: item.to,
        icon: item.icon,
      }));
    }

    const routeMatches = DASHBOARD_NAV_ITEMS.filter((item) =>
      `${item.label} ${item.description}`
        .toLowerCase()
        .includes(normalizedQuery),
    ).map((item) => ({
      key: item.to,
      label: item.label,
      description: item.description,
      route: item.to,
      icon: item.icon,
    }));

    const linkMatches = links
      .filter((link) =>
        `${link.title} ${link.url}`.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 4)
      .map((link) => ({
        key: `link-${link.id}`,
        label: link.title,
        description: link.url,
        route: "/dashboard/links",
        icon: ExternalLink,
      }));

    return [...routeMatches, ...linkMatches].slice(0, 7);
  }, [links, query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      title: `${analytics?.todayClicks || 0} visits today`,
      body: "Your audience is active right now.",
    },
    {
      title: `${scheduledLinks.length} scheduled link${scheduledLinks.length === 1 ? "" : "s"}`,
      body: scheduledLinks.length
        ? "Time-sensitive launches are queued and ready."
        : "No scheduled campaigns yet.",
    },
    {
      title: analytics?.topLinks?.[0]?.title || "No top link data yet",
      body: analytics?.topLinks?.[0]
        ? "Current top-performing destination."
        : "Publish links to unlock leaderboard insights.",
    },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--card-border)] bg-[color-mix(in_srgb,var(--bg-primary)_82%,transparent)] px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3 lg:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-white/5 text-[var(--text-primary)] transition hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div ref={searchRef} className="relative flex-1">
          <div className="dashboard-search-shell">
            <Search className="h-4 w-4 text-[var(--text-muted)]" />
            <input
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search views, links, and shortcuts"
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            />
            <span className="hidden rounded-xl border border-[var(--card-border)] bg-white/5 px-2 py-1 text-[11px] font-medium text-[var(--text-muted)] sm:inline-flex">
              Ctrl K
            </span>
          </div>

          {searchOpen ? (
            <div className="dashboard-floating-panel absolute inset-x-0 top-[calc(100%+12px)] overflow-hidden rounded-[26px]">
              <SearchResults
                results={searchResults}
                onSelect={(result) => {
                  setSearchOpen(false);
                  setQuery("");
                  navigate(result.route);
                }}
              />
            </div>
          ) : null}
        </div>

        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationOpen((open) => !open)}
            className={cx(
              "relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-white/5 text-[var(--text-primary)] transition",
              notificationOpen && "bg-white/10",
            )}
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_18px_rgba(236,72,153,0.65)]" />
          </button>
          {notificationOpen ? (
            <div className="dashboard-floating-panel absolute right-0 top-[calc(100%+12px)] w-[320px] rounded-[26px] p-3">
              <p className="px-3 py-2 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Pulse
              </p>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.title}
                    className="rounded-2xl border border-[var(--card-border)] bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                      {notification.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className="flex items-center gap-3 rounded-[20px] border border-[var(--card-border)] bg-white/5 px-2.5 py-2 transition hover:bg-white/10"
          >
            <div className="h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || user?.username || "Profile avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[var(--text-primary)]">
                  {(user?.username || user?.name || "L")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {user?.name || "Creator"}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                @{user?.username || "linkhub"}
              </p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-[var(--text-muted)] sm:block" />
          </button>

          {profileOpen ? (
            <div className="dashboard-floating-panel absolute right-0 top-[calc(100%+12px)] w-[260px] rounded-[24px] p-2">
              <a
                href={getPublicProfileUrl(user?.username)}
                target="_blank"
                rel="noopener noreferrer"
                className="dashboard-menu-item"
              >
                <ExternalLink className="h-4 w-4" />
                View Public Page
              </a>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/dashboard/my-page");
                }}
                className="dashboard-menu-item"
              >
                <UserCircle2 className="h-4 w-4" />
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/dashboard/settings");
                }}
                className="dashboard-menu-item"
              >
                <Settings2 className="h-4 w-4" />
                Settings
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="dashboard-menu-item text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
