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

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const refreshData = () => {
    fetchUserData();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#111111] border-r border-white/5 flex flex-col
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              L
            </div>
            <span className="text-white font-semibold text-lg">LinkHub</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white"
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
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`
              }
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-white/5">
          {userData?.username && (
            <a
              href={`/${userData.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 mb-2 rounded-xl text-purple-400 text-sm hover:bg-purple-500/10 transition-colors"
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
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/40 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-sm hidden sm:block">
              Welcome back,{" "}
              <span className="text-white font-medium">
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
          <aside className="hidden xl:block w-[340px] border-l border-white/5 p-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            <PhonePreview userData={userData} links={userLinks} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
