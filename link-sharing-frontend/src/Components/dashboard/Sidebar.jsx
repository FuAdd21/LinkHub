import { NavLink } from "react-router-dom";
import { cx } from "./dashboardUtils";

const SIDEBAR_ITEMS = [
  { id: "profile", label: "Profile", icon: "person", to: "/dashboard" },
  { id: "links", label: "Links", icon: "link", to: "/dashboard/links" },
  { id: "themes", label: "Design", icon: "palette", to: "/dashboard/themes" },
  { id: "settings", label: "Settings", icon: "settings", to: "/dashboard/settings" },
];

export default function Sidebar({ isOpen, onClose, user, onLogout }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cx(
          "h-screen w-80 fixed left-0 z-50 bg-[#0b0e14]/40 backdrop-blur-lg flex flex-col py-8 px-6 pt-12 gap-4 transition-transform duration-300 lg:translate-x-0 border-r border-outline-variant/10",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 px-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Creator Hub</h2>
          <p className="text-slate-500 text-sm font-medium">Manage your digital presence</p>
        </div>

        <nav className="flex flex-col gap-1.5">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={onClose}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                cx(
                  "flex items-center gap-3 py-3 px-4 rounded-xl transition-all font-medium text-sm",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-indigo-400 border-r-2 border-indigo-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          {/* Pro Features Card */}
          <div className="mx-2 mb-6 p-5 rounded-2xl bg-gradient-to-br from-secondary-container/40 to-primary-container/10 border border-outline-variant/20 shadow-xl overflow-hidden relative group">
             <div className="relative z-10">
                <p className="text-[10px] font-black tracking-widest text-primary-fixed uppercase mb-2">Pro Package</p>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed mb-4">Unlock cinematic themes & deep link analytics.</p>
                <button className="w-full py-2.5 bg-primary text-on-primary font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
                    Upgrade to Pro
                </button>
             </div>
             <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors" />
          </div>

          <button className="mx-2 mb-4 w-full py-4 bg-[#919bff] text-black font-black rounded-2xl shadow-xl shadow-primary/30 hover:brightness-110 transition-all active:scale-95 text-xs uppercase tracking-widest">
            Share Link
          </button>
          
          <div className="px-2 space-y-1">
              <a href="#" className="flex items-center gap-3 py-3 px-4 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                <span className="material-symbols-outlined">help_outline</span>
                <span>Help and Support</span>
              </a>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 py-3 px-4 text-error-dim hover:text-error transition-all text-sm font-medium rounded-xl hover:bg-error/5"
              >
                <span className="material-symbols-outlined">logout</span>
                <span>Terminate Session</span>
              </button>
          </div>
        </div>
      </aside>
    </>
  );
}
