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
      <div className="flex min-h-[200px] flex-col items-center justify-center text-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 shadow-sm">
        <div className="rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Ready for your first launch
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          Build your first high-converting link block
        </h3>
        <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          Add a title, paste a destination, and your mobile preview will update
          instantly.
        </p>
      </div>
    );
  }

  return (
    <Reorder.Group values={links} onReorder={onReorder} className="space-y-4">
      {links.map((link) => (
        <Reorder.Item key={link.id} value={link}>
          <div className="group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="hidden h-8 w-8 items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-gray-400 transition-colors sm:flex cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={cx(
                        "truncate text-sm font-medium transition-colors",
                        link.is_visible === 0
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-900 dark:text-white",
                      )}
                    >
                      {link.title}
                    </p>
                    <span
                      className={cx(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        link.is_visible === 0
                          ? "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                      )}
                    >
                      {link.is_visible === 0 ? "Hidden" : "Live"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                    {link.url}
                  </p>
                  {link.scheduled_at ? (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                      <CalendarClock className="h-3 w-3" />
                      Scheduled for {formatDateTime(link.scheduled_at)}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                <button
                  type="button"
                  onClick={() => onToggleVisibility(link.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-neutral-900 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {link.is_visible === 0 ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                  {link.is_visible === 0 ? "Show" : "Hide"}
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(link)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-neutral-900 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(link.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-900/50 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
