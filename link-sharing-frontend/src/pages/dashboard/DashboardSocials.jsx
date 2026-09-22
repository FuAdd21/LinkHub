import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  RefreshCw,
  MoreVertical,
  User,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  X,
  Link2,
  AlertCircle,
  Share2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaSpotify,
  FaTelegram,
} from "react-icons/fa";
import { api } from "../../api/config";
import { getAvatarUrl } from "../../Components/dashboard/dashboardUtils";

const PLATFORM_ICONS = {
  youtube: FaYoutube,
  github: FaGithub,
  telegram: FaTelegram,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  twitter: FaTwitter,
  x: FaTwitter,
  linkedin: FaLinkedin,
  spotify: FaSpotify,
};

const DEFAULT_PLATFORM_META = {
  youtube: { name: "YouTube", color: "#ff0000", pillCode: "YT", label: "SUBSCRIBERS", placeholder: "e.g. @mkbhd or channel URL" },
  github: { name: "GitHub", color: "#c6f035", pillCode: "GH", label: "FOLLOWERS", placeholder: "e.g. torvalds or profile URL" },
  telegram: { name: "Telegram", color: "#229ed9", pillCode: "TG", label: "SUBSCRIBERS", placeholder: "e.g. @channel or t.me/channel" },
  instagram: { name: "Instagram", color: "#d946ef", pillCode: "IG", label: "FOLLOWERS", placeholder: "e.g. natgeo or profile URL" },
  tiktok: { name: "TikTok", color: "#00f2ff", pillCode: "TK", label: "FOLLOWERS", placeholder: "e.g. @tiktok or profile URL" },
  twitter: { name: "X (Twitter)", color: "#e2e8f0", pillCode: "X", label: "FOLLOWERS", placeholder: "e.g. @elonmusk" },
  linkedin: { name: "LinkedIn", color: "#0a66c2", pillCode: "IN", label: "CONNECTIONS", placeholder: "e.g. username or profile URL" },
  spotify: { name: "Spotify", color: "#1db954", pillCode: "SP", label: "LISTENERS", placeholder: "e.g. artist URL or name" },
};

export default function DashboardSocials({
  userData,
  integrationsData,
  onRefresh,
  onUserChange,
  onIntegrationsChange,
}) {
  const navigate = useNavigate();
  const [data, setData] = useState(integrationsData || { connected: [], available: [] });
  const [activeMenu, setActiveMenu] = useState(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  // Modal State for Connecting/Editing handles
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [modalProvider, setModalProvider] = useState("youtube");
  const [modalHandle, setModalHandle] = useState("");
  const [modalFollowers, setModalFollowers] = useState("");
  const [modalAddToLinks, setModalAddToLinks] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (integrationsData) {
      setData(integrationsData);
    }
  }, [integrationsData]);

  // Close dropdown menu on outside click
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const refreshData = async () => {
    try {
      const res = await api.get("/api/integrations");
      setData(res.data);
      onIntegrationsChange?.(res.data);
      onRefresh?.();
      return res.data;
    } catch (err) {
      console.error("Failed to reload integrations:", err);
    }
  };

  const handleSyncAll = async () => {
    setSyncingAll(true);
    const toastId = toast.loading("Syncing all connected platform APIs...");
    try {
      const connected = data?.connected || [];
      if (connected.length === 0) {
        toast("No active platforms to sync. Connect an account below.", { id: toastId, icon: "ℹ️" });
        return;
      }
      for (const tool of connected) {
        try {
          await api.post(`/api/integrations/${tool.provider}/sync`);
        } catch (e) {
          console.warn(`Sync failed for ${tool.provider}:`, e);
        }
      }
      await refreshData();
      toast.success("Live platform metrics refreshed", { id: toastId });
    } catch {
      toast.error("Failed to sync platform metrics", { id: toastId });
    } finally {
      setSyncingAll(false);
    }
  };

  const handleSyncSingle = async (provider) => {
    setLoadingAction(provider);
    const toastId = toast.loading(`Syncing live data from ${provider}...`);
    try {
      await api.post(`/api/integrations/${provider}/sync`);
      await refreshData();
      toast.success(`${provider} metrics updated`, { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to sync ${provider}`, { id: toastId });
    } finally {
      setLoadingAction(null);
      setActiveMenu(null);
    }
  };

  const handleDisconnect = async (provider) => {
    setLoadingAction(provider);
    const toastId = toast.loading(`Disconnecting ${provider}...`);
    try {
      await api.post("/api/integrations/disconnect", { provider });
      await refreshData();
      toast.success(`${provider} disconnected`, { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to disconnect ${provider}`, { id: toastId });
    } finally {
      setLoadingAction(null);
      setActiveMenu(null);
    }
  };

  const openConnectModal = (provider, currentHandle = "", currentFollowers = "") => {
    setModalProvider(provider);
    setModalHandle(currentHandle || "");
    setModalFollowers(currentFollowers && currentFollowers > 0 ? String(currentFollowers) : "");
    setModalAddToLinks(true);
    setConnectModalOpen(true);
    setActiveMenu(null);
  };

  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    if (!modalHandle.trim()) {
      toast.error("Please enter a username, handle, or URL");
      return;
    }

    setConnecting(true);
    const toastId = toast.loading(`Connecting to ${modalProvider} & verifying stats...`);

    try {
      await api.post("/api/integrations/connect", {
        provider: modalProvider,
        handle: modalHandle.trim(),
        followers: modalFollowers.trim() ? modalFollowers.trim() : undefined,
        addToLinks: modalAddToLinks,
      });
      await refreshData();
      toast.success(`${modalProvider} connected with live profile data!`, { id: toastId });
      setConnectModalOpen(false);
      setModalHandle("");
      setModalFollowers("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || `Failed to connect ${modalProvider}. Please check the handle or link.`,
        { id: toastId, duration: 5000 }
      );
    } finally {
      setConnecting(false);
    }
  };

  const avatarUrl = getAvatarUrl(userData);
  const userInitials = (userData?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const allIntegrations = data?.integrations || [];
  const connectedList =
    data?.connected && Array.isArray(data.connected) && data.connected.length > 0
      ? data.connected
      : allIntegrations.filter((i) => i.status === "connected" || i.status === "stale");

  const availableList =
    data?.available && Array.isArray(data.available) && data.available.length > 0
      ? data.available
      : allIntegrations.filter((i) => i.status !== "connected" && i.status !== "stale");

  // Fallback to platform catalog if availableList is still empty so user always has connection options
  const effectiveAvailableList =
    availableList.length > 0
      ? availableList
      : Object.entries(DEFAULT_PLATFORM_META)
          .filter(([key]) => !connectedList.some((c) => c.provider.toLowerCase() === key.toLowerCase()))
          .map(([key, val]) => ({
            provider: key,
            name: val.name,
            color: val.color,
            label: val.label,
            placeholder: val.placeholder,
            description: `Connect your ${val.name} account to stream live metrics.`,
            status: "disconnected",
          }));

  const activeCount = data?.activeCount ?? data?.connectedCount ?? connectedList.length;
  const totalAudienceFormatted = data?.totalAudienceFormatted || "0";

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Header */}
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Integrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connect external social platforms to stream live audience statistics directly into your profile.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={syncingAll || connectedList.length === 0}
          className="px-4 py-2.5 rounded-lg border border-[#c6f035] text-[#c6f035] font-bold text-xs hover:bg-[#c6f035]/10 flex items-center gap-2 transition-colors disabled:opacity-40 shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? "animate-spin" : ""}`} />
          <span>{syncingAll ? "Syncing..." : "Sync all"}</span>
        </button>
      </div>

      {/* Combined Social Reach Banner */}
      <div className="rounded-2xl bg-[#13120D] border border-white/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c6f035] font-bold">
            Combined Social Reach
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
              {totalAudienceFormatted}
            </span>
            {activeCount > 0 ? (
              <span className="text-xs font-mono font-bold text-[#c6f035]">
                {activeCount} active platform{activeCount > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-xs font-mono text-slate-500">
                0 platforms connected
              </span>
            )}
          </div>
          {activeCount === 0 && (
            <p className="text-xs text-slate-400 mt-1">
              Connect your YouTube channel, GitHub, or Instagram below to aggregate your live reach.
            </p>
          )}
        </div>

        <div className="flex items-center sm:items-end justify-between sm:justify-start sm:flex-col gap-1 text-right">
          <span className="text-xs font-mono font-bold text-[#c6f035]">
            {activeCount} / {connectedList.length + effectiveAvailableList.length} LIVE
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {data?.lastSyncSummary || (activeCount > 0 ? `${activeCount} active platform syncs` : "No active syncs")}
          </span>
        </div>
      </div>

      {/* Main Grid: Connected Network Cards (+ Preview on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Connected Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Active Connected Networks ({connectedList.length})
            </h3>
            <button
              onClick={() => openConnectModal(effectiveAvailableList[0]?.provider || "youtube")}
              className="text-xs font-mono font-bold text-[#c6f035] hover:underline flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect network</span>
            </button>
          </div>

          {connectedList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#13120D] border border-white/5 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <Link2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No platforms connected yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Connect your YouTube channel, GitHub account, Instagram, or TikTok to sync your real subscribers, followers, and social proofs dynamically.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                {effectiveAvailableList.slice(0, 2).map((p, idx) => (
                  <button
                    key={p.provider}
                    onClick={() => openConnectModal(p.provider)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 ${
                      idx === 0
                        ? "bg-[#c6f035] text-[#0d0f0d]"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect {p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {connectedList.map((net) => {
                const IconComponent = PLATFORM_ICONS[net.provider.toLowerCase()] || Link2;
                const meta = DEFAULT_PLATFORM_META[net.provider.toLowerCase()] || {};
                const netColor = net.color || meta.color || "#c6f035";

                return (
                  <div
                    key={net.provider}
                    className="p-5 rounded-2xl bg-[#13120D] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-4 relative"
                  >
                    {/* Card Top: Avatar with colored ring & Name/Handle */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-11 h-11 rounded-full border-2 p-0.5 flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ borderColor: netColor }}
                        >
                          {(() => {
                            const isGhost =
                              !net.avatar ||
                              net.avatar.includes("licdn.com/aero-v1/sc/h/") ||
                              net.avatar.includes("placeholder") ||
                              net.avatar.includes("ghost");
                            const displayAvatar = !isGhost ? net.avatar : (avatarUrl || net.avatar);

                            return displayAvatar ? (
                              <img
                                src={displayAvatar}
                                alt={net.name}
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  if (avatarUrl && displayAvatar !== avatarUrl) {
                                    e.target.src = avatarUrl;
                                    return;
                                  }
                                  const bg = (netColor || "#0a66c2").replace("#", "");
                                  e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(net.name || "User")}&backgroundColor=${bg}&textColor=ffffff`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-[#1a1914] flex items-center justify-center">
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                            );
                          })()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate max-w-[150px]">
                            {net.name}
                          </h4>
                          <p className="text-xs font-mono text-slate-500 mt-0.5 truncate max-w-[150px]">
                            {net.handle || "Connected"}
                          </p>
                        </div>
                      </div>

                      {/* Platform Badge & Menu */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                          style={{ backgroundColor: `${netColor}15`, color: netColor }}
                        >
                          {net.name}
                        </span>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(activeMenu === net.provider ? null : net.provider);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenu === net.provider && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-[#1a1914] border border-white/10 shadow-2xl z-30 py-1.5 text-xs font-mono"
                            >
                              <button
                                onClick={() => handleSyncSingle(net.provider)}
                                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-[#c6f035]" />
                                <span>Sync now</span>
                              </button>
                              <button
                                onClick={() => openConnectModal(net.provider, net.handle, net.followers)}
                                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                                <span>Edit details</span>
                              </button>
                              {net.profileUrl && (
                                <a
                                  href={net.profileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                  <span>View profile</span>
                                </a>
                              )}
                              <div className="h-px bg-white/5 my-1" />
                              <button
                                onClick={() => handleDisconnect(net.provider)}
                                className="w-full px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Disconnect</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Middle: Real Follower Count */}
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <div className="text-2xl font-mono font-black text-white tracking-tight">
                          {net.formattedFollowers || net.followers}
                        </div>
                        <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mt-0.5">
                          {net.label || "FOLLOWERS"}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#c6f035]">
                          {net.barPercent}%
                        </span>
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">
                          SHARE
                        </span>
                      </div>
                    </div>

                    {/* Card Bottom: Live status dot & sync time */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c6f035] shadow-[0_0_6px_#c6f035]" />
                        <span>Live · {net.timeAgo || "Just now"}</span>
                      </div>
                      {net.profileUrl && (
                        <a
                          href={net.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Available / Connect More Section */}
          <div className="pt-4 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
              Available Platforms ({effectiveAvailableList.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {effectiveAvailableList.map((tool) => {
                const IconComponent = PLATFORM_ICONS[tool.provider.toLowerCase()] || Link2;
                return (
                  <div
                    key={tool.provider}
                    className="p-4 rounded-xl bg-[#13120D] border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: `${tool.color || "#888"}20` }}
                      >
                        <IconComponent className="w-4 h-4" style={{ color: tool.color }} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">{tool.name}</h5>
                        <p className="text-[10px] text-slate-500 truncate">{tool.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => openConnectModal(tool.provider)}
                      className="px-3 py-1.5 rounded-lg border border-[#c6f035]/30 text-[#c6f035] hover:bg-[#c6f035] hover:text-[#0d0f0d] text-xs font-mono font-bold transition-all shrink-0"
                    >
                      Connect
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Channels & Other Socials Navigation Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#18160f] to-[#12110c] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c6f035]" />
                <h4 className="text-sm font-bold text-white font-mono">
                  Have other social media or secondary channels?
                </h4>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Want to link Twitch, Discord, Substack, WhatsApp, Medium, Spotify, a 2nd YouTube channel, or a custom portfolio? You can add unlimited custom destination buttons in the <strong className="text-white">Links</strong> tab.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/links")}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#c6f035] text-slate-200 hover:text-[#0b0a07] border border-white/10 hover:border-[#c6f035] text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              <span>Manage in Links</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 1 Col on Desktop: Live Canvas Public Profile Preview */}
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
                {userData?.name || "Your Profile"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                @{userData?.username || "username"} · {userData?.bio || "Creator & Developer"}
              </p>
            </div>

            <div className="text-xs font-bold text-[#c6f035] pt-1">
              {totalAudienceFormatted} combined audience
            </div>
          </div>

          {/* Connected mini platform pills */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
            {connectedList.length === 0 ? (
              <div className="col-span-2 text-center py-4 text-[11px] text-slate-500">
                No active platforms connected.
              </div>
            ) : (
              connectedList.map((net) => (
                <div
                  key={net.provider}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#161510] border border-white/5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: net.color }}
                    />
                    <span className="text-slate-400 font-bold truncate">{net.badge || net.name}</span>
                  </div>
                  <span className="text-white font-bold shrink-0">{net.formattedFollowers || net.followers}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Audience Composition Bars */}
      <div className="rounded-2xl bg-[#13120D] border border-white/5 p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Audience Composition
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Live totals · platform-reported
          </span>
        </div>

        {connectedList.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono py-2">
            No audience data yet. Connect YouTube, GitHub, Instagram, or TikTok to see your live audience breakdown.
          </p>
        ) : (
          <div className="space-y-4">
            {connectedList.map((net) => (
              <div key={net.provider} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">{net.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{net.barPercent}%</span>
                    <span className="text-white font-bold">{net.formattedFollowers || net.followers}</span>
                  </div>
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
        )}

        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
          <span>Totals refresh independently from each connected platform API.</span>
          <span className="text-slate-400">Live synchronization active</span>
        </div>
      </div>

      {/* ─── CONNECT ACCOUNT MODAL ─── */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#13120D] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: DEFAULT_PLATFORM_META[modalProvider]?.color || "#c6f035" }}
                />
                <h3 className="text-base font-bold text-white">
                  Connect {DEFAULT_PLATFORM_META[modalProvider]?.name || modalProvider}
                </h3>
              </div>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-[#0B0A07] border border-white/5 overflow-x-auto">
              {Object.keys(DEFAULT_PLATFORM_META).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setModalProvider(p);
                    setModalHandle("");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                    modalProvider === p
                      ? "bg-[#c6f035] text-[#0d0f0d]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {DEFAULT_PLATFORM_META[p].name}
                </button>
              ))}
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Account Handle or URL
                </label>
                <input
                  type="text"
                  value={modalHandle}
                  onChange={(e) => setModalHandle(e.target.value)}
                  placeholder={DEFAULT_PLATFORM_META[modalProvider]?.placeholder || "@handle or URL"}
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1914] border border-white/10 text-white text-sm font-mono focus:border-[#c6f035] focus:outline-none placeholder:text-slate-600"
                />

                {/* Connections / Followers Count Input for LinkedIn or manual override */}
                {(modalProvider === "linkedin" || modalFollowers !== "") && (
                  <div className="mt-3">
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      {DEFAULT_PLATFORM_META[modalProvider]?.label || "CONNECTIONS"} Count (Optional)
                    </label>
                    <input
                      type="text"
                      value={modalFollowers}
                      onChange={(e) => setModalFollowers(e.target.value)}
                      placeholder="e.g. 500 or 1250"
                      className="w-full px-4 py-2 rounded-xl bg-[#1a1914] border border-white/10 text-white text-sm font-mono focus:border-[#c6f035] focus:outline-none placeholder:text-slate-600"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      LinkedIn login wall restricts automated bots. Enter your current connections count to display on your public profile reach.
                    </p>
                  </div>
                )}

                {/* Add to Links toggle */}
                <div className="mt-3.5 pt-3 border-t border-white/5 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="addToLinksCheck"
                    checked={modalAddToLinks}
                    onChange={(e) => setModalAddToLinks(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-[#c6f035] bg-[#1a1914] border-white/20 cursor-pointer"
                  />
                  <label htmlFor="addToLinksCheck" className="text-xs font-mono text-slate-300 cursor-pointer select-none">
                    Also create a standard entry in <span className="text-[#c6f035] font-bold">Links</span> list
                    <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                      (Leave unchecked if you only want the dedicated rich card with live reach on your profile)
                    </span>
                  </label>
                </div>

                <div className="mt-2.5 p-3 rounded-xl bg-[#0b0a07] border border-white/5 text-[11px] font-mono space-y-1 text-slate-400">
                  <div className="flex items-center gap-1.5 font-bold text-slate-300">
                    <AlertCircle className="w-3.5 h-3.5 text-[#c6f035]" />
                    <span>Real-Time Verification</span>
                  </div>
                  {modalProvider === "youtube" && (
                    <p>Enter your exact channel handle (e.g. <span className="text-[#c6f035]">@mkbhd</span>) or channel link. Must be an existing public channel.</p>
                  )}
                  {modalProvider === "github" && (
                    <p>Enter your GitHub username (e.g. <span className="text-[#c6f035]">torvalds</span>) or profile link. Fetches live public followers & repos.</p>
                  )}
                  {modalProvider === "telegram" && (
                    <p>Enter your public channel or username (e.g. <span className="text-[#c6f035]">@channel</span> or <span className="text-[#c6f035]">t.me/channel</span>). Fetches live subscribers/members.</p>
                  )}
                  {modalProvider === "instagram" && (
                    <p>Enter your Instagram handle (e.g. <span className="text-[#c6f035]">natgeo</span>). Profile must be public.</p>
                  )}
                  {modalProvider === "tiktok" && (
                    <p>Enter your TikTok handle (e.g. <span className="text-[#c6f035]">@tiktok</span>).</p>
                  )}
                  {modalProvider === "linkedin" && (
                    <p>Enter your LinkedIn public profile URL or vanity username (e.g. <span className="text-[#c6f035]">in/yourname</span>). Enter your connections count above.</p>
                  )}
                  {modalProvider === "twitter" && (
                    <p>Enter your X/Twitter handle (e.g. <span className="text-[#c6f035]">@username</span>).</p>
                  )}
                  {modalProvider === "spotify" && (
                    <p>Enter your Spotify artist or user profile URL.</p>
                  )}
                  <p className="text-slate-500 pt-1 border-t border-white/5">
                    LinkHub validates live platform profiles directly. If an account does not exist or cannot be found, no dummy placeholder is created.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConnectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connecting || !modalHandle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#c6f035] text-[#0d0f0d] font-bold text-xs font-mono hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {connecting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Connecting & Fetching...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Connect Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
