import React from "react";
import { cx } from "./dashboardUtils";

const DashboardCard = React.memo(function DashboardCard({
  children,
  className,
}) {
  return (
    <section
      className={cx(
        "rounded-lg border border-neutral-800 bg-[#0a0a0a] p-5 sm:p-6 text-neutral-200",
        className,
      )}
    >
      {children}
    </section>
  );
});

export default DashboardCard;
