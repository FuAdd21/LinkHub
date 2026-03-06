import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ChevronRight,
  Globe2,
  Layers3,
  Link2,
  Palette,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import MobilePreviewCard, {
  MobilePreviewSkeleton,
} from "./MobilePreviewCard";
import useFeaturedCreators from "../hooks/useFeaturedCreators";
import {
  FEATURED_FALLBACK_CREATORS,
  THEME_SHOWCASE_PRESETS,
  formatCompactNumber,
  getCreatorTheme,
  normalizeCreator,
  resolveAssetUrl,
  resolveFeaturedCreators,
} from "../utils/featuredCreators";

const FEATURE_CARDS = [
  {
    icon: Globe2,
    title: "Auto Import Social Profiles",
    description:
      "Paste social handles once and LinkHub turns them into polished profile modules automatically.",
  },
  {
    icon: BarChart3,
    title: "Live Social Stats",
    description:
      "Keep creator pages fresh with audience signals, synced link metadata, and visual proof of momentum.",
  },
  {
    icon: Palette,
    title: "Creator Themes",
    description:
      "Switch between bold, minimal, glass, and high-contrast surfaces without rebuilding the page.",
  },
  {
    icon: Layers3,
    title: "Smart Link Analytics",
    description:
      "Track what converts, what gets attention, and what deserves the prime slot in your page stack.",
  },
];

const HERO_CARD_LAYOUT = [
  {
    className: "left-1/2 top-8 -translate-x-1/2 lg:left-8 lg:top-4 lg:translate-x-0",
    visibility: "flex",
    rotation: -10,
    floatOffset: -18,
    parallaxX: 22,
    parallaxY: -14,
  },
  {
    className: "right-2 top-24 hidden md:flex lg:right-6",
    visibility: "hidden md:flex",
    rotation: 8,
    floatOffset: -12,
    parallaxX: -18,
    parallaxY: 10,
  },
  {
    className: "bottom-0 left-8 hidden lg:flex",
    visibility: "hidden lg:flex",
    rotation: 12,
    floatOffset: -16,
    parallaxX: 16,
    parallaxY: -10,
  },
];

function ShowcaseCard({ creator }) {
  const theme = getCreatorTheme(
    creator.theme,
    creator.backgroundType,
    creator.backgroundValue
  );
  const avatarUrl = resolveAssetUrl(creator.avatar);
  const audienceLabel = creator.stats.followers
    ? `${formatCompactNumber(creator.stats.followers)} followers`
    : "Audience syncing";

  return (
    <Link to={`/${creator.username}`} className="group block">
      <div className="landing-glass landing-elevate rounded-[30px] p-5">
        <div
          className="mb-4 h-32 rounded-[24px] border"
          style={{
            background: theme.screenBackground,
            borderColor: theme.screenBorder,
          }}
        />
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 overflow-hidden rounded-full border border-white/10 bg-white/5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={creator.username}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white/80">
                {creator.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-white">
              @{creator.username}
            </p>
            <p className="truncate text-sm text-white/50">{creator.bio}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          <span>{audienceLabel}</span>
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function ShowcaseSkeleton() {
  return (
    <div className="landing-glass rounded-[30px] p-5">
      <div className="mb-4 h-32 animate-pulse rounded-[24px] bg-white/5" />
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 animate-pulse rounded-full bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 animate-pulse rounded-full bg-white/5" />
          <div className="h-3 w-40 animate-pulse rounded-full bg-white/5" />
        </div>
      </div>
      <div className="mt-4 h-12 animate-pulse rounded-[22px] bg-white/5" />
    </div>
  );
}

const WelcomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTheme, setActiveTheme] = useState(THEME_SHOWCASE_PRESETS[0].id);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { creators, loading, source } = useFeaturedCreators(3);
  const featuredCreators = creators.length
    ? creators.map(normalizeCreator)
    : resolveFeaturedCreators(FEATURED_FALLBACK_CREATORS, 3);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handlePrimaryAction = () => {
    if (user) {
      navigate("/dashboard");
      return;
    }

    navigate("/register");
  };

  const handleExploreCreators = () => {
    document.getElementById("creators")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setPointer({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setPointer({ x: 0, y: 0 });
  };

  const themePreviewCreator = {
    ...(featuredCreators[0] || normalizeCreator(FEATURED_FALLBACK_CREATORS[0])),
    theme: activeTheme,
    backgroundType: activeTheme === "minimal" ? "solid" : "gradient",
    backgroundValue:
      activeTheme === "minimal"
        ? "#f6f7fb"
        : activeTheme === "neon-glow"
          ? "linear-gradient(180deg, #09061c 0%, #0d1d2f 100%)"
          : activeTheme === "glass-dark"
            ? "linear-gradient(180deg, #0c1527 0%, #1a2a46 100%)"
            : null,
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816] text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_38%),radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.08),transparent_24%),linear-gradient(180deg,#040816_0%,#071126_56%,#040816_100%)]" />
        <div className="landing-grid absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[160px]" />
        <div className="absolute right-0 top-40 h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6366f1,#22c55e)] text-sm font-bold text-white shadow-[0_12px_30px_rgba(99,102,241,0.35)]">
              LH
            </div>
            <div>
              <p className="font-display text-base font-semibold tracking-tight text-white">
                LinkHub
              </p>
              <p className="text-xs text-white/45">Creator operating system</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#creators" className="transition-colors hover:text-white">
              Creators
            </a>
            <a href="#themes" className="transition-colors hover:text-white">
              Themes
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:text-white md:inline-flex"
            >
              Log in
            </button>
            <button
              onClick={handlePrimaryAction}
              className="landing-ripple rounded-full bg-[linear-gradient(135deg,#6366f1,#22c55e)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(99,102,241,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Create your LinkHub
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_0.98fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
                <BadgeCheck className="h-4 w-4 text-emerald-400" />
                Real creator previews pulled into the homepage.
              </div>
              <h1 className="font-display max-w-2xl text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Your entire internet presence. One powerful page.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
                LinkHub turns your social presence into a living profile with real stats,
                smart connections, and beautiful themes that feel built for modern creators.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handlePrimaryAction}
                  className="landing-ripple inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#6366f1,#22c55e)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(99,102,241,0.35)] transition-transform duration-200 hover:-translate-y-1"
                >
                  Create your LinkHub
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={handleExploreCreators}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-white"
                >
                  Explore creators
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    value: "Real user pages",
                    label: "Homepage cards are rendered from creator data, not static mockups.",
                  },
                  {
                    value: "Theme-aware",
                    label: "Preview cards adapt to the creator theme and background style.",
                  },
                  {
                    value: "Fast by default",
                    label: "Caching, lazy assets, and skeleton states keep the landing page responsive.",
                  },
                ].map((item) => (
                  <div key={item.value} className="landing-glass rounded-[26px] p-4">
                    <p className="font-display text-sm font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-white/50">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div
              className="relative mx-auto w-full max-w-[620px] min-h-[620px]"
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
            >
              <div className="absolute inset-x-12 bottom-8 h-28 rounded-full bg-black/45 blur-3xl" />
              <div className="absolute inset-x-8 bottom-14 h-36 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-xl" />
              <div className="absolute inset-0 rounded-[3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />

              {(loading ? [0, 1, 2] : featuredCreators).map((creator, index) => {
                const layout = HERO_CARD_LAYOUT[index];

                return (
                  <motion.div
                    key={loading ? `skeleton-${index}` : creator.id}
                    animate={{ y: [0, layout.floatOffset, 0] }}
                    transition={{
                      duration: 5.6 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`absolute ${layout.className} ${layout.visibility}`}
                  >
                    <motion.div
                      animate={{
                        x: pointer.x * layout.parallaxX,
                        y: pointer.y * layout.parallaxY,
                        rotate: layout.rotation + pointer.x * 5,
                      }}
                      transition={{ type: "spring", stiffness: 120, damping: 16 }}
                    >
                      {loading ? (
                        <MobilePreviewSkeleton />
                      ) : (
                        <MobilePreviewCard
                          creator={creator}
                          priority={index === 0}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65 backdrop-blur-xl">
                <WandSparkles className="h-4 w-4 text-indigo-300" />
                Product capabilities
              </div>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Everything creators need to look premium, measurable, and alive.
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {FEATURE_CARDS.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="landing-glass landing-elevate rounded-[30px] p-6"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(99,102,241,0.22),rgba(34,197,94,0.2))]">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="creators" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65 backdrop-blur-xl">
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                  Live creator showcase
                </div>
                <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Real LinkHub users, surfaced as the product itself.
                </h2>
              </div>
              <div className="landing-glass rounded-full px-4 py-2 text-sm text-white/60">
                {source === "fallback"
                  ? "Showing curated placeholder creators while the database is empty."
                  : "Showing live creator data from /api/users/featured."}
              </div>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {loading
                ? [0, 1, 2].map((item) => <ShowcaseSkeleton key={item} />)
                : featuredCreators.map((creator) => (
                    <ShowcaseCard key={creator.id} creator={creator} />
                  ))}
            </div>
          </div>
        </section>

        <section id="themes" className="px-6 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65 backdrop-blur-xl">
                <Palette className="h-4 w-4 text-fuchsia-300" />
                Theme showcase
              </div>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                The same creator page can shift tone instantly.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/60">
                LinkHub themes are not just color swaps. They change atmosphere,
                contrast, and depth so creators can match their audience and their work.
              </p>

              <div className="mt-8 space-y-3">
                {THEME_SHOWCASE_PRESETS.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setActiveTheme(themeOption.id)}
                    className={`w-full rounded-[26px] border px-5 py-4 text-left transition-all duration-200 ${
                      activeTheme === themeOption.id
                        ? "border-white/20 bg-white/10"
                        : "border-white/10 bg-white/5 hover:bg-white/8"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-display text-lg font-semibold text-white">
                          {themeOption.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-white/55">
                          {themeOption.description}
                        </p>
                      </div>
                      {activeTheme === themeOption.id && (
                        <BadgeCheck className="h-5 w-5 flex-shrink-0 text-emerald-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="landing-glass rounded-[36px] p-6 lg:p-8">
              <div className="grid gap-6 xl:grid-cols-[300px_1fr] xl:items-center">
                <div className="mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTheme}
                      initial={{ opacity: 0, y: 20, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.96 }}
                      transition={{ duration: 0.32 }}
                    >
                      <MobilePreviewCard creator={themePreviewCreator} themeOverride={activeTheme} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                  {[
                    {
                      title: "Theme-aware preview",
                      description: "The landing page reuses the same mobile preview primitive instead of drawing static mockups.",
                    },
                    {
                      title: "Real creator content",
                      description: "Links, handles, bios, and avatars are rendered from featured-user data with safe fallbacks.",
                    },
                    {
                      title: "Scalable architecture",
                      description: "One component powers hero cards, showcase states, and future campaign modules.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                      <p className="font-display text-lg font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-white/55">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 pt-8 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,rgba(99,102,241,0.24),rgba(34,197,94,0.16))] p-[1px] shadow-[0_30px_90px_rgba(15,23,42,0.3)]">
            <div className="rounded-[40px] bg-slate-950/85 px-8 py-12 backdrop-blur-2xl lg:px-12 lg:py-14">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65">
                    <Link2 className="h-4 w-4 text-emerald-300" />
                    Built to outgrow simple link pages
                  </p>
                  <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    Launch a page that feels more like a product than a profile.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-8 text-white/60">
                    Start with a polished LinkHub page, then keep iterating with analytics,
                    themes, and richer creator modules as your audience grows.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handlePrimaryAction}
                    className="landing-ripple inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Create your LinkHub
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleExploreCreators}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Explore creators
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-white">LinkHub</p>
            <p>Modern creator pages with live previews and real data.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#creators" className="transition-colors hover:text-white">
              Creators
            </a>
            <a href="#themes" className="transition-colors hover:text-white">
              Themes
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;

