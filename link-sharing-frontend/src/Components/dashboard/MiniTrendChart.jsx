import { motion } from "framer-motion";
import { buildSparklinePath } from "./dashboardUtils";

const MotionPath = motion.path;

export default function MiniTrendChart({ data = [] }) {
  const values = data.map((item) => Number(item.clicks || 0));
  const path = buildSparklinePath(values);

  if (!path) {
    return (
      <div className="flex h-28 items-center justify-center rounded-[24px] border border-dashed border-[var(--card-border)] text-sm text-[var(--text-muted)]">
        No click trend yet
      </div>
    );
  }

  return (
    <div className="relative h-28 overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(99,102,241,0.16),rgba(99,102,241,0.02))]">
      <svg
        viewBox="0 0 260 80"
        className="h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mini-trend-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <MotionPath
          d={path}
          fill="none"
          stroke="url(#mini-trend-line)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.35 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--bg-primary)]/35 to-transparent" />
    </div>
  );
}