import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Activity, MousePointer2, Smartphone, Trophy } from "lucide-react";
import DashboardCard from "../../Components/dashboard/DashboardCard";
import MetricCard from "../../Components/dashboard/MetricCard";
import { formatCompactNumber } from "../../Components/dashboard/dashboardUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

function buildChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(148, 163, 184, 0.08)" },
        ticks: { color: "rgba(226, 232, 240, 0.55)", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(148, 163, 184, 0.08)" },
        ticks: { color: "rgba(226, 232, 240, 0.55)", font: { size: 11 } },
      },
    },
  };
}

export default function DashboardAnalytics({ analytics }) {
  const chartOptions = buildChartOptions();
  const deviceStats = (analytics?.deviceStats || []).reduce((result, item) => {
    result[item.device] = item.clicks;
    return result;
  }, {});

  const clicksChartData = {
    labels: (analytics?.clicksPerDay || []).map((entry) =>
      new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    ),
    datasets: [
      {
        data: (analytics?.clicksPerDay || []).map((entry) => entry.clicks),
        fill: true,
        borderColor: "rgba(99, 102, 241, 0.95)",
        backgroundColor: "rgba(99, 102, 241, 0.14)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        tension: 0.42,
      },
    ],
  };

  const topLinksData = {
    labels: (analytics?.topLinks || []).map((link) =>
      link.title.length > 18 ? `${link.title.slice(0, 18)}...` : link.title,
    ),
    datasets: [
      {
        data: (analytics?.topLinks || []).map((link) => link.clicks),
        backgroundColor: [
          "rgba(99, 102, 241, 0.78)",
          "rgba(34, 197, 94, 0.78)",
          "rgba(249, 115, 22, 0.78)",
          "rgba(56, 189, 248, 0.78)",
          "rgba(236, 72, 153, 0.78)",
        ],
        borderRadius: 999,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">Analytics</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          See which links are earning attention and where momentum is building
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
          Keep the dashboard focused on signal over noise with a clear trend line,
          fast metrics, and a top-link leaderboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          icon={MousePointer2}
          label="Total clicks"
          value={analytics?.totalClicks || 0}
          detail="Every recorded click across your public page."
          accent="#6366F1"
        />
        <MetricCard
          icon={Activity}
          label="Today's visits"
          value={analytics?.todayClicks || 0}
          detail="Fresh traffic coming in today."
          accent="#22C55E"
        />
        <MetricCard
          icon={Smartphone}
          label="Mobile clicks"
          value={deviceStats.mobile || 0}
          detail="Audience sessions from phones and tablets."
          accent="#0EA5E9"
        />
        <MetricCard
          icon={Trophy}
          label="Top link"
          value={analytics?.topLinks?.[0]?.clicks || 0}
          detail={analytics?.topLinks?.[0]?.title || "No top performer yet."}
          accent="#F97316"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <DashboardCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Traffic trend</p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                Clicks over the last 30 days
              </h3>
            </div>
            <div className="rounded-full border border-[var(--card-border)] bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              {analytics?.clicksPerDay?.length || 0} data points
            </div>
          </div>
          <div className="mt-6 h-[320px]">
            {analytics?.clicksPerDay?.length ? (
              <Line data={clicksChartData} options={chartOptions} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-[24px] border border-dashed border-[var(--card-border)] text-sm text-[var(--text-muted)]">
                No click history yet.
              </div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard>
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Leaderboard</p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
              Top performing links
            </h3>
          </div>
          <div className="mt-6 h-[320px]">
            {analytics?.topLinks?.length ? (
              <Bar data={topLinksData} options={chartOptions} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-[24px] border border-dashed border-[var(--card-border)] text-sm text-[var(--text-muted)]">
                Publish links to unlock the leaderboard.
              </div>
            )}
          </div>
          <div className="mt-6 space-y-3">
            {(analytics?.topLinks || []).slice(0, 3).map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-[22px] border border-[var(--card-border)] bg-white/5 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                    {link.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{link.url}</p>
                </div>
                <div className="text-sm font-medium text-[var(--text-primary)]">
                  {formatCompactNumber(link.clicks)}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
