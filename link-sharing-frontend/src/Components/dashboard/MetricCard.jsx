import AnimatedCounter from "./AnimatedCounter";
import DashboardCard from "./DashboardCard";

export default function MetricCard({ icon: Icon, label, value, detail }) {
  const IconComponent = Icon;

  return (
    <DashboardCard className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--saas-text-secondary)]">
            {label}
          </p>
          <div className="text-3xl font-extrabold tracking-tight text-[var(--saas-text-primary)]">
            <AnimatedCounter value={value} />
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)] text-[var(--saas-text-secondary)] group-hover:text-[var(--saas-accent-primary)] group-hover:border-[var(--saas-accent-primary)]/30 group-hover:scale-110 transition-all duration-300 shadow-inner">
          <IconComponent className="h-5 w-5" />
        </div>
      </div>
      
      {detail ? (
        <div className="mt-4 flex items-center gap-1.5">
           <div className="h-1.5 w-1.5 rounded-full bg-[var(--saas-accent-primary)] animate-pulse" />
           <p className="text-[11px] font-bold text-[var(--saas-text-secondary)] tracking-wide">{detail}</p>
        </div>
      ) : null}

      {/* Decorative accent background element */}
      <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[var(--saas-accent-primary)] opacity-[0.03] blur-2xl transition-opacity group-hover:opacity-[0.08]" />
    </DashboardCard>
  );
}
