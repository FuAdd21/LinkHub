import AnimatedCounter from "./AnimatedCounter";
import DashboardCard from "./DashboardCard";

export default function MetricCard({ icon: Icon, label, value, detail }) {
  const IconComponent = Icon;

  return (
    <DashboardCard className="overflow-hidden">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400">
          <IconComponent className="h-4 w-4" />
        </div>
      </div>
      <p className="text-sm font-medium text-neutral-400">{label}</p>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-100">
        <AnimatedCounter value={value} />
      </div>
      {detail ? (
        <p className="mt-1 text-sm text-neutral-500">{detail}</p>
      ) : null}
    </DashboardCard>
  );
}
