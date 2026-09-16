import {
  Eye,
  Navigation,
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import "./MetricsGrid.css";

export default function MetricsGrid({ analytics = {} }) {
  const views = Number(analytics?.totalViews ?? 0);
  const clicks = Number(analytics?.totalClicks ?? 0);
  const clickRate = analytics?.clickRate !== undefined
    ? Number(analytics.clickRate).toFixed(2)
    : views > 0
    ? ((clicks / views) * 100).toFixed(2)
    : "0.00";
  const uniqueVisitors = Number(analytics?.uniqueVisitors ?? Math.round(views * 0.73) ?? 0);

  const deltas = analytics?.deltas || {
    views: "+12.8%",
    clicks: "+18.3%",
    rate: "+2.4%",
    visitors: "-1.7%",
  };

  const metrics = [
    {
      id: "views",
      title: "Profile views",
      value: views.toLocaleString(),
      icon: Eye,
      trend: deltas.views || "+12.8%",
      isPositive: !String(deltas.views).startsWith("-"),
    },
    {
      id: "clicks",
      title: "Total clicks",
      value: clicks.toLocaleString(),
      icon: Navigation,
      trend: deltas.clicks || "+18.3%",
      isPositive: !String(deltas.clicks).startsWith("-"),
    },
    {
      id: "rate",
      title: "Click rate",
      value: `${clickRate}%`,
      icon: Activity,
      trend: deltas.rate || "+2.4%",
      isPositive: !String(deltas.rate).startsWith("-"),
    },
    {
      id: "visitors",
      title: "Unique visitors",
      value: uniqueVisitors.toLocaleString(),
      icon: Users,
      trend: deltas.visitors || "-1.7%",
      isPositive: !String(deltas.visitors).startsWith("-"),
    },
  ];

  return (
    <div className="metrics-grid-container">
      {metrics.map((m) => {
        const Icon = m.icon;
        const TrendIcon = m.isPositive ? TrendingUp : TrendingDown;

        return (
          <div key={m.id} className="metrics-cell">
            <div className="flex items-center justify-between">
              <span className="metric-title">{m.title}</span>
              <Icon className="w-4 h-4 text-slate-500" />
            </div>

            <div className="metric-value">{m.value}</div>

            <div
              className={`metric-trend ${
                m.isPositive ? "positive" : "negative"
              }`}
            >
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{m.trend}</span>
              <span className="metric-trend-period">vs previous period</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
