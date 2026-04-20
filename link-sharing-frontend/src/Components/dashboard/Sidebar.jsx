import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { cx, getPublicProfileUrl } from "./dashboardUtils";

const SIDEBAR_ITEMS = [
  { id: "profile", label: "Profile", icon: "person", to: "/dashboard/profile" },
  { id: "links", label: "Links", icon: "link", to: "/dashboard/links" },
  { id: "themes", label: "Design", icon: "palette", to: "/dashboard/themes" },
  { id: "settings", label: "Settings", icon: "settings", to: "/dashboard/settings" },
];

export default function Sidebar({ isOpen, onClose, user, onLogout }) {
  function handleShareLink() {
    if (!user?.username) {
      toast.error("Set a username to share your link");
      return;
    }
    const url = `${window.location.origin}${getPublicProfileUrl(user.username)}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Profile link copied!"),
      () => toast.error("Could not copy link")
    );
  }

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
              end
              onClick={onClose}
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
          <button
            onClick={handleShareLink}
            className="mx-2 mb-4 w-full py-4 bg-[#919bff] text-black font-black rounded-2xl shadow-xl shadow-primary/30 hover:brightness-110 transition-all active:scale-95 text-xs uppercase tracking-widest"
          >
            Share Link
          </button>

          <div className="px-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 py-3 px-4 text-slate-400 hover:text-white transition-all text-sm font-medium rounded-xl hover:bg-white/5"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
