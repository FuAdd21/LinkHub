import {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { BarChart3, Globe2, Sparkles, Zap } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import DashboardCard from "../../Components/dashboard/DashboardCard";
import MobilePreview from "../../Components/dashboard/MobilePreview";
import Sidebar from "../../Components/dashboard/Sidebar";
import TopNavbar from "../../Components/dashboard/TopNavbar";
import {
  cx,
  getConnectedPlatforms,
  getPageCompletion,
  getVisibleLinks,
} from "../../Components/dashboard/dashboardUtils";
import useDashboardData from "../../hooks/useDashboardData";
import { useSocialProfiles } from "../../hooks/useSocialProfiles";

const DashboardOverview = lazy(() => import("./DashboardOverview"));
const DashboardProfile = lazy(() => import("./DashboardProfile"));
const DashboardLinks = lazy(() => import("./DashboardLinks"));
const DashboardThemes = lazy(() => import("./DashboardThemes"));
const DashboardAnalytics = lazy(() => import("./DashboardAnalytics"));
const DashboardSettings = lazy(() => import("./DashboardSettings"));

function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 animate-pulse rounded-2xl bg-white/5" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-[28px] bg-white/5"
          />
        ))}
      </div>
      <div className="h-[320px] animate-pulse rounded-[28px] bg-white/5" />
    </div>
  );
}

function PreviewRail({ userData, links, analytics, socialPreviewData }) {
  const completion = getPageCompletion(userData, links);
  const visibleLinks = getVisibleLinks(links);
  const connectedPlatforms = getConnectedPlatforms(userData);
  const topLink = analytics?.topLinks?.[0];

  return (
    <div className="space-y-6">
      <DashboardCard className="p-6">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--saas-accent-primary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-primary)]">Public Rendering</span>
           </div>
           <div className="h-1.5 w-1.5 rounded-full bg-[var(--saas-accent-primary)] animate-pulse shadow-[0_0_8px_var(--saas-accent-glow)]" />
        </div>
        <div className="relative">
          <MobilePreview
            user={userData}
            links={links}
            socialStats={socialPreviewData}
          />
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-[40px] bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
        </div>
      </DashboardCard>

      <DashboardCard className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] shadow-inner">
            <Zap className="h-5 w-5 text-[var(--saas-accent-primary)]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--saas-text-secondary)]">
              System Signals
            </p>
            <h3 className="text-lg font-extrabold text-[var(--saas-text-primary)] tracking-tight">
              Aura Metrics
            </h3>
          </div>
        </div>
        
        <div className="grid gap-3">
          {[
            { label: "Matrix Completion", value: `${completion}%`, sub: "Nodal integrity" },
            { label: "Active Nodes", value: visibleLinks.length, sub: "Live connections" },
            { label: "Connected Protos", value: connectedPlatforms.length, sub: "Social fabric" },
            { label: "Top Frequency", value: topLink?.title || "Quiet...", sub: "High resonance", truncate: true },
          ].map((metric) => (
            <div 
              key={metric.label}
              className="group relative flex items-center justify-between rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/30 p-4 transition-all hover:bg-[var(--saas-bg-elevated)]/60"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--saas-text-secondary)] opacity-50 group-hover:opacity-100 transition-opacity">
                  {metric.label}
                </p>
                <p className={cx(
                    "mt-1 font-black text-[var(--saas-text-primary)] tracking-tight truncate",
                    metric.truncate ? "text-sm" : "text-xl"
                )}>
                  {metric.value}
                </p>
              </div>
              <div className="text-right hidden sm:block">
                 <p className="text-[9px] font-bold italic text-[var(--saas-accent-primary)] opacity-40 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {metric.sub}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

export default function DashboardLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socialPreviewData, setSocialPreviewData] = useState(null);
  const { snapshot, loading, error, refresh, updateUser, updateLinks } =
    useDashboardData();

  const userData = snapshot?.user ?? null;
  const links = snapshot?.links ?? [];
  const analytics = snapshot?.analytics ?? null;

  const socialHandles = useMemo(
    () => ({
      youtubeId: userData?.youtubeId,
      githubUser: userData?.githubUser,
      telegramUser: userData?.telegramUser,
      instagram: userData?.instagram,
      twitter: userData?.twitter,
      linkedin: userData?.linkedin,
      tiktok: userData?.tiktok,
    }),
    [
      userData?.githubUser,
      userData?.instagram,
      userData?.linkedin,
      userData?.telegramUser,
      userData?.tiktok,
      userData?.twitter,
      userData?.youtubeId,
    ],
  );

  const { data: socialData } = useSocialProfiles(socialHandles);

  useEffect(() => {
    if (socialData) {
      setSocialPreviewData(socialData);
    }
  }, [socialData]);

  useEffect(() => {
    if (!loading && userData && !userData.username) {
      navigate("/create-profile");
    }
  }, [loading, navigate, userData]);

  useEffect(() => {
    if (userData?.theme) {
      document.documentElement.setAttribute("data-theme", userData.theme);
    }

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }, [userData]);

  function handleLogout() {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.documentElement.removeAttribute("data-theme");
    navigate("/login");
  }

  if (loading && !snapshot) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[284px_minmax(0,1fr)]">
          <div className="hidden h-[calc(100vh-4rem)] rounded-[32px] bg-white/5 lg:block" />
          <DashboardPageSkeleton />
        </div>
      </div>
    );
  }

  if (error && !snapshot) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4 text-center">
        <div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            Unable to load your dashboard
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Please refresh and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.18),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(236,72,153,0.12),transparent_22%),linear-gradient(180deg,rgba(10,10,10,0.98),rgba(10,10,10,1))]" />
      <div className="grid min-h-screen lg:grid-cols-[284px_minmax(0,1fr)]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={userData}
          links={links}
        />

        <div className="min-w-0">
          <TopNavbar
            user={userData}
            links={links}
            analytics={analytics}
            onMenuClick={() => setSidebarOpen(true)}
            onLogout={handleLogout}
          />

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
              <main className="min-w-0">
                <Suspense fallback={<DashboardPageSkeleton />}>
                  <Routes>
                    <Route
                      index
                      element={
                        <DashboardOverview
                          userData={userData}
                          links={links}
                          analytics={analytics}
                          socialPreviewData={socialPreviewData}
                        />
                      }
                    />
                    <Route
                      path="my-page"
                      element={
                        <DashboardProfile
                          userData={userData}
                          onRefresh={refresh}
                          onUserChange={updateUser}
                        />
                      }
                    />
                    <Route
                      path="links"
                      element={
                        <DashboardLinks
                          links={links}
                          onRefresh={refresh}
                          onLinksChange={updateLinks}
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
                      path="analytics"
                      element={<DashboardAnalytics analytics={analytics} />}
                    />
                    <Route
                      path="settings"
                      element={
                        <DashboardSettings
                          userData={userData}
                          links={links}
                          onLogout={handleLogout}
                        />
                      }
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </Suspense>
              </main>

              <aside className="hidden 2xl:block">
                <div className="sticky top-28">
                  <PreviewRail
                    userData={userData}
                    links={links}
                    analytics={analytics}
                    socialPreviewData={socialPreviewData}
                  />
                </div>
              </aside>
            </div>

            <div className="mt-6 2xl:hidden">
              <div className="dashboard-mobile-rail">
                <div className="dashboard-mobile-rail-item">
                  <PreviewRail
                    userData={userData}
                    links={links}
                    analytics={analytics}
                    socialPreviewData={socialPreviewData}
                  />
                </div>
                <div className="dashboard-mobile-rail-item">
                  <DashboardCard className="h-full">
                    <div className="flex items-center gap-3">
                      <div className="dashboard-accent-icon-secondary h-11 w-11">
                        <Globe2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">
                          Creator focus
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                          Keep this week simple
                        </h3>
                      </div>
                    </div>
                    <div className="mt-5 space-y-3 text-sm text-[var(--text-muted)]">
                      <div className="rounded-[22px] border border-[var(--card-border)] bg-white/5 p-4">
                        Promote the top link already earning the most clicks.
                      </div>
                      <div className="rounded-[22px] border border-[var(--card-border)] bg-white/5 p-4">
                        Refresh your theme after launching a new campaign.
                      </div>
                      <div className="rounded-[22px] border border-[var(--card-border)] bg-white/5 p-4">
                        Add social proof so new visitors trust the page faster.
                      </div>
                    </div>
                  </DashboardCard>
                </div>
                <div className="dashboard-mobile-rail-item">
                  <DashboardCard className="h-full">
                    <div className="flex items-center gap-3">
                      <div className="dashboard-accent-icon h-11 w-11">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">
                          Traffic snapshot
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                          {analytics?.todayClicks || 0} visits today
                        </h3>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">
                      Your audience is currently engaging with{" "}
                      {analytics?.topLinks?.[0]?.title || "your page"}. Use the
                      full analytics view for the longer trend.
                    </p>
                  </DashboardCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
