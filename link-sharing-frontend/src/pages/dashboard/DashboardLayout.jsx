import {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../Components/dashboard/Sidebar";
import TopNavbar from "../../Components/dashboard/TopNavbar";
import MobilePreview from "../../Components/dashboard/MobilePreview";
import useDashboardData from "../../hooks/useDashboardData";
import { useSocialProfiles } from "../../hooks/useSocialProfiles";

const DashboardProfile = lazy(() => import("./DashboardProfile"));
const DashboardLinks = lazy(() => import("./DashboardLinks"));
const DashboardThemes = lazy(() => import("./DashboardThemes"));
const DashboardSettings = lazy(() => import("./DashboardSettings"));

function DashboardPageSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-8 w-1/3 bg-surface-container-highest rounded-xl" />
      <div className="h-48 w-full bg-surface-container-highest rounded-xl" />
      <div className="space-y-4">
        <div className="h-20 w-full bg-surface-container-highest rounded-xl" />
        <div className="h-20 w-full bg-surface-container-highest rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    snapshot,
    loading,
    error,
    refresh,
    updateUser,
    updateLinks,
  } = useDashboardData();

  const userData = snapshot?.user;
  const links = snapshot?.links || [];
  const analytics = snapshot?.analytics;

  // socialProfiles hook expects an object of handles/IDs
  const { data: socialProfilesData } = useSocialProfiles({
    youtubeId: userData?.youtubeId,
    githubUser: userData?.githubUser,
    instagram: userData?.instagram,
    twitter: userData?.twitter,
  });

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Synchronizing Hub</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-on-surface selection:bg-primary/30">
      <TopNavbar
        user={userData}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex h-screen pt-20">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={userData}
          onLogout={handleLogout}
        />

        <main className="ml-0 lg:ml-80 flex flex-1 overflow-hidden">
          {/* Left Side: Control Panel (40%) */}
          <section className="w-full lg:w-[40%] h-full overflow-y-auto px-8 py-10 border-r border-outline-variant/10 no-scrollbar">
            <div className="max-w-xl mx-auto">
              <Suspense fallback={<DashboardPageSkeleton />}>
                <Routes>
                  <Route
                    index
                    element={
                      <DashboardLinks
                        userData={userData}
                        links={links}
                        onRefresh={refresh}
                        onUserChange={updateUser}
                        onLinksChange={updateLinks}
                      />
                    }
                  />
                  <Route path="links" element={<Navigate to="/dashboard" replace />} />
                  <Route
                    path="profile"
                    element={
                      <DashboardProfile
                        userData={userData}
                        onRefresh={refresh}
                        onUserChange={updateUser}
                      />
                    }
                  />
                  <Route
                    path="themes"
                    element={
                      <DashboardThemes
                        userData={userData}
                        onRefresh={refresh}
                        onUserChange={updateUser}
                      />
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <DashboardSettings
                        userData={userData}
                        onLogout={handleLogout}
                      />
                    }
                  />
                </Routes>
              </Suspense>
            </div>
          </section>

          {/* Right Side: Live Canvas (60%) */}
          <section className="hidden lg:flex flex-1 items-center justify-center bg-[#07090d] relative overflow-hidden">
            {/* High-fidelity background atmosphere */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse duration-[10s]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[100px] animate-pulse duration-[8s] delay-700" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Live Preview Label */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-md">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Preview</span>
              </div>

              <div className="relative">
                <MobilePreview
                  user={userData}
                  links={links}
                />

                {/* Real-time Insight Toast (Match Image 1) */}
                <div className="absolute -right-24 bottom-32 w-72 p-5 bg-surface-container-high/60 backdrop-blur-2xl border border-outline-variant/20 rounded-[1.5rem] shadow-2xl animate-in slide-in-from-right-10 duration-1000">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                            <span className="material-symbols-outlined text-xl">show_chart</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-primary">Real-time Insight</p>
                            <p className="text-[11px] font-bold text-on-surface leading-normal opacity-90">
                                Your profile traffic is up 12% today. Most users are clicking your "Latest Collection" link.
                            </p>
                        </div>
                    </div>
                </div>
              </div>

              {/* Stats Bar (Match Image 1) */}
              <div className="mt-12 overflow-hidden rounded-3xl bg-surface-container-low/40 backdrop-blur-xl border border-outline-variant/10 p-1">
                  <div className="flex items-center">
                      <div className="px-8 py-4 text-center border-r border-outline-variant/10">
                          <p className="text-2xl font-black text-white leading-none">{links.length}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-outline mt-1.5 opacity-60">Links</p>
                      </div>
                      <div className="px-8 py-4 text-center border-r border-outline-variant/10">
                          <p className="text-2xl font-black text-white leading-none">4</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-outline mt-1.5 opacity-60">Socials</p>
                      </div>
                      <div className="px-8 py-4 text-center">
                          <p className="text-2xl font-black text-white leading-none">8.4k</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-outline mt-1.5 opacity-60">Views</p>
                      </div>
                  </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
