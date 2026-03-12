import {
  Bell,
  ChevronDown,
  ExternalLink,
  Menu,
  Search,
  Settings2,
  UserCircle2,
  Zap,
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
      <div className="px-4 py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--saas-bg-elevated)] text-[var(--saas-text-secondary)]">
            <Search className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-[var(--saas-text-primary)]">No results found</p>
        <p className="mt-1 text-xs text-[var(--saas-text-secondary)]">Try searching for pages or your links.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin">
      {results.map((result) => (
        <button
          key={result.key}
          type="button"
          onClick={() => onSelect(result)}
          className="group flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-[var(--saas-bg-elevated)]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--saas-bg-surface)] text-[var(--saas-text-secondary)] group-hover:text-[var(--saas-accent-primary)] group-hover:scale-110 transition-all border border-[var(--saas-border)]">
            <result.icon className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--saas-text-primary)] truncate">{result.label}</p>
            <p className="text-[11px] text-[var(--saas-text-secondary)] truncate font-medium">{result.description}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="h-1.5 w-1.5 rounded-full bg-[var(--saas-accent-primary)]" />
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
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      icon: Zap,
      title: `${analytics?.todayClicks || 0} visits today`,
      body: "High engagement detected on your landing page.",
      color: "text-amber-400"
    },
    {
      id: 2,
      icon: Bell,
      title: `${scheduledLinks.length} Links Queued`,
      body: scheduledLinks.length
        ? "Scheduled updates are ready for launch."
        : "Automate your profile with scheduled links.",
      color: "text-blue-400"
    },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--saas-border)] bg-[var(--saas-bg-main)]/80 backdrop-blur-xl px-4 py-3.5 sm:px-8">
      <div className="flex items-center gap-4 lg:gap-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)] text-[var(--saas-text-secondary)] transition hover:bg-[var(--saas-bg-surface)] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search - Command Style */}
        <div ref={searchRef} className="relative flex-1">
          <div className={cx(
            "flex h-11 w-full md:max-w-md items-center gap-3 rounded-2xl border bg-[var(--saas-bg-elevated)] px-4 transition-all duration-300",
            searchOpen 
              ? "border-[var(--saas-accent-primary)] ring-4 ring-[var(--saas-accent-glow)]/10 bg-[var(--saas-bg-surface)]" 
              : "border-[var(--saas-border)] hover:border-[var(--saas-border-hover)] shadow-sm"
          )}>
            <Search className={cx(
                "h-4.5 w-4.5 transition-colors",
                searchOpen ? "text-[var(--saas-accent-primary)]" : "text-[var(--saas-text-secondary)]"
            )} />
            <input
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search or jump to..."
              className="flex-1 bg-transparent text-[14px] font-medium text-[var(--saas-text-primary)] outline-none placeholder:text-[var(--saas-text-secondary)]"
            />
            <div className="hidden items-center gap-1.5 rounded-lg bg-[var(--saas-bg-surface)] border border-[var(--saas-border)] px-1.5 py-1 text-[10px] sm:flex">
              <span className="font-bold text-[var(--saas-text-secondary)]">⌘</span>
              <span className="font-bold text-[var(--saas-text-secondary)]">K</span>
            </div>
          </div>

          {searchOpen && (
            <div className="absolute inset-x-0 mt-3 md:max-w-md top-full overflow-hidden rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/5 animate-in fade-in slide-in-from-top-2">
              <div className="border-b border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/50 px-4 py-2.5">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--saas-text-secondary)]">Navigation & Links</p>
              </div>
              <SearchResults
                results={searchResults}
                onSelect={(result) => {
                  setSearchOpen(false);
                  setQuery("");
                  navigate(result.route);
                }}
              />
            </div>
          )}
        </div>

        {/* Action Center */}
        <div className="flex items-center gap-3">
            <div ref={notificationRef} className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen((open) => !open)}
                className={cx(
                  "relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300",
                  notificationOpen 
                    ? "bg-[var(--saas-bg-surface)] border-[var(--saas-accent-primary)] text-[var(--saas-accent-primary)]" 
                    : "bg-[var(--saas-bg-elevated)] border-[var(--saas-border)] text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] hover:border-[var(--saas-border-hover)] shadow-sm"
                )}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[var(--saas-accent-primary)] shadow-[0_0_10px_var(--saas-accent-glow)]" />
              </button>
              
              {notificationOpen && (
                <div className="absolute right-0 top-[calc(100%+14px)] w-[320px] rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-3 px-2 py-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--saas-text-secondary)]">Notifications</p>
                    <button className="text-[10px] font-bold text-[var(--saas-accent-primary)] hover:underline">Mark all read</button>
                  </div>
                  <div className="space-y-1.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="group flex gap-3.5 rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/40 p-3.5 transition-all hover:border-[var(--saas-border-hover)] hover:bg-[var(--saas-bg-elevated)]"
                      >
                         <div className={cx("mt-0.5 shrink-0", n.color)}>
                            <n.icon className="h-4.5 w-4.5" />
                         </div>
                        <div className="space-y-0.5">
                          <p className="text-[13px] font-bold text-[var(--saas-text-primary)]">
                            {n.title}
                          </p>
                          <p className="text-[11px] leading-relaxed text-[var(--saas-text-secondary)] font-medium">
                            {n.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 w-full rounded-xl bg-[var(--saas-bg-elevated)] py-2 text-[11px] font-bold text-[var(--saas-text-primary)] hover:bg-[var(--saas-bg-surface)] border border-[var(--saas-border)] transition-colors">
                      View all alerts
                  </button>
                </div>
              )}
            </div>

            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className={cx(
                  "flex items-center gap-2.5 rounded-2xl border p-1.5 transition-all duration-300",
                  profileOpen 
                    ? "bg-[var(--saas-bg-surface)] border-[var(--saas-accent-primary)]" 
                    : "bg-[var(--saas-bg-elevated)] border-[var(--saas-border)] hover:border-[var(--saas-border-hover)] shadow-sm"
                )}
              >
                <div className="h-8.5 w-8.5 overflow-hidden rounded-xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)]">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || user?.username || "Profile avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[var(--saas-text-primary)] bg-[var(--saas-accent-gradient)] text-white">
                      {(user?.username || user?.name || "L")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden pr-1 text-left sm:block">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-bold text-[var(--saas-text-primary)]"> {user?.name || "Creator"} </p>
                    <ChevronDown className={cx("h-3.5 w-3.5 text-[var(--saas-text-secondary)] transition-transform duration-300", profileOpen && "rotate-180")} />
                  </div>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+14px)] w-[240px] rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/5 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2.5 border-b border-[var(--saas-border)] mb-1">
                      <p className="text-[12px] font-bold text-[var(--saas-text-primary)]">@{user?.username || "linkhub"}</p>
                      <p className="text-[10px] text-[var(--saas-text-secondary)] font-medium mt-0.5 truncate">{user?.email}</p>
                  </div>
                  <div className="space-y-0.5">
                      <a
                        href={getPublicProfileUrl(user?.username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[var(--saas-text-secondary)] hover:bg-[var(--saas-bg-elevated)] hover:text-[var(--saas-text-primary)] transition-all"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Profile
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/dashboard/my-page");
                        }}
                        className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[var(--saas-text-secondary)] hover:bg-[var(--saas-bg-elevated)] hover:text-[var(--saas-text-primary)] transition-all"
                      >
                        <UserCircle2 className="h-4 w-4" />
                        Edit Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/dashboard/settings");
                        }}
                        className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[var(--saas-text-secondary)] hover:bg-[var(--saas-bg-elevated)] hover:text-[var(--saas-text-primary)] transition-all"
                      >
                        <Settings2 className="h-4 w-4" />
                        Settings
                      </button>
                  </div>
                  <div className="mt-1 pt-1 border-t border-[var(--saas-border)]">
                      <button
                        type="button"
                        onClick={onLogout}
                        className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
                      >
                        Sign out
                      </button>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
    </header>
  );
}
