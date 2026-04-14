import { useMemo } from "react";
import { getAvatarUrl, getBannerUrl } from "./dashboardUtils";

export default function MobilePreview({
  user,
  links,
  socialStats,
  analytics
}) {
  const avatarUrl = getAvatarUrl(user);
  const bannerUrl = getBannerUrl(user);

  return (
    <div className="flex flex-col items-center">
      {/* Mock Phone Frame */}
      <div className="relative w-[340px] aspect-[9/18.5] bg-[#0b0e14] rounded-[3.5rem] phone-frame overflow-hidden flex flex-col font-['Inter'] ring-1 ring-white/5 shadow-2xl">
        
        {/* Phone Notch Shadow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-surface-container-highest rounded-b-2xl z-20"></div>
        
        {/* Screen Content Wrapper */}
        <div className="h-full w-full overflow-y-auto no-scrollbar relative flex flex-col">
          
          {/* Cover / Banner Section */}
          <div className="h-44 w-full relative shrink-0">
            {bannerUrl ? (
                <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
            ) : (
                <div className="w-full h-full bg-surface-container-highest/50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/40 to-transparent" />
          </div>

          {/* Profile Identity Details */}
          <div className="px-6 -mt-16 relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full p-0.5 bg-gradient-to-tr from-primary via-primary-container to-tertiary shadow-2xl shadow-primary/20">
              <div className="w-full h-full rounded-full border-4 border-[#0b0e14] overflow-hidden bg-surface-dim">
                {avatarUrl ? (
                    <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-primary/40">
                        <span className="material-symbols-outlined text-4xl">person</span>
                    </div>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <h3 className="text-xl font-black text-white tracking-tight uppercase">
                {user?.full_name || "Julian Marcus"}
              </h3>
              <p className="text-sm font-bold text-primary tracking-widest uppercase opacity-80">
                @{user?.username || "creator_hub"}
              </p>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-on-surface-variant font-medium px-4">
              {user?.bio || "Digital nomad & minimalist designer. Sharing my journey through pixels and code."}
            </p>
          </div>

          {/* Dynamic Link Matrices */}
          <div className="mt-10 px-6 space-y-4 pb-20 w-full">
            {links && links.length > 0 ? (
              links.map((link) => (
                <div 
                  key={link.id}
                  className="w-full py-4.5 px-6 glass-panel border border-white/5 rounded-2xl flex items-center justify-between group cursor-pointer transition-all hover:bg-white/5 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary shadow-inner">
                      <span className="material-symbols-outlined text-xl">
                        {link.platform === "General" ? "rocket_launch" : "alternate_email"}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white tracking-wide uppercase">{link.title}</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px] opacity-40">chevron_right</span>
                </div>
              ))
            ) : (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-full h-16 bg-white/5 rounded-2xl border border-white/5 opacity-40 animate-pulse" />
                ))}
              </div>
            )}
          </div>

          {/* Social Logo Watermark */}
          <div className="mt-auto py-8 flex justify-center opacity-10">
            <span className="text-[10px] font-black tracking-[0.5em] text-white">LINKHUB</span>
          </div>
        </div>

        {/* Home Interaction Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-20"></div>
      </div>
    </div>
  );
}
