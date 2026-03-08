import AnimatedCounter from "./AnimatedCounter";
import DashboardCard from "./DashboardCard";

export default function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  accent,
}) {
  const IconComponent = Icon;

  return (
    <DashboardCard className="overflow-hidden">
      <div className="mb-5 flex items-center justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: `${accent}18`,
            color: accent,
          }}
        >
          <IconComponent className="h-5 w-5" />
        </div>
        <div
          className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
          style={{ color: accent, backgroundColor: accent }}
        />
      </div>
      <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
        <AnimatedCounter value={value} />
      </div>
      {detail ? (
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{detail}</p>
      ) : null}
    </DashboardCard>
  );
}