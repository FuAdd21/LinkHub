import { getAvatarUrl } from "./dashboardUtils";

export default function TopNavbar({ user, onMenuClick }) {
  const avatarUrl = getAvatarUrl(user);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0b0e14]/80 backdrop-blur-xl flex justify-between items-center px-8 h-20 w-full max-w-full font-['Inter'] antialiased tracking-tight">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden material-symbols-outlined text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"
        >
          menu
        </button>
        <div className="text-2xl font-black text-white tracking-tighter">LinkHub</div>
      </div>

      <nav className="hidden md:flex gap-8 items-center">
        <a className="text-slate-100 font-bold tracking-tight transition-colors" href="#">Dashboard</a>
        <a className="text-slate-400 hover:text-slate-200 font-medium tracking-tight transition-colors" href="#">Analytics</a>
        <a className="text-slate-400 hover:text-slate-200 font-medium tracking-tight transition-colors" href="#">Community</a>
      </nav>

      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all duration-300 active:scale-95">
          notifications
        </button>
        <button className="material-symbols-outlined text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all duration-300 active:scale-95">
          settings
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden bg-surface-container-high shadow-lg">
          {avatarUrl ? (
            <img className="w-full h-full object-cover" src={avatarUrl} alt="User Avatar" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
              <span className="material-symbols-outlined">person</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
