import {
  CalendarClock,
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Reorder } from "framer-motion";
import DashboardCard from "./DashboardCard";
import { cx, formatDateTime } from "./dashboardUtils";

export default function LinkList({
  links,
  onReorder,
  onToggleVisibility,
  onEdit,
  onDelete,
}) {
  if (!links.length) {
    return (
      <DashboardCard className="flex min-h-[220px] flex-col items-center justify-center text-center">
        <div className="rounded-full border border-[var(--card-border)] bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          Ready for your first launch
        </div>
        <h3 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">
          Build your first high-converting link block
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
          Add a title, paste a destination, and your mobile preview will update
          instantly.
        </p>
      </DashboardCard>
    );
  }

  return (
    <Reorder.Group values={links} onReorder={onReorder} className="space-y-3">
      {links.map((link) => (
        <Reorder.Item key={link.id} value={link}>
          <DashboardCard className="group overflow-hidden p-0" elevated={false}>
            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-white/5 text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text-primary)] sm:flex"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <p
                      className={cx(
                        "truncate text-base font-semibold transition",
                        link.is_visible === 0
                          ? "text-[var(--text-muted)]"
                          : "text-[var(--text-primary)]",
                      )}
                    >
                      {link.title}
                    </p>
                    <span
                      className={cx(
                        "rounded-full px-2.5 py-1 text-[11px] font-medium",
                        link.is_visible === 0
                          ? "bg-white/5 text-[var(--text-muted)]"
                          : "bg-emerald-500/12 text-emerald-300",
                      )}
                    >
                      {link.is_visible === 0 ? "Hidden" : "Live"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-[var(--text-muted)]">
                    {link.url}
                  </p>
                  {link.scheduled_at ? (
                    <div className="mt-2 flex items-center gap-2 text-xs text-amber-300/80">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Scheduled for {formatDateTime(link.scheduled_at)}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                <button
                  type="button"
                  onClick={() => onToggleVisibility(link.id)}
                  className="dashboard-chip"
                >
                  {link.is_visible === 0 ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  {link.is_visible === 0 ? "Show" : "Hide"}
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(link)}
                  className="dashboard-chip"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(link.id)}
                  className="dashboard-chip text-rose-200 hover:border-rose-400/35 hover:bg-rose-500/10 hover:text-rose-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition group-hover:opacity-100" />
          </DashboardCard>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}


