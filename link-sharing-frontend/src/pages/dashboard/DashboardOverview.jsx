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
import MetricCard from "../../Components/dashboard/MetricCard";
import MiniTrendChart from "../../Components/dashboard/MiniTrendChart";
import {
  formatCompactNumber,
  getAvatarUrl,
  getConnectedPlatforms,
  getPublicProfileUrl,
  getVisibleLinks,
} from "../../Components/dashboard/dashboardUtils";

function SocialStatsCard({ userData, socialPreviewData }) {
  const connectedPlatforms = getConnectedPlatforms(userData);

  return (
    <DashboardCard className="h-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Social reach
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
            Your connected platforms
          </h3>
        </div>
        <div className="dashboard-accent-icon-secondary h-12 w-12">
          <Share2 className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
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
                className="flex items-center justify-between rounded-[22px] border border-[var(--card-border)] bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${platform.color}18` }}
                  >
                    <Icon
                      className="h-4.5 w-4.5"
                      style={{ color: platform.color }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {platform.label}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {primaryCount
                        ? `${formatCompactNumber(primaryCount)} audience`
                        : "Connected and ready"}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-[var(--text-muted)]">
                  <p>
                    {secondaryCount
                      ? formatCompactNumber(secondaryCount)
                      : "Live"}
                  </p>
                  <p className="mt-1 uppercase tracking-[0.2em]">active</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[24px] border border-dashed border-[var(--card-border)] px-4 py-8 text-center text-sm text-[var(--text-muted)]">
            Connect social accounts to surface richer creator stats here.
          </div>
        )}
      </div>
    </DashboardCard>
  );
}

function QuickActionsCard() {
  const actions = [
    {
      label: "Add New Link",
      description: "Launch a new destination and keep the preview current.",
      to: "/dashboard/links",
      icon: Link2,
      accent: "#9333EA",
    },
    {
      label: "Connect Social Account",
      description: "Pull follower stats into your creator dashboard.",
      to: "/dashboard/socials",
      icon: Share2,
      accent: "#EC4899",
    },
    {
      label: "Change Theme",
      description: "Switch the mood and polish of your public page.",
      to: "/dashboard/themes",
      icon: Palette,
      accent: "#F97316",
    },
  ];

  return (
    <DashboardCard className="h-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Quick actions
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
            Move your page forward fast
          </h3>
        </div>
        <div className="dashboard-accent-icon h-12 w-12">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.label}
              to={action.to}
              className="group flex items-center justify-between rounded-[24px] border border-[var(--card-border)] bg-white/5 px-4 py-4 transition hover:border-white/20 hover:bg-white/8"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: `${action.accent}18`,
                    color: action.accent,
                  }}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {action.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {action.description}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] transition group-hover:text-[var(--text-primary)]" />
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
    <DashboardCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Analytics pulse
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
            Your traffic trend for the last 30 days
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Watch click momentum, daily visits, and the destination currently
            doing the most work for your creator funnel.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-white/5 px-4 py-3 text-sm text-[var(--text-muted)]">
          Top link:{" "}
          <span className="font-semibold text-[var(--text-primary)]">
            {topLink?.title || "No clicks yet"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <MiniTrendChart data={analytics?.clicksPerDay || []} />
        <div className="grid gap-3">
          <div className="rounded-[24px] border border-[var(--card-border)] bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Total clicks
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              {formatCompactNumber(analytics?.totalClicks || 0)}
            </p>
          </div>
          <div className="rounded-[24px] border border-[var(--card-border)] bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Today
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              {formatCompactNumber(analytics?.todayClicks || 0)}
            </p>
          </div>
          <Link
            to="/dashboard/analytics"
            className="dashboard-highlight-panel flex items-center justify-between rounded-[24px] px-4 py-4 text-sm font-medium text-[var(--text-primary)] transition hover:border-white/20"
          >
            Open full analytics
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
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
        label: "Total clicks",
        value: analytics?.totalClicks || 0,
        detail: topLink
          ? `${topLink.title} is your top performer.`
          : "No click data yet.",
        icon: MousePointer2,
        accent: "#9333EA",
      },
      {
        label: "Today's visits",
        value: analytics?.todayClicks || 0,
        detail: "Fresh audience activity from today.",
        icon: Eye,
        accent: "#EC4899",
      },
      {
        label: "Visible links",
        value: visibleLinks.length,
        detail: `${connectedPlatforms.length} social account${connectedPlatforms.length === 1 ? "" : "s"} connected.`,
        icon: TrendingUp,
        accent: "#F97316",
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
    <div className="space-y-6">
      <DashboardCard className="overflow-hidden p-0">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-8">
          <div>
            <div className="dashboard-accent-badge px-3 py-1 text-xs uppercase tracking-[0.24em]">
              Creator dashboard
            </div>
            <h1 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Manage your creator page with clarity, speed, and fewer clicks.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              Everything important is surfaced here: audience signals, page
              polish, quick next actions, and a clean path to the parts of
              LinkHub you edit most.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={getPublicProfileUrl(userData?.username)}
                target="_blank"
                rel="noopener noreferrer"
                className="dashboard-primary-button"
              >
                View Public Page
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                to="/dashboard/my-page"
                className="dashboard-secondary-button"
              >
                Update My Page
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--card-border)] bg-white/5 p-5">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={
                      userData?.name || userData?.username || "Creator avatar"
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-[var(--text-primary)]">
                    {(userData?.username || userData?.name || "L")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  @{userData?.username || "creator"}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {userData?.bio ||
                    "Add a short creator bio to introduce your page."}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-[24px] border border-[var(--card-border)] bg-[var(--bg-primary)]/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Public URL
              </p>
              <p className="mt-2 truncate text-sm font-medium text-[var(--text-primary)]">
                linkhub.com/{userData?.username || "username"}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[24px] border border-[var(--card-border)] bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Links live
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                  {visibleLinks.length}
                </p>
              </div>
              <div className="rounded-[24px] border border-[var(--card-border)] bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Platforms
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                  {connectedPlatforms.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-3">
        {metricCards.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <SocialStatsCard
          userData={userData}
          socialPreviewData={socialPreviewData}
        />
        <QuickActionsCard />
      </div>

      <AnalyticsSummaryCard analytics={analytics} />
    </div>
  );
}
