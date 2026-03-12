import React from "react";
import { cx } from "./dashboardUtils";

const DashboardCard = React.memo(function DashboardCard({
  children,
  className,
}) {
  return (
    <section
      className={cx(
        "rounded-[32px] border border-[var(--saas-border)] bg-[var(--saas-card)] backdrop-blur-md p-6 sm:p-8 text-[var(--saas-text-primary)] transition-all duration-300 hover:border-[var(--saas-border-hover)] hover:bg-[var(--saas-card-hover)] shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
});

export default DashboardCard;
