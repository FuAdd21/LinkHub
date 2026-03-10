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
        backgroundColor: "var(--bg-primary, #ffffff)",
        titleColor: "var(--text-primary, #171717)",
        bodyColor: "var(--text-secondary, #737373)",
        borderColor: "var(--card-border, #e5e7eb)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "var(--text-muted, #a3a3a3)", font: { size: 12 } },
        border: { display: false },
      },
      y: {
        grid: { color: "var(--card-border, #e5e7eb)", borderDash: [4, 4] },
        ticks: { color: "var(--text-muted, #a3a3a3)", font: { size: 12 } },
        border: { display: false },
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
        borderColor: "var(--text-primary, #171717)",
        backgroundColor: "rgba(23, 23, 23, 0.03)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "var(--bg-primary, #ffffff)",
        pointBorderColor: "var(--text-primary, #171717)",
        pointBorderWidth: 2,
        tension: 0.2,
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
        backgroundColor: "var(--text-primary, #171717)",
        hoverBackgroundColor: "var(--text-secondary, #404040)",
        borderRadius: 4,
        barThickness: 32,
        maxBarThickness: 40,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          Analytics
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          See which links are earning attention and where momentum is building
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
          Keep the dashboard focused on signal over noise with a clear trend
          line, fast metrics, and a top-link leaderboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          icon={MousePointer2}
          label="Total clicks"
          value={analytics?.totalClicks || 0}
          detail="Every recorded click across your public page."
          accent="var(--text-primary, #171717)"
        />
        <MetricCard
          icon={Activity}
          label="Today's visits"
          value={analytics?.todayClicks || 0}
          detail="Fresh traffic coming in today."
          accent="var(--text-primary, #171717)"
        />
        <MetricCard
          icon={Smartphone}
          label="Mobile clicks"
          value={deviceStats.mobile || 0}
          detail="Audience sessions from phones and tablets."
          accent="var(--text-primary, #171717)"
        />
        <MetricCard
          icon={Trophy}
          label="Top link"
          value={analytics?.topLinks?.[0]?.clicks || 0}
          detail={analytics?.topLinks?.[0]?.title || "No top performer yet."}
          accent="var(--text-primary, #171717)"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <DashboardCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Traffic trend
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                Clicks over the last 30 days
              </h3>
            </div>
            <div className="rounded-md border border-[var(--card-border)] bg-transparent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {analytics?.clicksPerDay?.length || 0} data points
            </div>
          </div>
          <div className="mt-8 h-[320px]">
            {analytics?.clicksPerDay?.length ? (
              <Line data={clicksChartData} options={chartOptions} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[var(--card-border)] text-sm text-[var(--text-muted)]">
                No click history yet.
              </div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard>
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Leaderboard
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
              Top performing links
            </h3>
          </div>
          <div className="mt-8 h-[320px]">
            {analytics?.topLinks?.length ? (
              <Bar data={topLinksData} options={chartOptions} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[var(--card-border)] text-sm text-[var(--text-muted)]">
                Publish links to unlock the leaderboard.
              </div>
            )}
          </div>
          <div className="mt-8 space-y-3">
            {(analytics?.topLinks || []).slice(0, 3).map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-transparent px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                    {link.title}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-[var(--text-muted)]">
                    {link.url}
                  </p>
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
