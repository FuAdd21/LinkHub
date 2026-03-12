import {
  ArrowUpRight,
  Eye,
  Link2,
  MousePointer2,
  Palette,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import DashboardCard from "../../Components/dashboard/DashboardCard";
import {
  cx,
  formatCompactNumber,
  getAvatarUrl,
  getConnectedPlatforms,
  getPublicProfileUrl,
  getVisibleLinks,
} from "../../Components/dashboard/dashboardUtils";

function MetricCard({ label, value, detail, icon: Icon, trend }) {
  return (
    <DashboardCard className="relative overflow-hidden group hover:border-[var(--saas-accent-primary)]/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--saas-text-secondary)]">
            {label}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <h4 className="text-3xl font-black tracking-tighter text-[var(--saas-text-primary)]">
              {typeof value === "number" ? formatCompactNumber(value) : value}
            </h4>
            {trend && (
              <span className="text-[10px] font-bold text-emerald-400">
                +{trend}%
              </span>
            )}
          </div>
          <p className="mt-2 text-[11px] font-bold text-[var(--saas-text-secondary)]">
            {detail}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] group-hover:scale-110 transition-transform text-[var(--saas-accent-primary)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 h-20 w-20 bg-[var(--saas-accent-primary)] opacity-[0.03] blur-3xl rounded-full" />
    </DashboardCard>
  );
}

function MiniTrendChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className="h-full w-full flex items-center justify-center text-[var(--saas-text-secondary)]/30 text-xs font-bold uppercase tracking-widest">
        Insufficient Data Pulse
      </div>
    );
  }
  
  const max = Math.max(...data.map(d => d.clicks), 1);
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.clicks / max) * 80 - 10}`)
    .join(" ");

  return (
    <div className="h-full w-full p-2">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trend-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--saas-accent-primary)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--saas-accent-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 100 L ${points} L 100 100 Z`}
          fill="url(#trend-gradient)"
        />
        <polyline
          fill="none"
          stroke="var(--saas-accent-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="drop-shadow-[0_0_8px_var(--saas-accent-glow)]"
        />
      </svg>
    </div>
  );
}

function SocialStatsCard({ userData, socialPreviewData }) {
  const connectedPlatforms = getConnectedPlatforms(userData);

  return (
    <DashboardCard className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-8">
        <div>
          <h3 className="text-base font-bold text-[var(--saas-text-primary)]">
            Connected Reach
          </h3>
          <p className="mt-1 text-xs font-medium text-[var(--saas-text-secondary)]">
            Real-time social signals
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)] text-[var(--saas-accent-primary)] shadow-sm">
          <Share2 className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {connectedPlatforms.length ? (
          connectedPlatforms.slice(0, 4).map((platform) => {
            const Icon = platform.icon;
            const stats = socialPreviewData?.[platform.socialKey];
            const primaryCount =
              stats?.followers ??
              stats?.subscriberCount ??
              stats?.subscribers ??
              stats?.memberCount ??
              stats?.members;
            const secondaryCount =
              stats?.videoCount ??
              stats?.likes ??
              stats?.publicRepos ??
              stats?.public_repos;

            return (
              <div
                key={platform.key}
                className="group flex items-center justify-between rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 px-4 py-3.5 hover:bg-[var(--saas-bg-elevated)] hover:border-[var(--saas-border-hover)] transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--saas-bg-surface)] text-[var(--saas-text-secondary)] group-hover:text-[var(--saas-accent-primary)] group-hover:scale-110 transition-all border border-[var(--saas-border)]">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--saas-text-primary)]">
                      {platform.label}
                    </p>
                    <p className="text-[11px] font-bold text-[var(--saas-accent-primary)] tracking-wide">
                      {primaryCount
                        ? `${formatCompactNumber(primaryCount)} followers`
                        : "Connected"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[var(--saas-text-primary)]">
                    {secondaryCount
                      ? formatCompactNumber(secondaryCount)
                      : "0"}
                  </p>
                  <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--saas-text-secondary)]">
                    Posts
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/20 p-6 text-center">
             <div className="h-10 w-10 rounded-full bg-[var(--saas-bg-surface)] flex items-center justify-center mb-3 text-[var(--saas-text-secondary)]">
                <Link2 className="h-4 w-4" />
             </div>
             <p className="text-xs font-semibold text-[var(--saas-text-secondary)]">No social reach data yet.</p>
             <Link to="/dashboard/settings" className="mt-3 text-[11px] font-bold text-[var(--saas-accent-primary)] hover:underline">Link social accounts →</Link>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}

function QuickActionsCard() {
  const actions = [
    {
      label: "Profile Link",
      description: "Launch a new destination",
      to: "/dashboard/links",
      icon: Link2,
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      label: "Visual Studio",
      description: "Switch the page mood",
      to: "/dashboard/themes",
      icon: Palette,
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    },
    {
        label: "Sync Engine",
        description: "Pull latest social stats",
        to: "/dashboard",
        icon: TrendingUp,
        color: "text-green-400",
        bg: "bg-green-500/10"
      },
  ];

  return (
    <DashboardCard className="h-full">
      <div className="flex items-center justify-between gap-3 mb-8">
        <div>
          <h3 className="text-base font-bold text-[var(--saas-text-primary)]">
            Command Center
          </h3>
          <p className="mt-1 text-xs font-medium text-[var(--saas-text-secondary)]">Fast profile orchestration</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)] text-[var(--saas-accent-primary)] shadow-sm">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.label}
              to={action.to}
              className="group flex items-center justify-between rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 p-4 transition-all duration-300 hover:bg-[var(--saas-bg-elevated)] hover:border-[var(--saas-border-hover)] hover:shadow-lg hover:shadow-[var(--saas-accent-glow)]/5"
            >
              <div className="flex items-center gap-4">
                <div className={cx("flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-white/10 group-hover:scale-110 transition-transform", action.bg)}>
                  <Icon className={cx("h-5 w-5", action.color)} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[var(--saas-text-primary)]">
                    {action.label}
                  </p>
                  <p className="text-[11px] font-bold text-[var(--saas-text-secondary)] tracking-tight">
                    {action.description}
                  </p>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-[var(--saas-bg-surface)] flex items-center justify-center text-[var(--saas-text-secondary)] group-hover:text-[var(--saas-accent-primary)] group-hover:bg-[var(--saas-bg-elevated)] transition-all">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </DashboardCard>
  );
}

function AnalyticsSummaryCard({ analytics }) {
  const topLink = analytics?.topLinks?.[0];

  return (
    <DashboardCard className="relative overflow-hidden">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between relative z-10">
        <div className="max-w-md">
            <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-[var(--saas-accent-primary)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-accent-primary)]">Traction Pulse</span>
            </div>
           <h3 className="text-xl font-extrabold text-[var(--saas-text-primary)] tracking-tight">
            Audience engagement
          </h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--saas-text-secondary)]">
            Analyzing your global traffic trend for the last 30 days. Your peak performance is currently surfacing on <span className="text-[var(--saas-text-primary)] font-bold italic">{topLink?.title || "new content"}</span>.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:text-right">
            <div className="rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/50 px-4 py-3">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--saas-text-secondary)]">Primary Destination</p>
                <p className="text-sm font-bold text-[var(--saas-text-primary)] mt-1 truncate max-w-[180px]">
                    {topLink?.title || "No data yet"}
                </p>
            </div>
            <Link
                to="/dashboard/analytics"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--saas-text-primary)] px-6 py-2.5 text-xs font-bold text-[var(--saas-bg-main)] transition-all hover:scale-105 hover:bg-[var(--saas-text-primary)]/90 shadow-lg"
            >
                Full Analytics Report
                <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] relative z-10">
        <div className="h-[240px] w-full bg-[var(--saas-bg-elevated)]/20 rounded-3xl border border-[var(--saas-border)] p-1 overflow-hidden">
            <MiniTrendChart data={analytics?.clicksPerDay || []} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/40 p-6 flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--saas-text-secondary)]">
              Accumulated Clicks
            </p>
            <p className="mt-3 text-4xl font-black tracking-tighter text-[var(--saas-text-primary)]">
              {formatCompactNumber(analytics?.totalClicks || 0)}
            </p>
            <div className="mt-3 flex items-center gap-2 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold font-mono">+12.5%</span>
            </div>
          </div>
          <div className="flex-1 rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/40 p-6 flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--saas-text-secondary)]">
              Fresh Visits Today
            </p>
            <p className="mt-3 text-4xl font-black tracking-tighter text-[var(--saas-text-primary)]">
              {formatCompactNumber(analytics?.todayClicks || 0)}
            </p>
            <p className="mt-2 text-[11px] font-bold text-[var(--saas-text-secondary)]">Active engagement window</p>
          </div>
        </div>
      </div>

      {/* Background glow for interest */}
      <div className="absolute top-0 right-0 h-64 w-64 bg-[var(--saas-accent-primary)] opacity-[0.05] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
    </DashboardCard>
  );
}

export default function DashboardOverview({
  userData,
  links,
  analytics,
  socialPreviewData,
}) {
  const avatarUrl = getAvatarUrl(userData);
  const visibleLinks = getVisibleLinks(links);
  const topLink = analytics?.topLinks?.[0];
  const connectedPlatforms = getConnectedPlatforms(userData);

  const metricCards = useMemo(
    () => [
      {
        label: "Total conversion",
        value: analytics?.totalClicks || 0,
        detail: topLink
          ? `Top: ${topLink.title}`
          : "Gathering engagement data...",
        icon: MousePointer2,
      },
      {
        label: "Unique footprint",
        value: analytics?.todayClicks || 0,
        detail: "Live activity detected today.",
        icon: Eye,
      },
      {
        label: "Digital assets",
        value: visibleLinks.length + connectedPlatforms.length,
        detail: `${visibleLinks.length} links • ${connectedPlatforms.length} socials`,
        icon: Sparkles,
      },
    ],
    [
      analytics?.todayClicks,
      analytics?.totalClicks,
      connectedPlatforms.length,
      topLink,
      visibleLinks.length,
    ],
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Integrated Header */}
      <section className="relative overflow-hidden rounded-[32px] border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)] p-1">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="p-8 lg:p-12 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-accent-primary)] mb-8">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--saas-accent-primary)] shadow-[0_0_8px_var(--saas-accent-glow)] animate-pulse" />
              Creator Space Control
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--saas-text-primary)] sm:text-5xl lg:max-w-xl leading-[1.1]">
              Elevate your digital presence
            </h1>
            <p className="mt-6 max-w-lg text-sm font-medium leading-relaxed text-[var(--saas-text-secondary)]">
              Your central hub for profile orchestration. Track audience signals, refine your visual mood, and manage high-impact links with precision.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={getPublicProfileUrl(userData?.username)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-2xl bg-[var(--saas-accent-gradient)] px-8 text-sm font-bold text-white transition-all hover:scale-105 shadow-lg shadow-[var(--saas-accent-glow)]/20"
              >
                Go Live
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <Link
                to="/dashboard/my-page"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] px-8 text-sm font-bold text-[var(--saas-text-primary)] transition-all hover:bg-[var(--saas-bg-elevated)]"
              >
                Custom Design
              </Link>
            </div>
          </div>

          <div className="bg-[var(--saas-bg-surface)]/50 border-l border-[var(--saas-border)] p-8 lg:p-10 relative">
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-5 relative group">
                    <div className="h-16 w-16 shrink-0 relative">
                        <div className="absolute inset-0 rounded-2xl bg-[var(--saas-accent-gradient)] opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-[var(--saas-border)] bg-[var(--saas-bg-main)]">
                            {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={userData?.name || userData?.username || "Creator avatar"}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                            />
                            ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl font-black text-white bg-[var(--saas-accent-gradient)]">
                                {(userData?.username || userData?.name || "L").charAt(0).toUpperCase()}
                            </div>
                            )}
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xl font-extrabold text-[var(--saas-text-primary)] truncate tracking-tight">
                        {userData?.name || "Elite Creator"}
                        </p>
                        <p className="text-sm font-bold text-[var(--saas-accent-primary)] tracking-wide">
                        @{userData?.username || "username"}
                        </p>
                    </div>
                </div>

                <div className="mt-auto space-y-4 pt-8">
                    <div className="rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-main)]/50 p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--saas-text-secondary)]">Public Identity</p>
                        <p className="mt-2 truncate text-sm font-bold text-[var(--saas-text-primary)]">
                            linkhub.to/{userData?.username || "username"}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-main)]/30 p-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)]">Active Links</p>
                            <p className="mt-1 text-2xl font-black text-[var(--saas-text-primary)] tracking-tighter">
                            {visibleLinks.length}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-main)]/30 p-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)]">Platforms</p>
                            <p className="mt-1 text-2xl font-black text-[var(--saas-text-primary)] tracking-tighter">
                            {connectedPlatforms.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle branding element */}
            <div className="absolute top-4 right-4 text-[var(--saas-text-secondary)]/10 text-4xl font-black italic select-none pointer-events-none">PRO</div>
          </div>
        </div>

        {/* Dynamic background element */}
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] bg-[var(--saas-accent-primary)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Metric Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {metricCards.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      {/* Mixed Content Grid */}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <SocialStatsCard
          userData={userData}
          socialPreviewData={socialPreviewData}
        />
        <QuickActionsCard />
      </div>

      {/* Full Width Analytics Pulse */}
      <AnalyticsSummaryCard analytics={analytics} />
    </div>
  );
}

