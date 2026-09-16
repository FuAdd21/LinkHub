import { useState } from "react";
import { ChevronDown } from "lucide-react";
import MetricsGrid from "../../Components/dashboard/MetricsGrid/MetricsGrid";
import AudienceActivityChart from "../../Components/dashboard/AudienceActivityChart/AudienceActivityChart";
import DeviceMixChart from "../../Components/dashboard/DeviceMixChart/DeviceMixChart";
import TopDestinations from "../../Components/dashboard/TopDestinations/TopDestinations";
import LiveActivityFeed from "../../Components/dashboard/LiveActivityFeed/LiveActivityFeed";

export default function DashboardOverview({
  userData,
  links = [],
  analytics = {},
}) {
  const [period, setPeriod] = useState("Last 30 days");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const periods = ["Last 7 days", "Last 30 days", "Last 90 days"];

  // Format today's date (e.g., "Wednesday, September 16")
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <p className="text-xs font-medium text-[#7c857c] mb-1">
            {formattedDate}
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Your audience is moving.
          </h2>
          <p className="text-xs sm:text-sm text-[#8a918a] mt-1">
            See what is gaining attention and where your next opportunity is forming.
          </p>
        </div>

        {/* Period Selector Dropdown */}
        <div className="relative self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141714] border border-white/10 text-xs font-semibold text-white hover:border-white/20 transition-all"
          >
            <span>{period}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showPeriodDropdown && (
            <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-[#181c18] border border-white/10 p-1 shadow-2xl z-20">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPeriod(p);
                    setShowPeriodDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    period === p
                      ? "bg-[#c6f035]/15 text-[#c6f035] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 1: 4-Metric Grid */}
      <section aria-label="Key Performance Metrics">
        <MetricsGrid analytics={analytics} />
      </section>

      {/* Row 2: Audience Activity & Device Mix */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <AudienceActivityChart analytics={analytics} />
        </div>
        <div className="lg:col-span-4">
          <DeviceMixChart analytics={analytics} />
        </div>
      </section>

      {/* Row 3: Top Destinations & Live Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <TopDestinations links={links} analytics={analytics} />
        </div>
        <div className="lg:col-span-4">
          <LiveActivityFeed analytics={analytics} />
        </div>
      </section>
    </div>
  );
}
