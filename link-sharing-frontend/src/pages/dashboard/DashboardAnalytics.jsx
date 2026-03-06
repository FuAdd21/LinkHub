import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { TrendingUp, MousePointer2, Eye, Smartphone } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-5 bg-white/5 border border-white/10 rounded-2xl"
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
      <span className="text-white/40 text-sm">{label}</span>
    </div>
    <p className="text-3xl font-bold text-white">{value}</p>
  </motion.div>
);

const DashboardAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-white/5 rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-16 text-white/30">
        <p>No analytics data yet</p>
      </div>
    );
  }

  // Chart data: Clicks per day
  const clicksChartData = {
    labels: (analytics.clicksPerDay || []).map((d) =>
      new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Clicks",
        data: (analytics.clicksPerDay || []).map((d) => d.clicks),
        fill: true,
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderColor: "rgba(139, 92, 246, 0.8)",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "rgba(139, 92, 246, 1)",
        tension: 0.4,
      },
    ],
  };

  // Chart data: Top links
  const topLinksData = {
    labels: (analytics.topLinks || []).map((l) =>
      l.title.length > 20 ? l.title.substring(0, 20) + "..." : l.title
    ),
    datasets: [
      {
        label: "Clicks",
        data: (analytics.topLinks || []).map((l) => l.clicks),
        backgroundColor: [
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(147, 51, 234, 0.7)",
          "rgba(14, 165, 233, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(34, 197, 94, 0.7)",
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.03)" },
        ticks: { color: "rgba(255,255,255,0.3)", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.03)" },
        ticks: { color: "rgba(255,255,255,0.3)", font: { size: 11 } },
      },
    },
  };

  // Calculate device breakdown
  const deviceMap = {};
  (analytics.deviceStats || []).forEach((d) => {
    deviceMap[d.device] = d.clicks;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-white mb-1">Analytics</h2>
      <p className="text-white/40 text-sm mb-8">Track your link performance</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={MousePointer2}
          label="Total Clicks"
          value={analytics.totalClicks || 0}
          color="#8B5CF6"
        />
        <StatCard
          icon={TrendingUp}
          label="Today"
          value={analytics.todayClicks || 0}
          color="#EC4899"
        />
        <StatCard
          icon={Smartphone}
          label="Mobile Clicks"
          value={deviceMap.mobile || 0}
          color="#3B82F6"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clicks over time */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <h3 className="text-white font-medium text-sm mb-4">
            Clicks Over Time
          </h3>
          <div className="h-56">
            {analytics.clicksPerDay?.length > 0 ? (
              <Line data={clicksChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-white/20 text-sm">
                No click data yet
              </div>
            )}
          </div>
        </div>

        {/* Top links */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <h3 className="text-white font-medium text-sm mb-4">
            Top Links
          </h3>
          <div className="h-56">
            {analytics.topLinks?.length > 0 ? (
              <Bar data={topLinksData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-white/20 text-sm">
                No click data yet
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardAnalytics;
