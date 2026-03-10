import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink, Link2, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  formatCompactNumber,
  resolveAssetUrl,
} from "../utils/featuredCreators";

export default function CreatorCard({ creator, isLightMode, index = 0 }) {
  const avatarUrl = resolveAssetUrl(creator.avatar);
  const bannerUrl = resolveAssetUrl(creator.banner_url);
  const followers = Number(
    creator.stats?.followers || creator.followerCount || 0,
  );
  const linksCount = Number(
    creator.stats?.linkCount || creator.links?.length || 0,
  );
  const socialsCount = Number(
    creator.stats?.socialCount || creator.socials?.length || 0,
  );
  const isVerified = followers > 10000;

  const surfaceClass = isLightMode
    ? "border-slate-200 bg-white/92 shadow-[0_20px_60px_rgba(148,163,184,0.26)]"
    : "border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(2,6,23,0.28)]";
  const chipClass = isLightMode
    ? "border-slate-200 bg-slate-100 text-slate-600"
    : "border-white/10 bg-white/5 text-white";
  const ctaClass = isLightMode
    ? "border-slate-200 bg-slate-50 text-slate-800 group-hover:bg-slate-100"
    : "border-white/15 bg-white/10 text-white group-hover:bg-white/15";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative overflow-hidden rounded-[28px] border backdrop-blur-xl ${surfaceClass}`}
    >
      <div className="relative h-36 overflow-hidden">
        {bannerUrl ? (
          <motion.img
            src={bannerUrl}
            alt={`${creator.username} banner`}
            loading="lazy"
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,rgba(147,51,234,0.45),rgba(236,72,153,0.35),rgba(59,130,246,0.32))]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.72))]" />
      </div>

      <div className="relative p-5 pt-0">
        <div className="-mt-11 flex items-end justify-between">
          <div
            className={`relative h-[84px] w-[84px] overflow-hidden rounded-[24px] border-4 shadow-[0_20px_45px_rgba(236,72,153,0.2)] ${
              isLightMode
                ? "border-white bg-slate-100"
                : "border-slate-950/70 bg-slate-900"
            }`}
          >
            <div className="pointer-events-none absolute -inset-5 rounded-[30px] bg-[radial-gradient(circle,rgba(236,72,153,0.22),transparent_70%)]" />
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={creator.username}
                loading="lazy"
                className="relative h-full w-full object-cover"
              />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center text-2xl font-semibold text-white">
                {creator.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {isVerified ? (
            <div className="inline-flex items-center gap-1 rounded-full border border-cyan-300/40 bg-cyan-300/12 px-3 py-1 text-xs font-medium text-cyan-100">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          ) : null}
        </div>

        <div className="mt-4">
          <h3
            className={`font-display text-xl font-semibold ${
              isLightMode ? "text-slate-900" : "text-white"
            }`}
          >
            @{creator.username}
          </h3>
          <p
            className={`mt-2 line-clamp-2 text-sm leading-6 ${
              isLightMode ? "text-slate-600" : "text-white/65"
            }`}
          >
            {creator.bio}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div
            className={`rounded-2xl border px-2 py-2 text-center ${chipClass}`}
          >
            <p className="text-[11px] uppercase tracking-[0.16em] opacity-70">
              Followers
            </p>
            <p className="mt-1 text-sm font-semibold">
              {formatCompactNumber(followers)}
            </p>
          </div>
          <div
            className={`rounded-2xl border px-2 py-2 text-center ${chipClass}`}
          >
            <p className="text-[11px] uppercase tracking-[0.16em] opacity-70">
              Links
            </p>
            <p className="mt-1 text-sm font-semibold">{linksCount}</p>
          </div>
          <div
            className={`rounded-2xl border px-2 py-2 text-center ${chipClass}`}
          >
            <p className="text-[11px] uppercase tracking-[0.16em] opacity-70">
              Socials
            </p>
            <p className="mt-1 text-sm font-semibold">{socialsCount}</p>
          </div>
        </div>

        <Link
          to={`/${creator.username}`}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition duration-200 ${ctaClass}`}
        >
          View Page
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.24),transparent_70%)]" />
      <div
        className={`pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] backdrop-blur ${
          isLightMode
            ? "border-slate-200 bg-white/75 text-slate-500"
            : "border-white/10 bg-slate-950/40 text-white/60"
        }`}
      >
        <Users2 className="h-3.5 w-3.5" />
        <Link2 className="h-3.5 w-3.5" />
        Live creator profile
      </div>
    </motion.article>
  );
}
