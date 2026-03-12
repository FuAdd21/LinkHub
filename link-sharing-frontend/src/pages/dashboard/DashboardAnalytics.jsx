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
        backgroundColor: "rgba(10, 10, 10, 0.95)",
        titleColor: "rgba(255, 255, 255, 0.95)",
        bodyColor: "rgba(255, 255, 255, 0.6)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 16,
        displayColors: false,
        cornerRadius: 20,
        titleFont: { size: 14, weight: '900', family: 'Inter' },
        bodyFont: { size: 12, family: 'Inter' },
        backdropBlur: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgba(255, 255, 255, 0.3)", font: { size: 11, weight: '700' } },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.03)", borderDash: [6, 6] },
        ticks: { color: "rgba(255, 255, 255, 0.3)", font: { size: 11, weight: '700' } },
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
        borderColor: "#00f2ff",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(0, 242, 255, 0.15)");
          gradient.addColorStop(1, "rgba(0, 242, 255, 0)");
          return gradient;
        },
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#00f2ff",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const topLinksData = {
    labels: (analytics?.topLinks || []).map((link) =>
      link.title.length > 20 ? `${link.title.slice(0, 20)}...` : link.title,
    ),
    datasets: [
      {
        data: (analytics?.topLinks || []).map((link) => link.clicks),
        backgroundColor: "rgba(255,255,255, 0.9)",
        hoverBackgroundColor: "#00f2ff",
        borderRadius: 12,
        barThickness: 24,
      },
    ],
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="max-w-3xl">
         <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-[var(--saas-accent-primary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-accent-primary)]">Velocity Insights</span>
          </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--saas-text-primary)] sm:text-4xl">
          Trajectory of Influence
        </h1>
        <p className="mt-4 text-[15px] font-medium leading-relaxed text-[var(--saas-text-secondary)]">
          Surface the signal from the noise. Our atmospheric rendering of your data shows exactly where your momentum is accelerating.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={MousePointer2}
          label="Aggregate Interactions"
          value={analytics?.totalClicks || 0}
          detail="Cumulative nodal activity."
          accent="#00f2ff"
        />
        <MetricCard
          icon={Activity}
          label="Circadian Flux"
          value={analytics?.todayClicks || 0}
          detail="Real-time session growth."
          accent="#00f2ff"
        />
        <MetricCard
          icon={Smartphone}
          label="Edge Manifestation"
          value={deviceStats.mobile || 0}
          detail="Mobile-first audience segment."
          accent="#ffffff"
        />
        <MetricCard
          icon={Trophy}
          label="Peak Performer"
          value={analytics?.topLinks?.[0]?.clicks || 0}
          detail={analytics?.topLinks?.[0]?.title || "Awaiting momentum."}
          accent="#00f2ff"
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <DashboardCard className="p-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--saas-text-secondary)]">
                Temporal Analysis
              </p>
              <h3 className="mt-1 text-xl font-black text-[var(--saas-text-primary)] tracking-tight">
                Flux Cycle (30D)
              </h3>
            </div>
            <div className="shrink-0 px-4 py-2 rounded-2xl bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] text-[10px] font-black text-[var(--saas-text-secondary)] uppercase tracking-tighter">
              {analytics?.clicksPerDay?.length || 0} Data Nodes
            </div>
          </div>
          <div className="h-[360px] w-full">
            {analytics?.clicksPerDay?.length ? (
              <Line data={clicksChartData} options={chartOptions} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-[32px] border border-dashed border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/20 px-6 text-center group">
                 <div className="h-12 w-12 rounded-2xl bg-[var(--saas-bg-surface)] flex items-center justify-center text-[var(--saas-text-secondary)]/30 mb-4 ring-1 ring-[var(--saas-border)]">
                    <Activity className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-[var(--saas-text-secondary)]">
                  Data cycle has not yet initialized.
                </p>
              </div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard className="p-8">
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--saas-text-secondary)]">
              Asset Ranking
            </p>
            <h3 className="mt-1 text-xl font-black text-[var(--saas-text-primary)] tracking-tight">
              High Impact Nodes
            </h3>
          </div>
          <div className="h-[240px] w-full mb-10">
            {analytics?.topLinks?.length ? (
              <Bar data={topLinksData} options={chartOptions} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-[32px] border border-dashed border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/20 px-6 text-center group">
                 <div className="h-12 w-12 rounded-2xl bg-[var(--saas-bg-surface)] flex items-center justify-center text-[var(--saas-text-secondary)]/30 mb-4 ring-1 ring-[var(--saas-border)]">
                    <Trophy className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-[var(--saas-text-secondary)]">
                  Leaderboard awaiting publication.
                </p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {(analytics?.topLinks || []).slice(0, 4).map((link, idx) => (
              <div
                key={link.id}
                className="group relative flex items-center justify-between rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 p-4 transition-all hover:border-[var(--saas-accent-primary)]/40 hover:bg-[var(--saas-bg-elevated)]/60"
              >
                <div className="min-w-0 pr-4">
                  <p className="truncate text-sm font-black text-[var(--saas-text-primary)]">
                    {link.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] font-bold text-[var(--saas-text-secondary)] opacity-50">
                    {link.url.replace(/^https?:\/\//, '')}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                    <span className="text-[11px] font-black text-[var(--saas-accent-primary)]">
                        {formatCompactNumber(link.clicks)}
                    </span>
                    <div className="h-8 w-8 rounded-xl bg-[var(--saas-bg-surface)] flex items-center justify-center text-[10px] font-black text-[var(--saas-text-secondary)] ring-1 ring-[var(--saas-border)] group-hover:text-[var(--saas-accent-primary)] transition-colors">
                        #{idx + 1}
                    </div>
                </div>
                {/* Visual indicator for top performer */}
                {idx === 0 && (
                    <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-lg bg-[var(--saas-accent-primary)] flex items-center justify-center text-black shadow-lg shadow-[var(--saas-accent-glow)]/30 animate-pulse">
                        <Zap className="h-3 w-3 fill-current" />
                    </div>
                )}
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
