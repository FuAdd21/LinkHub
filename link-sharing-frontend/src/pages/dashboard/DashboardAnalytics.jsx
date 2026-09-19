import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCompactNumber } from "../../Components/dashboard/dashboardUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardAnalytics({ analytics, userData }) {
  const [timeframe, setTimeframe] = useState("30");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const totalViews = analytics?.totalViews ?? 0;
  const totalClicks = analytics?.totalClicks ?? 0;
  const clickRate = analytics?.effectiveCtr ?? analytics?.clickRate ?? "0.0";
  const totalEngagement = analytics?.totalEngagement ?? totalClicks;
  const breakdown = analytics?.breakdown || {
    links: totalClicks,
    cta: 0,
    projects: 0,
  };
  const ctaClicks = breakdown.cta || 0;
  const projectClicks = breakdown.projects || 0;
  const linkClicks = breakdown.links || totalClicks;

  const totalFollowers = analytics?.totalFollowers || (userData?.totalAudienceFormatted ? `${userData.totalAudienceFormatted}` : "0");

  const deltas = analytics?.deltas || {
    views: "+0.0%",
    clicks: "+0.0%",
    rate: "+0.0%",
    followers: "+0.0%",
  };

  // Audience platforms breakdown from real integrations
  const audienceBreakdown = Array.isArray(analytics?.audienceBreakdown)
    ? analytics.audienceBreakdown
    : [];

  // Daily growth chart data
  const rawClicksPerDay = analytics?.clicksPerDay || [];
  const rawViewsPerDay = analytics?.viewsPerDay || [];
  const hasDailyData = rawClicksPerDay.length > 0 || rawViewsPerDay.length > 0;

  const defaultDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const dates = hasDailyData
    ? (rawClicksPerDay.length > 0 ? rawClicksPerDay : rawViewsPerDay).map((d) =>
        new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      )
    : defaultDates;

  const viewsData = rawViewsPerDay.length > 0
    ? rawViewsPerDay.map((v) => Number(v.views) || 0)
    : Array(dates.length).fill(0);

  const clicksData = rawClicksPerDay.length > 0
    ? rawClicksPerDay.map((c) => Number(c.clicks) || 0)
    : Array(dates.length).fill(0);

  const lineChartData = {
    labels: dates,
    datasets: [
      {
        label: "Views",
        data: viewsData,
        borderColor: "#c6f035",
        backgroundColor: "rgba(198, 240, 53, 0.05)",
        borderWidth: 2.5,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#c6f035",
        pointHoverBorderColor: "#0B0A07",
      },
      {
        label: "Clicks",
        data: clicksData,
        borderColor: "#00d2ff",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#00d2ff",
        pointHoverBorderColor: "#0B0A07",
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#161510",
        titleColor: "#ffffff",
        bodyColor: "#c6f035",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 10, family: "IBM Plex Mono, monospace" } },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { display: false },
        border: { display: false },
      },
    },
  };

  // Donut chart data
  const donutData = {
    labels: audienceBreakdown.map((a) => a.platform),
    datasets: [
      {
        data: audienceBreakdown.map((a) => a.raw),
        backgroundColor: audienceBreakdown.map((a) => a.color),
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#161510",
        titleColor: "#ffffff",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 8,
        cornerRadius: 8,
      },
    },
  };

  // Destination Performance Rows from real topLinks
  const topLinks = Array.isArray(analytics?.topLinks) ? analytics.topLinks : [];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Understand your profile reach, visitor demographics, and destination traffic.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="relative self-start sm:self-auto">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-3.5 py-2 rounded-lg bg-[#13120D] border border-white/10 text-[#c6f035] font-mono font-bold text-xs hover:border-[#c6f035]/40 flex items-center gap-2 transition-all shadow-sm"
          >
            <span>Last {timeframe} days</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-10 w-36 rounded-xl bg-[#161510] border border-white/10 shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
              {["7", "30", "90"].map((days) => (
                <button
                  key={days}
                  onClick={() => {
                    setTimeframe(days);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs font-medium hover:bg-white/5 ${
                    timeframe === days ? "text-[#c6f035] font-bold" : "text-slate-300"
                  }`}
                >
                  Last {days} days
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4 Metric Cards: 2x2 on Mobile, 1x4 on Tablet/Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Views */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#13120D] border border-white/5 flex flex-col justify-between space-y-2">
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Profile Views
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
            {Number(totalViews).toLocaleString()}
          </div>
          <div className="text-right text-[11px] font-mono font-bold text-[#c6f035]">
            {deltas.views || "+0.0%"}
          </div>
        </div>

        {/* Card 2: Total Engagement */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#13120D] border border-white/5 flex flex-col justify-between space-y-2">
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Total Interactions
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
            {Number(totalEngagement).toLocaleString()}
          </div>
          <div className="text-right text-[11px] font-mono font-bold text-[#00d2ff]">
            {deltas.clicks || "+0.0%"}
          </div>
        </div>

        {/* Card 3: Effective CTR */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#13120D] border border-white/5 flex flex-col justify-between space-y-2">
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Effective CTR
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
            {clickRate}%
          </div>
          <div className="text-right text-[11px] font-mono font-bold text-[#c6f035]">
            {deltas.rate || "+0.0%"}
          </div>
        </div>

        {/* Card 4: Primary CTA Conversions */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#13120D] border border-white/5 flex flex-col justify-between space-y-2">
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Primary CTA Clicks
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight text-[#c6f035]">
            {Number(ctaClicks).toLocaleString()}
          </div>
          <div className="text-right text-[11px] font-mono font-bold text-slate-500">
            Goal action
          </div>
        </div>
      </div>

      {/* Engagement Channels Breakdown Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#13120D] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Engagement Channels Breakdown
          </span>
          <span className="text-xs font-mono text-zinc-500">
            {totalEngagement} total actions
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden flex">
          <div
            style={{ width: `${totalEngagement > 0 ? (linkClicks / totalEngagement) * 100 : 0}%` }}
            className="h-full bg-[#00d2ff] transition-all"
            title={`Links: ${linkClicks}`}
          />
          <div
            style={{ width: `${totalEngagement > 0 ? (ctaClicks / totalEngagement) * 100 : 0}%` }}
            className="h-full bg-[#c6f035] transition-all"
            title={`Primary CTA: ${ctaClicks}`}
          />
          <div
            style={{ width: `${totalEngagement > 0 ? (projectClicks / totalEngagement) * 100 : 0}%` }}
            className="h-full bg-[#f43f5e] transition-all"
            title={`Projects: ${projectClicks}`}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#00d2ff]" />
            <span className="text-slate-400">Links:</span>
            <span className="text-white font-bold">{linkClicks}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#c6f035]" />
            <span className="text-slate-400">Primary CTA:</span>
            <span className="text-white font-bold">{ctaClicks}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f43f5e]" />
            <span className="text-slate-400">Projects:</span>
            <span className="text-white font-bold">{projectClicks}</span>
          </div>
        </div>
      </div>

      {/* Audience Growth Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#13120D] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Audience Growth
          </span>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-0.5 bg-[#c6f035] rounded-full" />
              <span>Views</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-0.5 bg-[#00d2ff] rounded-full" />
              <span>Clicks</span>
            </div>
          </div>
        </div>

        <div className="h-48 sm:h-64 w-full pt-2">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* Bottom Section: Audience Mix & Top Destinations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audience Mix Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#13120D] border border-white/5 flex flex-col justify-between space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Audience Mix
          </span>

          {audienceBreakdown.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <p className="text-xs font-mono text-slate-400">
                No audience platforms connected yet
              </p>
              <p className="text-[11px] font-mono text-slate-600 max-w-xs mx-auto">
                Connect your YouTube, GitHub, Telegram, LinkedIn, or X channels in Integrations to visualize your live audience mix.
              </p>
            </div>
          ) : (
            <>
              {/* On Tablet & Desktop: Show Donut Chart in Center */}
              <div className="hidden md:flex flex-col items-center space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-white font-mono tracking-tight">
                    {totalFollowers}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    combined followers
                  </div>
                </div>

                <div className="relative w-40 h-40">
                  <Doughnut data={donutData} options={donutOptions} />
                </div>
              </div>

              {/* On Mobile: Left total + Right Platform list side by side */}
              <div className="flex md:hidden items-center justify-between gap-4">
                <div>
                  <div className="text-3xl font-black text-white font-mono tracking-tight">
                    {totalFollowers}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    combined followers
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-mono min-w-[130px]">
                  {audienceBreakdown.map((item) => (
                    <div key={item.platform} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.platform}</span>
                      </div>
                      <span className="text-white font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tablet & Desktop Platform list at bottom */}
              <div className="hidden md:grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                {audienceBreakdown.map((item) => (
                  <div key={item.platform} className="flex items-center justify-between p-2 rounded-lg bg-[#161510] border border-white/5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.platform}</span>
                    </div>
                    <span className="text-white font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top Destinations Card (Matching tablet-03 and desktop) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#13120D] border border-white/5 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Top Destinations
          </span>

          {topLinks.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <p className="text-xs font-mono text-slate-400">
                No destination links recorded yet
              </p>
              <p className="text-[11px] font-mono text-slate-600 max-w-xs mx-auto">
                Add links in the Links tab to track real visitor clicks and conversion rates.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 pt-1">
              {topLinks.map((link, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {link.title}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      {(Number(link.clicks) || 0).toLocaleString()} clicks
                    </p>
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#c6f035] shrink-0">
                    {link.conversionRate || "0.0%"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
