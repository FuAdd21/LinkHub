import React from "react";
import { Globe2, Link2 } from "lucide-react";
import { getAvatarUrl, getConnectedPlatforms, getVisibleLinks, formatCompactNumber } from "./dashboardUtils";

const MobilePreview = React.memo(function MobilePreview({
  user,
  links,
  socialStats,
}) {
  const avatarUrl = getAvatarUrl(user);
  const visibleLinks = getVisibleLinks(links).slice(0, 5);
  const connectedPlatforms = getConnectedPlatforms(user);

  return (
    <div className="mx-auto w-full max-w-[320px] rounded-[48px] border border-[var(--saas-border)] bg-[#050505] p-2.5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] ring-1 ring-white/10 ring-inset">
      <div className="mx-auto mb-3 h-6 w-28 rounded-full bg-black/80 flex items-center justify-center">
         <div className="w-10 h-1 rounded-full bg-white/10" />
      </div>
      
      <div className="overflow-hidden rounded-[38px] border border-[var(--saas-border)] bg-gradient-to-b from-[#0e0e11] to-[#050505] p-6 relative">
        {/* Ambient background glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[var(--saas-accent-primary)] opacity-10 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="h-22 w-22 p-1 overflow-hidden rounded-[32px] border border-[var(--saas-border)] bg-white/5 shadow-2xl relative group">
             <div className="absolute inset-0 bg-[var(--saas-accent-gradient)] opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.name || user?.username || "Creator avatar"}
                className="h-full w-full object-cover rounded-[28px] relative z-10 shadow-lg"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-black text-white bg-[var(--saas-accent-gradient)] relative z-10 rounded-[28px]">
                {(user?.username || user?.name || "L").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="mt-5">
            <h4 className="text-xl font-black text-white tracking-tight leading-none">
              @{user?.username || "creator"}
            </h4>
            <div className="mt-2.5 mx-auto h-0.5 w-6 rounded-full bg-[var(--saas-accent-primary)]" />
            <p className="mt-4 text-[13px] leading-relaxed font-medium text-white/50 px-2 line-clamp-3">
              {user?.bio || "Crafting something extraordinary for the digital world."}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2 relative z-10">
          {connectedPlatforms.length ? (
            connectedPlatforms.slice(0, 4).map((platform) => {
              const Icon = platform.icon;
              const stat = socialStats?.[platform.socialKey];
              const count =
                stat?.followers ??
                stat?.subscriberCount ??
                stat?.subscribers ??
                stat?.memberCount ??
                stat?.members;

              return (
                <div
                  key={platform.key}
                  className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-white/90 backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: platform.color }} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {count ? formatCompactNumber(count) : "Live"}
                  </span>
                </div>
              );
            })
          ) : (
             <div className="h-8 w-24 rounded-full bg-white/5 animate-pulse" />
          )}
        </div>

        <div className="mt-8 space-y-3 relative z-10">
          {visibleLinks.length ? (
            visibleLinks.map((link) => (
              <div
                key={link.id}
                className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-4 transition-all hover:bg-white/10 hover:border-white/10 hover:-translate-y-0.5 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white tracking-tight">
                    {link.title}
                  </p>
                  <p className="mt-1 truncate text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">
                    {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                  </p>
                </div>
                <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-white/5 text-white/40 group-hover:bg-[var(--saas-accent-primary)] group-hover:text-black transition-all">
                  <Link2 className="h-4 w-4" />
                </div>
              </div>
            ))
          ) : (
            [1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full rounded-2xl bg-white/5 animate-pulse" />
            ))
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2.5 py-4 border-t border-white/5">
          <Globe2 className="h-3.5 w-3.5 text-white/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            linkhub.to/{user?.username || "identity"}
          </span>
        </div>
      </div>
    </div>
  );
});

export default MobilePreview;
