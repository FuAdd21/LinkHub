import { motion } from "framer-motion";
import { buildSparklinePath } from "./dashboardUtils";

const MotionPath = motion.path;

export default function MiniTrendChart({ data = [] }) {
  const values = data.map((item) => Number(item.clicks || 0));
  const path = buildSparklinePath(values);

  if (!path) {
    return (
      <div className="flex h-20 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-500">
        No click trend yet
      </div>
    );
  }

  return (
    <div className="relative h-20 overflow-hidden rounded-md border border-neutral-800 bg-[#0a0a0a]">
      <svg
        viewBox="0 0 260 80"
        className="h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <MotionPath
          d={path}
          fill="none"
          stroke="#404040"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.35 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
