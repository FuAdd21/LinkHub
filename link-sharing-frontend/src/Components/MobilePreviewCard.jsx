import { motion } from "framer-motion";
import { ArrowUpRight, Link2, Sparkles, Users } from "lucide-react";
import {
  FaDribbble,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import {
  formatCompactNumber,
  getCreatorInitial,
  getCreatorTheme,
  normalizeCreator,
  resolveAssetUrl,
} from "../utils/featuredCreators";

const PLATFORM_META = {
  instagram: { icon: FaInstagram, color: "#E4405F" },
  linkedin: { icon: FaLinkedin, color: "#0A66C2" },
  spotify: { icon: FaSpotify, color: "#1DB954" },
  dribbble: { icon: FaDribbble, color: "#EA4C89" },
  youtube: { icon: FaYoutube, color: "#FF0000" },
  github: { icon: FaGithub, color: "#94a3b8" },
  twitter: { icon: FaTwitter, color: "#1DA1F2" },
  tiktok: { icon: FaTiktok, color: "#f9fafb" },
  telegram: { icon: FaTelegram, color: "#229ED9" },
  globe: { icon: FaGlobe, color: "#a855f7" },
};

function getPlatformMeta(platform) {
  return PLATFORM_META[platform] || PLATFORM_META.globe;
}

export function MobilePreviewSkeleton({ className = "" }) {
  return (
    <div className={`relative w-[280px] max-w-full ${className}`}>
      <div className="rounded-[2.8rem] border border-white/10 bg-white/5 p-2 shadow-[0_30px_90px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="mx-auto mb-2 h-5 w-24 rounded-full bg-black/30" />
        <div className="space-y-4 rounded-[2.2rem] border border-white/10 bg-slate-950/80 p-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 animate-pulse rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-24 animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-32 animate-pulse rounded-full bg-white/5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-12 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-12 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-11 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MobilePreviewCard({
  creator,
  className = "",
  style,
  priority = false,
  themeOverride,
}) {
  const normalizedCreator = normalizeCreator({
    ...creator,
    theme: themeOverride || creator?.theme,
  });
  const theme = getCreatorTheme(
    themeOverride || normalizedCreator.theme,
    normalizedCreator.backgroundType,
    normalizedCreator.backgroundValue
  );
  const avatarUrl = resolveAssetUrl(normalizedCreator.avatar);
  const socials = normalizedCreator.socials.slice(0, 3);
  const previewLinks = normalizedCreator.links.length
    ? normalizedCreator.links.slice(0, 4)
    : [
        {
          id: `${normalizedCreator.id}-placeholder-link`,
          title: "Creator page coming soon",
          platform: "globe",
        },
      ];

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={`relative w-[280px] max-w-full ${className}`}
      style={style}
    >
      <div
        className="pointer-events-none absolute -inset-4 rounded-[3rem] opacity-80 blur-3xl"
        style={{ background: theme.accentGlow }}
      />
      <div
        className="relative rounded-[2.8rem] border p-2 backdrop-blur-xl"
        style={{
          background: theme.phoneShell,
          borderColor: theme.phoneBorder,
          boxShadow: theme.shadow,
        }}
      >
        <div
          className="mx-auto mb-2 h-5 w-24 rounded-full"
          style={{ background: theme.notch }}
        />
        <div
          className="relative overflow-hidden rounded-[2.2rem] border p-4"
          style={{
            background: theme.screenBackground,
            borderColor: theme.screenBorder,
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28"
            style={{ background: theme.headerGlow }}
          />
          <div className="pointer-events-none absolute right-4 top-4 h-20 w-20 rounded-full border border-white/10 opacity-50" />
          <div className="pointer-events-none absolute left-3 top-16 h-16 w-16 rounded-full border border-white/10 opacity-20" />

          <div className="relative z-10 flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{
                color: theme.text,
                background: theme.badgeBg,
                borderColor: theme.badgeBorder,
              }}
            >
              <Sparkles className="h-3 w-3" />
              Live page
            </span>
            <span
              className="rounded-full border px-2.5 py-1 text-[10px] font-medium"
              style={{
                color: theme.mutedText,
                background: theme.badgeBg,
                borderColor: theme.badgeBorder,
              }}
            >
              {theme.label}
            </span>
          </div>

          <div className="relative z-10 mt-5 flex items-start gap-3">
            <div className="relative h-14 w-14 flex-shrink-0">
              <div
                className="absolute inset-0 rounded-full blur-md"
                style={{ background: theme.accentGlow, opacity: 0.8 }}
              />
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/15 bg-black/20">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={normalizedCreator.username}
                    className="h-full w-full object-cover"
                    loading={priority ? "eager" : "lazy"}
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-lg font-bold"
                    style={{ color: theme.text }}
                  >
                    {getCreatorInitial(normalizedCreator.username)}
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold leading-none" style={{ color: theme.text }}>
                @{normalizedCreator.username}
              </p>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: theme.mutedText }}>
                {normalizedCreator.bio}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-4 grid grid-cols-3 gap-2">
            {[
              {
                icon: Users,
                label: "Audience",
                value:
                  normalizedCreator.stats.followers > 0
                    ? formatCompactNumber(normalizedCreator.stats.followers)
                    : "Live",
              },
              {
                icon: Link2,
                label: "Links",
                value: normalizedCreator.stats.linkCount,
              },
              {
                icon: Sparkles,
                label: "Socials",
                value: normalizedCreator.stats.socialCount,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border px-2 py-2.5 text-center"
                style={{
                  background: theme.statCard,
                  borderColor: theme.statBorder,
                }}
              >
                <stat.icon
                  className="mx-auto mb-1 h-3.5 w-3.5"
                  style={{ color: theme.accent }}
                />
                <p className="text-sm font-semibold leading-none" style={{ color: theme.text }}>
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em]" style={{ color: theme.softText }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-3 grid grid-cols-3 gap-2">
            {socials.map((social) => {
              const socialMeta = getPlatformMeta(social.platform);
              const Icon = socialMeta.icon;

              return (
                <div
                  key={`${normalizedCreator.id}-${social.platform}`}
                  className="rounded-2xl border px-2 py-2 text-center"
                  style={{
                    background: theme.socialBg,
                    borderColor: theme.socialBorder,
                  }}
                >
                  <Icon
                    className="mx-auto mb-1 h-3.5 w-3.5"
                    style={{ color: socialMeta.color }}
                  />
                  <p className="truncate text-[11px] font-semibold" style={{ color: theme.text }}>
                    {social.platform}
                  </p>
                  <p className="truncate text-[10px]" style={{ color: theme.softText }}>
                    {social.handle}
                  </p>
                </div>
              );
            })}
            {!socials.length && (
              <div
                className="col-span-3 rounded-2xl border px-3 py-3 text-center text-[11px]"
                style={{
                  background: theme.socialBg,
                  borderColor: theme.socialBorder,
                  color: theme.softText,
                }}
              >
                Social cards appear automatically when creator accounts are connected.
              </div>
            )}
          </div>

          <div className="relative z-10 mt-3 space-y-2">
            {previewLinks.map((link) => {
              const linkMeta = getPlatformMeta(link.platform || link.icon);
              const Icon = linkMeta.icon;

              return (
                <div
                  key={link.id}
                  className="group flex items-center gap-3 rounded-2xl border px-3.5 py-3"
                  style={{
                    background: theme.linkBg,
                    borderColor: theme.linkBorder,
                  }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-xl"
                    style={{ background: `${linkMeta.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: linkMeta.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-medium"
                      style={{ color: theme.linkText }}
                    >
                      {link.title}
                    </p>
                    <p className="truncate text-[11px]" style={{ color: theme.softText }}>
                      {link.platform || "creator link"}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{ color: theme.softText }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

