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
          <h3 className="text-sm font-medium text-neutral-100">
            Connected platforms
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Social reach and metrics
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400">
          <Share2 className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-6 space-y-2">
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
                className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-2.5 hover:bg-neutral-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 bg-[#0a0a0a] text-neutral-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-200">
                      {platform.label}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {primaryCount
                        ? `${formatCompactNumber(primaryCount)} audience`
                        : "Connected"}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-neutral-500">
                  <p>
                    {secondaryCount
                      ? formatCompactNumber(secondaryCount)
                      : "Live"}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-600">
                    active
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-neutral-800 bg-neutral-900/30 text-xs text-neutral-500">
            Connect social accounts to view stats.
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
      description: "Launch a new destination",
      to: "/dashboard/links",
      icon: Link2,
    },
    {
      label: "Connect Social",
      description: "Pull follower stats",
      to: "/dashboard/socials",
      icon: Share2,
    },
    {
      label: "Change Theme",
      description: "Switch the mood",
      to: "/dashboard/themes",
      icon: Palette,
    },
  ];

  return (
    <DashboardCard className="h-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-neutral-100">
            Quick actions
          </h3>
          <p className="mt-1 text-xs text-neutral-500">Manage your page</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.label}
              to={action.to}
              className="group flex flex-1 items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-2.5 transition-colors hover:bg-neutral-900/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 bg-[#0a0a0a] text-neutral-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200">
                    {action.label}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {action.description}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-500 transition group-hover:text-neutral-200" />
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
          <h3 className="text-sm font-medium text-neutral-100">
            Analytics pulse
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Your traffic trend for the last 30 days
          </p>
          <p className="mt-2 text-xs leading-5 text-neutral-600">
            Watch click momentum, daily visits, and the destination currently
            doing the most work.
          </p>
        </div>
        <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-2 text-xs text-neutral-500">
          Top link:{" "}
          <span className="font-medium text-neutral-200">
            {topLink?.title || "No clicks yet"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <MiniTrendChart data={analytics?.clicksPerDay || []} />
        <div className="grid gap-3">
          <div className="rounded-md border border-neutral-800 bg-neutral-900/30 p-4">
            <p className="text-[10px] uppercase tracking-wider text-neutral-500">
              Total clicks
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-100">
              {formatCompactNumber(analytics?.totalClicks || 0)}
            </p>
          </div>
          <div className="rounded-md border border-neutral-800 bg-neutral-900/30 p-4">
            <p className="text-[10px] uppercase tracking-wider text-neutral-500">
              Today
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-100">
              {formatCompactNumber(analytics?.todayClicks || 0)}
            </p>
          </div>
          <Link
            to="/dashboard/analytics"
            className="flex items-center justify-between rounded-md border border-neutral-800 bg-[#0a0a0a] px-3 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-900/50"
          >
            Open full analytics
            <ArrowUpRight className="h-4 w-4 text-neutral-500" />
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
            <div className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Overview
            </div>
            <h1 className="mt-5 max-w-2xl text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
              Manage your creator page
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
              Everything important is surfaced here: audience signals, page
              polish, quick next actions, and a clean path to the parts of
              LinkHub you edit most.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={getPublicProfileUrl(userData?.username)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-neutral-100 px-4 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
              >
                View Public Page
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                to="/dashboard/my-page"
                className="inline-flex h-9 items-center justify-center rounded-md border border-neutral-800 bg-transparent px-4 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-900"
              >
                Update My Page
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-neutral-800 bg-neutral-900/30 p-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-neutral-800 bg-[#0a0a0a]">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={
                      userData?.name || userData?.username || "Creator avatar"
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-neutral-500">
                    {(userData?.username || userData?.name || "L")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-200 truncate">
                  @{userData?.username || "creator"}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 line-clamp-2">
                  {userData?.bio ||
                    "Add a short creator bio to introduce your page."}
                </p>
              </div>
            </div>
            <div className="mt-5 rounded-md border border-neutral-800 bg-[#0a0a0a] p-3">
              <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                Public URL
              </p>
              <p className="mt-1 truncate text-xs font-medium text-neutral-300">
                linkhub.com/{userData?.username || "username"}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-neutral-800 bg-neutral-900/30 p-3">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                  Links live
                </p>
                <p className="mt-1 text-lg font-semibold text-neutral-200">
                  {visibleLinks.length}
                </p>
              </div>
              <div className="rounded-md border border-neutral-800 bg-neutral-900/30 p-3">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                  Platforms
                </p>
                <p className="mt-1 text-lg font-semibold text-neutral-200">
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
