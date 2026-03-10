import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import CreatorCard from "./CreatorCard";

function CreatorSkeleton({ isLightMode }) {
  const skeletonClass = isLightMode ? "bg-slate-200/70" : "bg-white/10";

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className={`h-36 animate-pulse rounded-2xl ${skeletonClass}`} />
      <div
        className={`-mt-10 h-20 w-20 animate-pulse rounded-2xl border-4 border-slate-950/70 ${skeletonClass}`}
      />
      <div
        className={`mt-4 h-5 w-36 animate-pulse rounded-full ${skeletonClass}`}
      />
      <div
        className={`mt-3 h-4 w-full animate-pulse rounded-full ${skeletonClass}`}
      />
      <div
        className={`mt-2 h-4 w-2/3 animate-pulse rounded-full ${skeletonClass}`}
      />
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className={`h-14 animate-pulse rounded-2xl ${skeletonClass}`}
          />
        ))}
      </div>
      <div className={`mt-5 h-11 animate-pulse rounded-2xl ${skeletonClass}`} />
    </div>
  );
}

export default function CreatorShowcaseSection({
  creators,
  loading,
  source,
  chipClass,
  primaryTextClass,
  secondaryTextClass,
  isLightMode,
}) {
  return (
    <section id="creators" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div
              className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${chipClass}`}
            >
              <Sparkles className="h-4 w-4 text-fuchsia-300" />
              Featured Creators
            </div>
            <h2
              className={`font-display text-4xl font-semibold tracking-tight sm:text-5xl ${primaryTextClass}`}
            >
              Real creators building their LinkHub pages.
            </h2>
            <p
              className={`mt-4 max-w-2xl text-base leading-8 ${secondaryTextClass}`}
            >
              Explore live profiles from the platform with banner visuals,
              social momentum, and creator identity surfaced in one premium
              showcase.
            </p>
          </div>
          <div className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
            {source === "fallback"
              ? "Showing curated placeholder creators while the database is empty."
              : "Showing live creator data from /api/users/featured."}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {loading
            ? [0, 1, 2].map((item) => (
                <CreatorSkeleton key={item} isLightMode={isLightMode} />
              ))
            : creators.map((creator, index) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  index={index}
                  isLightMode={isLightMode}
                />
              ))}
        </motion.div>
      </div>
    </section>
  );
}
