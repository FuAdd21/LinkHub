import React from "react";
import { cx } from "./dashboardUtils";

/**
 * DashboardCard — Glassmorphism surface card (Stitch Luminous Curator)
 * Uses tonal layering (surface-container hierarchy) over hard borders.
 * The "No-Line Rule": boundaries defined by bg shift + ghost border at 10% opacity.
 */
const DashboardCard = React.memo(function DashboardCard({
  children,
  className,
  as: Tag = "section",
}) {
  return (
    <Tag
      className={cx(
        // Base glass surface
        "rounded-[28px]",
        "border border-[var(--saas-border)]",
        "bg-[var(--saas-bg-surface)]/80",
        "backdrop-blur-[20px]",
        "p-6 sm:p-8",
        "text-[var(--saas-text-primary)]",
        // Smooth transitions
        "transition-all duration-300",
        // Hover: ghost border reveals slightly + subtle bg shift
        "hover:border-[var(--saas-border-hover)]/60",
        "hover:bg-[var(--saas-bg-elevated)]/50",
        // Layered depth shadow (no pure black; uses accent-tinted shadow)
        "shadow-[0_4px_24px_rgba(0,0,0,0.18),0_1px_4px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
});

export default DashboardCard;
