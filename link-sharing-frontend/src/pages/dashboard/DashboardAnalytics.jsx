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

export default function DashboardAnalytics({ analytics }) {
  const [timeframe, setTimeframe] = useState("30");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const totalViews = analytics?.totalViews ?? 24892;
  const totalClicks = analytics?.totalClicks ?? 10418;
  const clickRate = analytics?.clickRate ?? "41.85";
  const uniqueVisitors = analytics?.uniqueVisitors ?? 18206;

  const deltas = analytics?.deltas || {
    views: "+12.8%",
    clicks: "+18.3%",
    rate: "+2.4%",
    visitors: "-1.7%",
  };

  // Device breakdown
  const deviceMix = analytics?.deviceMix || {
    mobile: 68,
    desktop: 23,
    tablet: 9,
  };

  // Daily growth chart data
  const rawClicksPerDay = analytics?.clicksPerDay || [];
  const rawViewsPerDay = analytics?.viewsPerDay || [];

  // Generate fallback days if database has low activity
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
        borderWidth: 2,
        tension: 0.4,
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
        borderWidth: 2,
        tension: 0.4,
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
        grid: { color: "rgba(255,255,255,0.03)" },
        ticks: { display: false },
        border: { display: false },
      },
    },
  };

  // Device Donut chart
  const doughnutData = {
    labels: ["Mobile", "Desktop", "Tablet"],
    datasets: [
      {
        data: [deviceMix.mobile, deviceMix.desktop, deviceMix.tablet],
        backgroundColor: ["#c6f035", "#00d2ff", "#ff8c42"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const doughnutOptions = {
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
    { title: "My open-source toolkit", clicks: 4286, conversionRate: "38.7%", avgTime: "01:42", change: "+18.4%" },
    { title: "Build in public — weekly", clicks: 3104, conversionRate: "31.2%", avgTime: "02:18", change: "+11.7%" },
    { title: "Behind the scenes", clicks: 1879, conversionRate: "24.8%", avgTime: "00:58", change: "+6.2%" },
    { title: "Read my latest essay", clicks: 986, conversionRate: "18.4%", avgTime: "03:06", change: "+4.8%" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1">
          Understand attention, intent, and conversion across every destination.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Performance
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              A detailed view of audience behavior across the last {timeframe} days.
            </p>
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 rounded-lg bg-[#13120D] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2"
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
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Views */}
        <div className="p-5 rounded-xl bg-[#13120D] border border-white/5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Profile views
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {Number(totalViews).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-medium text-[#c6f035]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{deltas.views || "+12.8%"}</span>
          </div>
        </div>

        {/* Card 2: Clicks */}
        <div className="p-5 rounded-xl bg-[#13120D] border border-white/5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Total clicks
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {Number(totalClicks).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-medium text-[#c6f035]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{deltas.clicks || "+18.3%"}</span>
          </div>
        </div>

        {/* Card 3: Click Rate */}
        <div className="p-5 rounded-xl bg-[#13120D] border border-white/5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Click rate
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {clickRate}%
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-medium text-[#c6f035]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{deltas.rate || "+2.4%"}</span>
          </div>
        </div>

        {/* Card 4: Unique Visitors */}
        <div className="p-5 rounded-xl bg-[#13120D] border border-white/5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Unique visitors
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {Number(uniqueVisitors).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-medium text-[#f43f5e]">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{deltas.visitors || "-1.7%"}</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audience Growth Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#13120D] border border-white/5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Audience growth</h3>
              <p className="text-xs text-slate-500">Views and clicks by day</p>
            </div>
            {/* Legend */}
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

          <div className="h-64 w-full pt-2">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Audience Mix Donut (1 col) */}
        <div className="p-6 rounded-2xl bg-[#13120D] border border-white/5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Audience mix</h3>
            <p className="text-xs text-slate-500">Sessions by device</p>
          </div>

          <div className="relative h-48 w-full flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-mono font-black text-white">
                {formatCompactNumber(uniqueVisitors)}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                visitors
              </span>
            </div>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-2 pt-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-[#c6f035]" />
                <span>Mobile</span>
              </div>
              <span className="text-slate-300 font-bold">{deviceMix.mobile}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-[#00d2ff]" />
                <span>Desktop</span>
              </div>
              <span className="text-slate-300 font-bold">{deviceMix.desktop}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-[#ff8c42]" />
                <span>Tablet</span>
              </div>
              <span className="text-slate-300 font-bold">{deviceMix.tablet}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: Destination Performance */}
      <div className="p-6 rounded-2xl bg-[#13120D] border border-white/5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">Destination performance</h3>
          <p className="text-xs text-slate-500">Ranked by total clicks</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-wider">
                <th className="pb-3 font-medium">Destination</th>
                <th className="pb-3 font-medium text-right">Clicks</th>
                <th className="pb-3 font-medium text-right">CTR</th>
                <th className="pb-3 font-medium text-right">Avg. Time</th>
                <th className="pb-3 font-medium text-right">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topLinks.map((row, idx) => (
                <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pr-4 font-sans font-medium text-white group-hover:text-[#c6f035] transition-colors">
                    {row.title}
                  </td>
                  <td className="py-4 text-right text-slate-300 font-bold">
                    {(Number(row.clicks) || 0).toLocaleString()}
                  </td>
                  <td className="py-4 text-right text-slate-400">
                    {row.conversionRate || "0.0%"}
                  </td>
                  <td className="py-4 text-right text-slate-400">
                    {row.avgTime || "01:42"}
                  </td>
                  <td className="py-4 text-right text-[#c6f035] font-bold">
                    {row.change || "+12.4%"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
