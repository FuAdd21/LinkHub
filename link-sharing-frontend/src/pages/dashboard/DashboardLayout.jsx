import {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutGrid,
  Link2,
  Palette,
  BarChart2,
  Radio,
  Briefcase,
  Settings,
  AlertCircle,
  MoreHorizontal,
  Menu,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import { api } from "../../api/config";
import ErrorBoundary from "../../Components/ErrorBoundary";

// Modular Navigation & Rail Components
import SidebarNav from "../../Components/dashboard/SidebarNav/SidebarNav";
import CommandHeader from "../../Components/dashboard/CommandHeader/CommandHeader";
import LiveCanvasPreview from "../../Components/dashboard/LiveCanvasPreview/LiveCanvasPreview";
import QuickLinksToggle from "../../Components/dashboard/QuickLinksToggle/QuickLinksToggle";

const DashboardOverview = lazy(() => import("./DashboardOverview"));
const DashboardLinks = lazy(() => import("./DashboardLinks"));
const DashboardProjects = lazy(() => import("./DashboardProjects"));
const DashboardThemes = lazy(() => import("./DashboardThemes"));
const DashboardAnalytics = lazy(() => import("./DashboardAnalytics"));
const DashboardSocials = lazy(() => import("./DashboardSocials"));
const DashboardSettings = lazy(() => import("./DashboardSettings"));
const DashboardProfile = lazy(() => import("./DashboardProfile"));

function DashboardPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="h-8 w-1/4 bg-white/5 rounded-lg" />
      <div className="h-32 w-full bg-white/5 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-white/5 rounded-xl" />
        <div className="h-64 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    snapshot,
    loading,
    error,
    refresh,
    updateUser,
    updateLinks,
    updateIntegrations,
  } = useDashboardData();

  const userData = snapshot?.user;
  const links = snapshot?.links || [];
  const analytics = snapshot?.analytics;
  const integrations = snapshot?.integrations;

  const isOverviewPage =
    location.pathname === "/dashboard" ||
    location.pathname === "/dashboard/overview" ||
    location.pathname === "/dashboard/";

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Toggle link visibility directly from QuickLinksToggle
  const handleToggleLink = async (linkId, currentVisibility) => {
    try {
      const nextVal = currentVisibility ? 0 : 1;
      await api.put(`/api/mylinks/${linkId}/visibility`, { is_visible: nextVal });
      updateLinks((prev) =>
        prev.map((l) => (l.id === linkId ? { ...l, is_visible: nextVal } : l))
      );
      toast.success(nextVal ? "Link is now visible" : "Link is now hidden", {
        icon: nextVal ? "👁️" : "🙈",
      });
    } catch {
      toast.error("Failed to update link visibility");
    }
  };

  // Determine current page title for CommandHeader
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/links")) return "Links";
    if (path.includes("/projects")) return "Projects";
    if (path.includes("/themes")) return "Appearance";
    if (path.includes("/analytics")) return "Analytics";
    if (path.includes("/socials")) return "Integrations";
    if (path.includes("/settings")) return "Settings";
    if (path.includes("/profile")) return "Profile";
    return "Overview";
  };

  // Mobile horizontal nav tabs matching mobile.png
  const mobileNavTabs = [
    { label: "Overview", path: "/dashboard/overview", icon: LayoutGrid },
    { label: "Links", path: "/dashboard/links", icon: Link2 },
    { label: "Projects", path: "/dashboard/projects", icon: Briefcase },
    { label: "Appearance", path: "/dashboard/themes", icon: Palette },
    { label: "Analytics", path: "/dashboard/analytics", icon: BarChart2 },
    { label: "Integrations", path: "/dashboard/socials", icon: Radio },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0A07] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#c6f035]/20 border-t-[#c6f035] rounded-full animate-spin" />
          <p className="text-[#c6f035] font-black uppercase tracking-[0.25em] text-[10px] animate-pulse">
            Connecting Command Center
          </p>
        </div>
      </div>
    );
  }

  if (error && !snapshot) {
    return (
      <div className="min-h-screen bg-[#0B0A07] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Failed to synchronize dashboard</h2>
        <p className="text-slate-400 text-xs max-w-md mb-6">
          {error.response?.data?.message || error.message || "Could not connect to database servers."}
        </p>
        <button
          onClick={() => refresh()}
          className="px-5 py-2.5 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0A07] text-[#f3f4f3] flex flex-col font-sans">
      {/* 3-Column Shell */}
      <div className="flex flex-1 h-screen overflow-hidden">
        {/* Left Column: Sidebar (232px) */}
        <SidebarNav
          user={userData}
          links={links}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Center Column: Main Content & Header */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-[68px] lg:ml-[232px] overflow-hidden">
          {/* Mobile Top Brand Bar (matching mobile-01 through mobile-05) */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B0A07] border-b border-white/5 sticky top-0 z-40">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#c6f035] flex items-center justify-center text-[#0e1208] font-black">
                <Link2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">LinkHub</span>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              aria-label="Open menu"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Command Center Sticky Header (visible on tablet and desktop) */}
          <div className="hidden md:block">
            <CommandHeader
              title={getPageTitle()}
              user={userData}
              onMenuClick={() => setSidebarOpen(true)}
              onShare={() => {
                const url = `${window.location.origin}/${userData?.username || "maya"}`;
                if (navigator.share) {
                  navigator.share({ title: "My LinkHub", url }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(url);
                  toast.success("Profile URL copied to clipboard!");
                }
              }}
            />
          </div>

          {/* Scrollable Center Main Body */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-20 md:pb-6">
            <ErrorBoundary>
              <Suspense fallback={<DashboardPageSkeleton />}>
                <Routes>
                  <Route
                    index
                    element={
                      <DashboardOverview
                        userData={userData}
                        links={links}
                        analytics={analytics}
                      />
                    }
                  />
                  <Route
                    path="overview"
                    element={
                      <DashboardOverview
                        userData={userData}
                        links={links}
                        analytics={analytics}
                      />
                    }
                  />
                  <Route
                    path="links"
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
                  <Route
                    path="projects"
                    element={
                      <DashboardProjects
                        userData={userData}
                        onUserChange={updateUser}
                      />
                    }
                  />
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
                    path="socials"
                    element={
                      <DashboardSocials
                        userData={userData}
                        integrationsData={integrations}
                        onRefresh={refresh}
                        onUserChange={updateUser}
                        onIntegrationsChange={updateIntegrations}
                      />
                    }
                  />
                  <Route
                    path="analytics"
                    element={<DashboardAnalytics analytics={analytics} userData={userData} />}
                  />
                  <Route
                    path="themes"
                    element={
                      <DashboardThemes
                        userData={userData}
                        links={links}
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
                        onRefresh={refresh}
                        onUserChange={updateUser}
                        onLogout={handleLogout}
                      />
                    }
                  />
                  <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>

        {/* Right Column: Live Canvas Rail (Visible on Overview on >= 1280px / xl screens) */}
        {isOverviewPage && (
          <aside className="hidden xl:flex flex-col w-[360px] h-screen bg-[#0B0A07] border-l border-white/5 p-6 overflow-y-auto shrink-0 space-y-6">
            <LiveCanvasPreview user={userData} links={links} integrations={integrations} />
            <div className="pt-2 border-t border-white/5">
              <QuickLinksToggle
                links={links}
                onToggle={handleToggleLink}
                onAdd={() => navigate("/dashboard/links")}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Visible on < md screens matching mobile-01 through mobile-05) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0A07]/95 backdrop-blur-lg border-t border-white/10 py-2 px-3 flex items-center justify-around">
        {[
          { label: "Links", path: "/dashboard/links", icon: Link2 },
          { label: "Style", path: "/dashboard/themes", icon: Palette },
          { label: "Data", path: "/dashboard/analytics", icon: BarChart2 },
          { label: "Sync", path: "/dashboard/socials", icon: Radio },
          { label: "Settings", path: "/dashboard/settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.label}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
                isActive ? "text-[#c6f035]" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              <span
                className={`text-[10px] font-mono tracking-tight mt-1 ${
                  isActive ? "font-bold text-[#c6f035]" : "text-slate-500"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
