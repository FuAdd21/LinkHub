import React from "react";
import { cx } from "./dashboardUtils";

const DashboardCard = React.memo(function DashboardCard({
  children,
  className,
  elevated = true,
}) {
  return (
    <section
      className={cx(
        "dashboard-surface rounded-[28px] p-5 sm:p-6",
        elevated && "dashboard-elevate",
        className,
      )}
    >
      {children}
    </section>
  );
});

export default DashboardCard;