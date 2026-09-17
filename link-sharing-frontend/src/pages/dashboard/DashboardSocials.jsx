import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MoreVertical, RefreshCw, CheckCircle2, Link2, ExternalLink } from "lucide-react";
import { api } from "../../api/config";

function numberToWords(num) {
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  return words[num] || num;
}

export default function DashboardSocials({
  userData,
  integrationsData,
  onRefresh,
  onUserChange,
  onIntegrationsChange,
}) {
  const [data, setData] = useState(integrationsData || { connected: [], available: [] });
  const [activeMenu, setActiveMenu] = useState(null);
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

      // Re-fetch integrations from backend
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

  const handleSync = async (provider) => {
    setLoadingAction(provider);
    const toastId = toast.loading(`Syncing ${provider}...`);
    try {
      await api.post(`/api/integrations/${provider}/sync`);
      toast.success(`${provider} synced successfully`, { id: toastId });

      const res = await api.get("/api/integrations");
      setData(res.data);
      onIntegrationsChange?.(res.data);
    } catch {
      toast.error(`Failed to sync ${provider}`, { id: toastId });
    } finally {
      setLoadingAction(null);
      setActiveMenu(null);
    }
  };

  const connectedList = data?.connected || [];
  const availableList = data?.available || [];
  const activeCount = connectedList.length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1">
          Connect your identity stack and automate profile updates.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Connected tools
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sync destinations, audience signals, and publishing workflows.
            </p>
          </div>

          <button
            onClick={() => toast("Integration catalog is up to date", { icon: "📦" })}
            className="px-4 py-2 rounded-lg bg-[#13120D] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Browse catalog
          </button>
        </div>
      </div>

      {/* Dynamic Active Sync Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#13120D] border border-white/5">
        <div className="w-6 h-6 rounded-full bg-[#c6f035] text-[#0B0A07] font-mono font-bold text-xs flex items-center justify-center shrink-0">
          {activeCount}
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">
            {numberToWords(activeCount)} integrations are active
          </h4>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
            {data?.lastSyncSummary || "Last sync completed 3 minutes ago."}
          </p>
        </div>
      </div>

      {/* SECTION 1: CONNECTED (2x2 Grid) */}
      <div className="space-y-4">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Connected
        </span>

        {connectedList.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#13120D] border border-white/5 text-center text-xs text-slate-500">
            No tools currently connected. Choose an integration below to connect your profile stack.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedList.map((tool) => (
              <div
                key={tool.provider}
                className="relative p-5 rounded-xl bg-[#13120D] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between h-36"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1a1914] border border-white/5 flex items-center justify-center font-mono font-bold text-xs text-slate-300">
                      {tool.badge}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{tool.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === tool.provider ? null : tool.provider);
                      }}
                      className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenu === tool.provider && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-9 w-40 rounded-xl bg-[#161510] border border-white/10 shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <button
                          onClick={() => handleSync(tool.provider)}
                          disabled={loadingAction === tool.provider}
                          className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Sync now
                        </button>
                        <div className="my-1 border-t border-white/5" />
                        <button
                          onClick={() => handleToggle(tool.provider, "available")}
                          disabled={loadingAction === tool.provider}
                          className="w-full px-3.5 py-2 text-left text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                        >
                          Disconnect
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c6f035] animate-pulse" />
                    <span className="text-slate-300 font-medium">Connected</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    {tool.timeAgo || "2 min ago"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: AVAILABLE (3x2 Grid) */}
      <div className="space-y-4 pt-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Available
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableList.map((tool) => (
            <div
              key={tool.provider}
              className="p-5 rounded-xl bg-[#13120D] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between h-44"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#1a1914] border border-white/5 flex items-center justify-center font-mono font-bold text-xs text-slate-300">
                  {tool.badge}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{tool.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {tool.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(tool.provider, "connected")}
                disabled={loadingAction === tool.provider}
                className="w-fit px-4 py-1.5 rounded-lg bg-[#1a1914] hover:bg-white/10 border border-white/5 text-xs font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-50"
              >
                {loadingAction === tool.provider ? "Connecting..." : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
