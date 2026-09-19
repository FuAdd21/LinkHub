import { useMemo } from "react";
import "./LiveActivityFeed.css";

function formatRelativeTime(dateString) {
  if (!dateString) return "Just now";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min`;
  if (diffHours < 24) return `${diffHours} hr`;
  return `${Math.floor(diffHours / 24)} d`;
}

export default function LiveActivityFeed({ analytics = {} }) {
  const rawEvents = analytics?.recentActivity;

  const activityEvents = useMemo(() => {
    if (Array.isArray(rawEvents) && rawEvents.length > 0) {
      return rawEvents.slice(0, 5).map((e) => {
        const isClick = e.type === "click";
        const loc = e.device
          ? `${e.device.charAt(0).toUpperCase() + e.device.slice(1)} visitor`
          : "Web visitor";
        const action = isClick
          ? `opened ${e.platform || e.link_title || "a destination link"}`
          : "viewed your profile";
        return {
          id: e.id || Math.random(),
          location: loc,
          action,
          time: formatRelativeTime(e.timestamp),
        };
      });
    }

    return [];
  }, [rawEvents]);

  return (
    <div className="activity-card">
      <div className="activity-header">
        <h3 className="activity-title">Live activity</h3>
        <div className="activity-live-badge">
          <span className="w-2 h-2 rounded-full bg-[#c6f035] shadow-[0_0_8px_#c6f035] animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="activity-feed-list">
        {activityEvents.length === 0 ? (
          <div className="py-8 px-4 text-center space-y-1.5">
            <p className="text-xs font-mono text-slate-400">
              No live activity recorded yet
            </p>
            <p className="text-[11px] font-mono text-slate-600">
              Clicks and profile views will stream here in real time as visitors interact with your link.
            </p>
          </div>
        ) : (
          activityEvents.map((item) => (
            <div key={item.id} className="activity-item">
              <div className="activity-ring-marker" />
              <div className="activity-content">
                <div className="activity-primary-text">
                  <strong>{item.location}</strong> {item.action}
                </div>
                <span className="activity-time">{item.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
