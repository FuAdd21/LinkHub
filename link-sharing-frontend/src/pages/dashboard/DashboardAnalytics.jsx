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

  const totalViews = analytics?.totalViews ?? 24892;
  const totalClicks = analytics?.totalClicks ?? 10418;
  const clickRate = analytics?.clickRate ?? "41.85";
  const totalFollowers = analytics?.totalFollowers ?? "2.84M";

  const deltas = analytics?.deltas || {
    views: "+12.8%",
    clicks: "+18.3%",
    rate: "+4.1%",
    followers: "+3.8%",
  };

  // Audience platforms breakdown
  const audienceBreakdown = analytics?.audienceBreakdown || [
    { platform: "TikTok", count: "1.60M", color: "#c6f035", raw: 1600 },
    { platform: "YouTube", count: "842K", color: "#00d2ff", raw: 842 },
    { platform: "Instagram", count: "386K", color: "#ff8c42", raw: 386 },
    { platform: "GitHub", count: "18.4K", color: "#f43f5e", raw: 18.4 },
  ];

  // Daily growth chart data
  const rawClicksPerDay = analytics?.clicksPerDay || [];
  const rawViewsPerDay = analytics?.viewsPerDay || [];

  const dates = rawClicksPerDay.length > 0
    ? rawClicksPerDay.map((d) =>
        new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      )
    : ["1 Aug", "6 Aug", "11 Aug", "16 Aug", "21 Aug", "26 Aug", "31 Aug"];

  const viewsData = rawViewsPerDay.length > 0
    ? rawViewsPerDay.map((v) => v.views)
    : [380, 520, 480, 720, 690, 890, 1150];

  const clicksData = rawClicksPerDay.length > 0
    ? rawClicksPerDay.map((c) => c.clicks)
    : [150, 210, 190, 310, 280, 390, 510];

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
  const topLinks = analytics?.topLinks || [
    { title: "GitHub toolkit", clicks: 4286, conversionRate: "38.7%", avgTime: "01:42", change: "+18.4%" },
    { title: "YouTube channel", clicks: 3104, conversionRate: "31.2%", avgTime: "02:18", change: "+11.7%" },
    { title: "Instagram", clicks: 1879, conversionRate: "24.8%", avgTime: "00:58", change: "+6.2%" },
    { title: "Notes", clicks: 986, conversionRate: "18.4%", avgTime: "03:06", change: "+4.8%" },
  ];

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
            Views
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
            {Number(totalViews).toLocaleString()}
          </div>
          <div className="text-right text-[11px] font-mono font-bold text-[#c6f035]">
            {deltas.views || "+12.8%"}
          </div>
        </div>

        {/* Card 2: Clicks */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#13120D] border border-white/5 flex flex-col justify-between space-y-2">
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Clicks
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
            {Number(totalClicks).toLocaleString()}
          </div>
          <div className="text-right text-[11px] font-mono font-bold text-[#c6f035]">
            {deltas.clicks || "+18.3%"}
          </div>
        </div>

        {/* Card 3: Click Rate */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#13120D] border border-white/5 flex flex-col justify-between space-y-2">
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Click Rate
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
            {clickRate}%
          </div>
          <div className="text-right text-[11px] font-mono font-bold text-[#c6f035]">
            {deltas.rate || "+4.1%"}
          </div>
        </div>

        {/* Card 4: Followers */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#13120D] border border-white/5 flex flex-col justify-between space-y-2">
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Followers
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
            {totalFollowers}
          </div>
          <div className="text-right text-[11px] font-mono font-bold text-[#c6f035]">
            {deltas.followers || "+3.8%"}
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

          {/* On Mobile: Left total + Right Platform list side by side (matching mobile-03 screenshot) */}
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
        </div>

        {/* Top Destinations Card (Matching tablet-03 and desktop) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#13120D] border border-white/5 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Top Destinations
          </span>

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
        </div>
      </div>
    </div>
  );
}
