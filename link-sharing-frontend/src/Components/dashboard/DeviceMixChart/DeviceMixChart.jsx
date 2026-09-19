import { Smartphone, Monitor, Tablet } from "lucide-react";
import { formatCompactNumber } from "../dashboardUtils";
import "./DeviceMixChart.css";

export default function DeviceMixChart({ analytics = {} }) {
  const visitors = Number(analytics?.uniqueVisitors ?? 0);
  const formattedVisitors = formatCompactNumber(visitors);

  const mix = analytics?.deviceMix || {
    mobile: 0,
    desktop: 0,
    tablet: 0,
  };

  const mobilePct = Math.max(0, Number(mix.mobile ?? 0));
  const desktopPct = Math.max(0, Number(mix.desktop ?? 0));
  const tabletPct = Math.max(0, Number(mix.tablet ?? 0));

  // SVG circle calculations (r = 60, circumference ~ 376.99)
  const C = 2 * Math.PI * 60;
  const mobileLen = (mobilePct / 100) * C;
  const desktopLen = (desktopPct / 100) * C;
  const tabletLen = (tabletPct / 100) * C;

  const mobileOffset = 0;
  const desktopOffset = -mobileLen;
  const tabletOffset = -(mobileLen + desktopLen);

  const legendItems = [
    {
      id: "mobile",
      label: "Mobile",
      pct: `${mobilePct}%`,
      color: "#c6f035",
      icon: Smartphone,
    },
    {
      id: "desktop",
      label: "Desktop",
      pct: `${desktopPct}%`,
      color: "#22d3ee",
      icon: Monitor,
    },
    {
      id: "tablet",
      label: "Tablet",
      pct: `${tabletPct}%`,
      color: "#f97316",
      icon: Tablet,
    },
  ];

  return (
    <div className="device-mix-card">
      <div className="device-mix-header">
        <h3 className="device-mix-title">Device mix</h3>
        <p className="device-mix-subtitle">Unique visitor sessions</p>
      </div>

      <div className="donut-container">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Base track */}
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="16"
          />

          {/* Mobile segment (Lime) */}
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="transparent"
            stroke="#c6f035"
            strokeWidth="16"
            strokeDasharray={`${mobileLen} ${C - mobileLen}`}
            strokeDashoffset={mobileOffset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />

          {/* Desktop segment (Cyan) */}
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="transparent"
            stroke="#22d3ee"
            strokeWidth="16"
            strokeDasharray={`${desktopLen} ${C - desktopLen}`}
            strokeDashoffset={desktopOffset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />

          {/* Tablet segment (Amber) */}
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="transparent"
            stroke="#f97316"
            strokeWidth="16"
            strokeDasharray={`${tabletLen} ${C - tabletLen}`}
            strokeDashoffset={tabletOffset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>

        {/* Center label */}
        <div className="donut-center-content">
          <span className="donut-visitors-val">{formattedVisitors}</span>
          <span className="donut-visitors-label">visitors</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="device-legend">
        {legendItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="device-legend-row">
              <div className="device-legend-left">
                <span
                  className="device-dot"
                  style={{ backgroundColor: item.color }}
                />
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.label}</span>
              </div>
              <span className="device-pct">{item.pct}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
