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
    <div className="mx-auto w-full max-w-[320px] rounded-[38px] border border-white/10 bg-[#0B1220] p-3 shadow-[0_30px_80px_rgba(2,6,23,0.45)]">
      <div className="mx-auto mb-3 h-6 w-24 rounded-full bg-black/70" />
      <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,1),rgba(15,23,42,0.92))] p-5">
        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_18px_40px_rgba(99,102,241,0.18)]">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.name || user?.username || "Creator avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white">
                {(user?.username || user?.name || "L").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <p className="mt-4 text-lg font-semibold text-white">
            @{user?.username || "creator"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {user?.bio || "Your page preview updates as you edit your content."}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
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
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white"
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: platform.color }} />
                  <span className="text-[11px] font-medium">
                    {count ? formatCompactNumber(count) : "Connected"}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-xs text-slate-500">
              Connect socials to display creator cards here.
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {visibleLinks.length ? (
            visibleLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/8"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {link.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {link.url}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Link2 className="h-4 w-4" />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">
              Add links to see the live preview fill out.
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Globe2 className="h-3.5 w-3.5" />
          linkhub.com/{user?.username || "creator"}
        </div>
      </div>
    </div>
  );
});

export default MobilePreview;
