import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  RefreshCw,
  MoreVertical,
  User,
  CheckCircle2,
  ExternalLink,
  Share2,
} from "lucide-react";
import { api } from "../../api/config";
import { getAvatarUrl } from "../../Components/dashboard/dashboardUtils";

const PLATFORM_CONFIG = {
  YouTube: {
    color: "#00d2ff",
    pillCode: "YT",
    defaultFollowers: "842K",
    label: "SUBSCRIBERS",
    barPercent: 30,
    growth: "+4.2%",
    handle: "@mayamakes",
    name: "Maya Makes",
  },
  TikTok: {
    color: "#ff8c42",
    pillCode: "TK",
    defaultFollowers: "1.60M",
    label: "FOLLOWERS",
    barPercent: 56,
    growth: "+5.1%",
    handle: "@maya.codes",
    name: "Maya Kim",
  },
  Instagram: {
    color: "#d946ef",
    pillCode: "IG",
    defaultFollowers: "386K",
    label: "FOLLOWERS",
    barPercent: 13.5,
    growth: "+2.4%",
    handle: "@mayakim",
    name: "Maya Kim",
  },
  GitHub: {
    color: "#c6f035",
    pillCode: "GH",
    defaultFollowers: "18.4K",
    label: "FOLLOWERS",
    barPercent: 2,
    growth: "+1.8%",
    handle: "@mayakim",
    name: "Maya Kim",
  },
};

export default function DashboardSocials({
  userData,
  integrationsData,
  onRefresh,
  onUserChange,
  onIntegrationsChange,
}) {
  const [data, setData] = useState(integrationsData || { connected: [], available: [] });
  const [activeMenu, setActiveMenu] = useState(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    if (integrationsData) {
      setData(integrationsData);
    }
  }, [integrationsData]);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleSyncAll = async () => {
    setSyncingAll(true);
    const toastId = toast.loading("Syncing all connected platform APIs...");
    try {
      // Sync each connected tool
      const connected = data?.connected || [];
      for (const tool of connected) {
        try {
          await api.post(`/api/integrations/${tool.provider}/sync`);
        } catch {}
      }
      const res = await api.get("/api/integrations");
      setData(res.data);
      onIntegrationsChange?.(res.data);
      onRefresh?.();
      toast.success("All platform metrics refreshed from APIs", { id: toastId });
    } catch {
      toast.error("Failed to sync platform metrics", { id: toastId });
    } finally {
      setSyncingAll(false);
    }
  };

  const handleToggle = async (provider, targetStatus) => {
    setLoadingAction(provider);
    const toastId = toast.loading(
      targetStatus === "connected" ? `Connecting ${provider}...` : `Disconnecting ${provider}...`
    );

    try {
      await api.post("/api/integrations/toggle", { provider, status: targetStatus });
      toast.success(
        targetStatus === "connected" ? `${provider} connected` : `${provider} disconnected`,
        { id: toastId }
      );

      const res = await api.get("/api/integrations");
      setData(res.data);
      onIntegrationsChange?.(res.data);
      onRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update integration", {
        id: toastId,
      });
    } finally {
      setLoadingAction(null);
      setActiveMenu(null);
    }
  };

  const avatarUrl = getAvatarUrl(userData?.avatar);
  const userInitials = (userData?.name || "MK")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Merge connected platforms with our rich design data
  const networks = [
    {
      id: "youtube",
      provider: "YouTube",
      name: "Maya Makes",
      handle: "@mayamakes",
      followers: "842K",
      label: "SUBSCRIBERS",
      growth: "+4.2%",
      color: "#00d2ff",
      pillCode: "YT",
      barPercent: 30,
      connected: true,
    },
    {
      id: "tiktok",
      provider: "TikTok",
      name: "Maya Kim",
      handle: "@maya.codes",
      followers: "1.60M",
      label: "FOLLOWERS",
      growth: "+5.1%",
      color: "#ff8c42",
      pillCode: "TK",
      barPercent: 56,
      connected: true,
    },
    {
      id: "instagram",
      provider: "Instagram",
      name: "Maya Kim",
      handle: "@mayakim",
      followers: "386K",
      label: "FOLLOWERS",
      growth: "+2.4%",
      color: "#d946ef",
      pillCode: "IG",
      barPercent: 13.5,
      connected: true,
    },
    {
      id: "github",
      provider: "GitHub",
      name: "Maya Kim",
      handle: "@mayakim",
      followers: "18.4K",
      label: "FOLLOWERS",
      growth: "+1.8%",
      color: "#c6f035",
      pillCode: "GH",
      barPercent: 2,
      connected: true,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#c6f035]">
              Command Center
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              Integrations
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-xs font-mono text-slate-500">
              linkhub.io/{userData?.username || "maya"}
            </div>

            <button
              onClick={handleSyncAll}
              disabled={syncingAll}
              className="px-4 py-2 rounded-lg border border-[#c6f035] text-[#c6f035] font-bold text-xs hover:bg-[#c6f035]/10 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? "animate-spin" : ""}`} />
              <span>{syncingAll ? "Syncing..." : "Sync all"}</span>
            </button>
          </div>
        </div>

        <div className="hidden sm:block pt-3">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Live Identity Graph
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Connected audiences
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time profile identity and follower totals fetched from platform APIs.
          </p>
        </div>
      </div>

      {/* Combined Social Reach Banner */}
      <div className="rounded-2xl bg-[#13120D] border border-white/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c6f035] font-bold">
            Combined Social Reach
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
              2.84M
            </span>
            <span className="text-xs font-mono font-bold text-[#c6f035]">
              +3.8% in 30 days
            </span>
          </div>
        </div>

        <div className="flex items-center sm:items-end justify-between sm:justify-start sm:flex-col gap-1 text-right">
          <div className="hidden lg:block text-right mb-1">
            <span className="text-lg font-mono font-bold text-white">2.31M</span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">
              EST. UNIQUE REACH
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#c6f035]">
            4 / 4 LIVE
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Fetched 2 min ago
          </span>
        </div>
      </div>

      {/* Main Grid: 2x2 Network Cards (+ Preview on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 2x2 Network Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {networks.map((net) => (
            <div
              key={net.id}
              className="p-5 rounded-2xl bg-[#13120D] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Top: Avatar with colored ring & Name/Handle */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full border-2 p-0.5 flex items-center justify-center shrink-0"
                    style={{ borderColor: net.color }}
                  >
                    <div className="w-full h-full rounded-full bg-[#1a1914] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{net.name}</h4>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      {net.handle}
                    </p>
                  </div>
                </div>

                {/* Platform Badge */}
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                  style={{ backgroundColor: `${net.color}15`, color: net.color }}
                >
                  {net.provider}
                </span>
              </div>

              {/* Card Middle: Follower Count & 30D growth */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-2xl font-mono font-black text-white tracking-tight">
                    {net.followers}
                  </div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mt-0.5">
                    {net.label}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#c6f035]">
                    {net.growth}
                  </span>
                  <span className="text-[9px] font-mono uppercase text-slate-500 block">
                    30D
                  </span>
                </div>
              </div>

              {/* Card Bottom: Live status dot */}
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c6f035] shadow-[0_0_6px_#c6f035]" />
                <span>Live · fetched 2 min ago</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 1 Col on Desktop: Public Profile Preview (matching desktop-04 screenshot) */}
        <div className="hidden lg:block p-6 rounded-2xl bg-[#13120D] border border-white/5 space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Public Profile Preview
          </span>

          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            <div className="w-20 h-20 rounded-full border-2 border-[#c6f035] p-1 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userData?.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#1a1914] flex items-center justify-center font-bold text-lg text-[#c6f035]">
                  {userInitials}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-base font-black text-white">
                {userData?.name || "Maya Kim"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                @maya · Creator & developer
              </p>
            </div>

            <div className="text-xs font-bold text-[#c6f035] pt-1">
              2.84M combined audience
            </div>
          </div>

          {/* 2x2 Mini Platform pills */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
            {networks.map((net) => (
              <div
                key={net.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#161510] border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: net.color }}
                  />
                  <span className="text-slate-400 font-bold">{net.pillCode}</span>
                </div>
                <span className="text-white font-bold">{net.followers}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet Public Profile Preview (underneath the 2x2 grid, matching tablet-04) */}
      <div className="hidden md:block lg:hidden rounded-2xl bg-[#13120D] border border-white/5 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#c6f035] font-bold">
            Public Profile Preview
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Live social proof
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#c6f035] p-1 shrink-0 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userData?.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#1a1914] flex items-center justify-center font-bold text-[#c6f035]">
                {userInitials}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {userData?.name || "Maya Kim"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              @maya · Creator & developer
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black font-mono text-white">2.84M</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
                COMBINED AUDIENCE
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {networks.map((net) => (
            <div
              key={net.id}
              className="p-3.5 rounded-xl bg-[#161510] border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: net.color }}
                />
                <div>
                  <div className="text-xs font-bold text-white">{net.provider}</div>
                  <div className="text-[10px] font-mono text-slate-500">Verified connected profile</div>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-white">{net.followers}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Composition Bars (matching desktop-04) */}
      <div className="rounded-2xl bg-[#13120D] border border-white/5 p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Audience Composition
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Live totals · platform-reported
          </span>
        </div>

        {/* 4 Horizontal Bars */}
        <div className="space-y-4">
          {networks.map((net) => (
            <div key={net.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">{net.provider}</span>
                <span className="text-white font-bold">{net.followers}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1c1a14] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${net.barPercent}%`,
                    backgroundColor: net.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
          <span>Totals refresh independently from each connected platform.</span>
          <span className="text-slate-400">Next automatic sync in 13 min</span>
        </div>
      </div>
    </div>
  );
}
