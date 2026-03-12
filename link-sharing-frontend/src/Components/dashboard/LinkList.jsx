import {
  CalendarClock,
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Reorder } from "framer-motion";
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
      <div className="flex min-h-[320px] flex-col items-center justify-center text-center rounded-[32px] border border-dashed border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/20 p-8 shadow-sm group">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--saas-bg-surface)] text-[var(--saas-text-secondary)] mb-6 ring-1 ring-[var(--saas-border)] group-hover:scale-110 group-hover:bg-[var(--saas-bg-elevated)] transition-all duration-500">
           <Link2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-extrabold text-[var(--saas-text-primary)] tracking-tight">
          No links orchestrated yet
        </h3>
        <p className="mt-2 max-w-sm text-sm font-medium text-[var(--saas-text-secondary)] leading-relaxed">
          Your digital estate is waiting for its first destination. Add a link to start tracking unique audience signals.
        </p>
      </div>
    );
  }

  return (
    <Reorder.Group values={links} onReorder={onReorder} className="space-y-4">
      {links.map((link) => (
        <Reorder.Item key={link.id} value={link} className="rounded-[28px]">
          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--saas-border)] bg-[var(--saas-card)] p-4 sm:p-5 transition-all duration-300 hover:border-[var(--saas-accent-primary)]/30 hover:bg-[var(--saas-card-hover)] hover:shadow-xl hover:shadow-[var(--saas-accent-glow)]/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                  type="button"
                  className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] transition-colors sm:flex cursor-grab active:cursor-grabbing shadow-sm"
                >
                  <GripVertical className="h-4.5 w-4.5" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <p
                      className={cx(
                        "truncate text-[15px] font-bold tracking-tight transition-colors",
                        link.is_visible === 0
                          ? "text-[var(--saas-text-secondary)]"
                          : "text-[var(--saas-text-primary)]",
                      )}
                    >
                      {link.title}
                    </p>
                    <span
                      className={cx(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest",
                        link.is_visible === 0
                          ? "bg-[var(--saas-bg-elevated)] text-[var(--saas-text-secondary)]"
                          : "bg-[var(--saas-accent-primary)]/10 text-[var(--saas-accent-primary)]",
                      )}
                    >
                      <div className={cx("h-1 w-1 rounded-full", link.is_visible === 0 ? "bg-[var(--saas-text-secondary)]" : "bg-[var(--saas-accent-primary)] shadow-[0_0_6px_var(--saas-accent-glow)]")} />
                      {link.is_visible === 0 ? "Offline" : "Live"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 group/link">
                     <p className="truncate text-[12px] font-semibold text-[var(--saas-text-secondary)] group-hover/link:text-[var(--saas-accent-primary)] transition-colors">
                        {link.url}
                     </p>
                  </div>
                  {link.scheduled_at ? (
                    <div className="mt-2.5 inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                      <CalendarClock className="h-3 w-3" />
                      Scheduled: {formatDateTime(link.scheduled_at)}
                    </div>
                  ) : null}
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:ml-auto">
                <button
                  type="button"
                  onClick={() => onToggleVisibility(link.id)}
                  className="flex h-10 px-4 items-center gap-2 rounded-xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] text-xs font-bold text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] hover:bg-[var(--saas-bg-elevated)] transition-all shadow-sm"
                  title={link.is_visible === 0 ? "Toggle Online" : "Toggle Offline"}
                >
                  {link.is_visible === 0 ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  <span className="hidden lg:inline">{link.is_visible === 0 ? "Go Live" : "Hide"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(link)}
                  className="flex h-10 w-10 sm:w-auto sm:px-4 items-center justify-center gap-2 rounded-xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] text-xs font-bold text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] hover:bg-[var(--saas-bg-elevated)] transition-all shadow-sm"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="hidden lg:inline">Edit</span>
                </button>
                <div className="h-8 w-px bg-[var(--saas-border)] mx-1" />
                <button
                  type="button"
                  onClick={() => onDelete(link.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Background accent element */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-[var(--saas-accent-primary)] opacity-0 blur-[40px] group-hover:opacity-[0.03] transition-opacity pointer-events-none" />
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
