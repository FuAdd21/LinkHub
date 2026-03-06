import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  User,
  Link2,
  Share2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import DashboardProfile from "./DashboardProfile";
import DashboardLinks from "./DashboardLinks";
import DashboardSocials from "./DashboardSocials";
import DashboardAnalytics from "./DashboardAnalytics";
import DashboardSettings from "./DashboardSettings";
import PhonePreview from "../../components/PhonePreview";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const NAV_ITEMS = [
  { path: "/dashboard", icon: User, label: "Profile", end: true },
  { path: "/dashboard/links", icon: Link2, label: "Links" },
  { path: "/dashboard/socials", icon: Share2, label: "Socials" },
  { path: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const DashboardLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userLinks, setUserLinks] = useState([]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [meRes, linksRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/mylinks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUserData(meRes.data);
      setUserLinks(linksRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Apply theme from user data
  useEffect(() => {
    if (userData?.theme) {
      document.documentElement.setAttribute("data-theme", userData.theme);
    }
  }, [userData?.theme]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Reset theme on logout
    document.documentElement.removeAttribute("data-theme");
    navigate("/login");
  };

  const refreshData = () => {
    fetchUserData();
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 border-r flex flex-col
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          backgroundColor: "var(--nav-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b"
             style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                 style={{ background: "var(--logo-gradient)" }}>
              L
            </div>
            <span className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
              LinkHub
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "var(--nav-active-bg)" : "transparent",
                color: isActive ? "var(--nav-active)" : "var(--nav-text)",
              })}
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t" style={{ borderColor: "var(--card-border)" }}>
          {userData?.username && (
            <a
              href={`/${userData.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 mb-2 rounded-xl text-sm transition-colors"
              style={{ color: "var(--accent)" }}
            >
              <ExternalLink className="w-4 h-4" />
              View Public Page
            </a>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-red-400/70 text-sm hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--bg-primary) 80%, transparent)",
                  borderColor: "var(--card-border)",
                }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            style={{ color: "var(--text-muted)" }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block" style={{ color: "var(--text-muted)" }}>
              Welcome back,{" "}
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {userData?.name || "Creator"}
              </span>
            </span>
          </div>
          <div />
        </header>

        {/* Content area with optional phone preview */}
        <div className="flex-1 flex">
          {/* Main scrollable content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route
                index
                element={
                  <DashboardProfile
                    userData={userData}
                    onRefresh={refreshData}
                  />
                }
              />
              <Route
                path="links"
                element={
                  <DashboardLinks
                    links={userLinks}
                    onRefresh={refreshData}
                  />
                }
              />
              <Route
                path="socials"
                element={
                  <DashboardSocials
                    userData={userData}
                    onRefresh={refreshData}
                  />
                }
              />
              <Route path="analytics" element={<DashboardAnalytics />} />
              <Route
                path="settings"
                element={
                  <DashboardSettings
                    userData={userData}
                    onRefresh={refreshData}
                  />
                }
              />
            </Routes>
          </main>

          {/* Live Phone Preview (desktop only) */}
          <aside className="hidden xl:block w-[340px] border-l p-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto"
                 style={{ borderColor: "var(--card-border)" }}>
            <PhonePreview userData={userData} links={userLinks} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
