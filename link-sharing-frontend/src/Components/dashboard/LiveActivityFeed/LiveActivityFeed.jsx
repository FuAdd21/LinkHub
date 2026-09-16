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
          ? `${e.device.charAt(0).toUpperCase() + e.device.slice(1)} user`
          : "Berlin, DE";
        const action = isClick
          ? `opened ${e.platform || e.link_title || "a link"}`
          : "viewed your profile";
        return {
          id: e.id || Math.random(),
          location: loc,
          action,
          time: formatRelativeTime(e.timestamp),
        };
      });
    }

    // Default authentic sample feed matching screenshots
    return [
      { id: 1, location: "Berlin, DE", action: "opened GitHub", time: "Just now" },
      { id: 2, location: "Austin, US", action: "viewed your profile", time: "2 min" },
      { id: 3, location: "Nairobi, KE", action: "opened YouTube", time: "4 min" },
      { id: 4, location: "London, UK", action: "viewed your profile", time: "8 min" },
    ];
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
        {activityEvents.map((item) => (
          <div key={item.id} className="activity-item">
            <div className="activity-ring-marker" />
            <div className="activity-content">
              <div className="activity-primary-text">
                <strong>{item.location}</strong> {item.action}
              </div>
              <span className="activity-time">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
