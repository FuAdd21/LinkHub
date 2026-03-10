import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ChevronRight,
  Globe2,
  Layers3,
  Link2,
  MoonStar,
  Palette,
  Sparkles,
  SunMedium,
  WandSparkles,
} from "lucide-react";
import MobilePreviewCard, { MobilePreviewSkeleton } from "./MobilePreviewCard";
import CreatorShowcaseSection from "./CreatorShowcaseSection";
import useFeaturedCreators from "../hooks/useFeaturedCreators";
import {
  FEATURED_FALLBACK_CREATORS,
  THEME_SHOWCASE_PRESETS,
  normalizeCreator,
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
    className:
      "left-1/2 top-4 z-20 -translate-x-1/2 md:left-[6%] md:top-10 md:translate-x-0 lg:top-8",
    visibility: "flex",
    rotation: -7,
    floatOffset: -12,
    parallaxX: 22,
    parallaxY: -16,
    scale: 1,
    duration: 6.2,
  },
  {
    className: "right-[4%] top-16 hidden lg:flex",
    visibility: "hidden lg:flex",
    rotation: 8,
    floatOffset: -16,
    parallaxX: -20,
    parallaxY: 12,
    scale: 0.94,
    duration: 7.4,
  },
];

const HERO_SOCIAL_PROOF = [
  { icon: FaYoutube, label: "YouTube" },
  { icon: FaGithub, label: "GitHub" },
  { icon: FaInstagram, label: "Instagram" },
];

function getInitialLandingMode() {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem("linkhub-landing-mode") || "dark";
}

const WelcomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [landingMode, setLandingMode] = useState(getInitialLandingMode);
  const [activeTheme, setActiveTheme] = useState(THEME_SHOWCASE_PRESETS[0].id);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { creators, loading, source } = useFeaturedCreators(3);
  const isLightMode = landingMode === "light";
  const featuredCreators = creators.length
    ? creators.map(normalizeCreator)
    : resolveFeaturedCreators(FEATURED_FALLBACK_CREATORS, 3);
  const heroCreators = featuredCreators.slice(0, 2);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("linkhub-landing-mode", landingMode);
    document.documentElement.style.colorScheme = isLightMode ? "light" : "dark";

    return () => {
      document.documentElement.style.colorScheme = "";
    };
  }, [isLightMode, landingMode]);

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

  const toggleLandingMode = () => {
    setLandingMode((currentMode) =>
      currentMode === "dark" ? "light" : "dark",
    );
  };

  const primaryTextClass = isLightMode ? "text-slate-950" : "text-white";
  const secondaryTextClass = isLightMode ? "text-slate-600" : "text-white/60";
  const softTextClass = isLightMode ? "text-slate-500" : "text-white/50";
  const chipClass = isLightMode
    ? "border-slate-200 bg-white/90 text-slate-700 shadow-[0_18px_40px_rgba(148,163,184,0.18)]"
    : "border-white/10 bg-white/5 text-white/70 backdrop-blur-xl";
  const headerLinkClass = isLightMode
    ? "text-slate-600 hover:text-slate-950"
    : "text-white/60 hover:text-white";
  const loginButtonClass = isLightMode
    ? "border-slate-200 bg-white/90 text-slate-700 hover:text-slate-950 shadow-[0_12px_32px_rgba(148,163,184,0.16)]"
    : "border-white/10 bg-white/5 text-white/70 hover:text-white backdrop-blur-xl";
  const secondaryButtonClass = isLightMode
    ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 shadow-[0_18px_40px_rgba(148,163,184,0.16)]"
    : "border-white/10 bg-white/5 text-white/80 backdrop-blur-xl hover:bg-white/10 hover:text-white";
  const panelClass = isLightMode
    ? "border-slate-200 bg-white text-slate-700"
    : "border-white/10 bg-white/5 text-white/60";
  const themeButtonInactiveClass = isLightMode
    ? "border-slate-200 bg-white hover:bg-slate-100"
    : "border-white/10 bg-white/5 hover:bg-white/8";
  const themeButtonActiveClass = isLightMode
    ? "border-slate-300 bg-slate-100 shadow-[0_16px_34px_rgba(148,163,184,0.16)]"
    : "border-white/20 bg-white/10";
  const innerThemeCardClass = isLightMode
    ? "border-slate-200 bg-white"
    : "border-white/10 bg-white/5";
  const ctaInnerClass = isLightMode ? "bg-white/88" : "bg-slate-950/85";
  const footerBorderClass = isLightMode
    ? "border-slate-200"
    : "border-white/10";
  const footerTextClass = isLightMode ? "text-slate-500" : "text-white/45";

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
    <div
      data-landing-mode={landingMode}
      className="landing-page relative min-h-screen overflow-x-hidden transition-colors duration-500"
    >
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="landing-backdrop absolute inset-0" />
        <div className="landing-grid absolute inset-0 opacity-60" />
        <div className="landing-orb-primary absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-[160px]" />
        <div className="landing-orb-secondary absolute right-0 top-40 h-[24rem] w-[24rem] rounded-full blur-[150px]" />
      </div>

      <header className="landing-header absolute inset-x-0 top-0 z-50 border-b backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#9333ea,#ec4899)] text-sm font-bold text-white shadow-[0_12px_30px_rgba(147,51,234,0.35)]">
              LH
            </div>
            <div>
              <p
                className={`font-display text-base font-semibold tracking-tight ${primaryTextClass}`}
              >
                LinkHub
              </p>
              <p className={`text-xs ${softTextClass}`}>
                Creator operating system
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a
              href="#features"
              className={`transition-colors ${headerLinkClass}`}
            >
              Features
            </a>
            <a
              href="#creators"
              className={`transition-colors ${headerLinkClass}`}
            >
              Creators
            </a>
            <a
              href="#themes"
              className={`transition-colors ${headerLinkClass}`}
            >
              Themes
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLandingMode}
              aria-label={
                isLightMode
                  ? "Switch landing page to dark mode"
                  : "Switch landing page to light mode"
              }
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2.5 text-sm font-medium transition-colors ${loginButtonClass}`}
            >
              {isLightMode ? (
                <MoonStar className="h-4 w-4" />
              ) : (
                <SunMedium className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isLightMode ? "Dark mode" : "Light mode"}
              </span>
            </button>
            <button
              onClick={() => navigate("/login")}
              className={`hidden rounded-full border px-4 py-2 text-sm transition-colors md:inline-flex ${loginButtonClass}`}
            >
              Log in
            </button>
            <button
              onClick={handlePrimaryAction}
              className="landing-ripple rounded-full bg-[linear-gradient(135deg,#9333ea,#ec4899)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(147,51,234,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Create your LinkHub
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 lg:px-8 lg:pt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[8%] top-[20%] h-44 w-44 rounded-full bg-fuchsia-500/14 blur-[110px]" />
            <div className="absolute right-[10%] top-[24%] h-72 w-72 rounded-full bg-violet-500/18 blur-[150px]" />
            <div className="absolute bottom-[12%] left-[42%] h-40 w-40 rounded-full bg-pink-500/10 blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.8) 0.7px, transparent 0.7px)",
                backgroundSize: "18px 18px",
                maskImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.9) 28%, rgba(0,0,0,0.35))",
              }}
            />
          </div>

          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease: "easeOut" }}
              className="relative z-10 max-w-[39rem]"
            >
              <div
                className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${chipClass}`}
              >
                <Sparkles className="h-4 w-4 text-fuchsia-300" />
                Real creator previews pulled from the platform
              </div>
              <h1
                className={`text-balance font-display max-w-3xl text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.05em] ${primaryTextClass}`}
              >
                <span className="block">Your entire</span>
                <span className="mt-1 block">internet presence.</span>
                <span className="mt-3 block bg-[linear-gradient(135deg,#a855f7,#ec4899)] bg-clip-text text-transparent">
                  One powerful page.
                </span>
              </h1>
              <p
                className={`mt-6 max-w-2xl text-balance text-lg leading-8 ${secondaryTextClass}`}
              >
                LinkHub turns your social presence into a living profile with
                real previews, smart links, social proof, and creator-first
                themes that explain your value instantly.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <motion.button
                  onClick={handlePrimaryAction}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  className="landing-ripple inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#9333ea,#ec4899)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_55px_rgba(147,51,234,0.36)] transition-transform duration-200 hover:shadow-[0_24px_65px_rgba(236,72,153,0.28)]"
                >
                  Create your LinkHub
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                  onClick={handleExploreCreators}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-colors ${secondaryButtonClass}`}
                >
                  Explore creators
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-3">
                  {HERO_SOCIAL_PROOF.map((platform) => {
                    const Icon = platform.icon;

                    return (
                      <div
                        key={platform.label}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 backdrop-blur-xl"
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    );
                  })}
                </div>
                <p className={`max-w-xl text-sm leading-6 ${softTextClass}`}>
                  Used by creators across YouTube, GitHub, and Instagram.
                </p>
              </div>
            </motion.div>

            <div
              className="relative mx-auto flex h-[380px] w-full max-w-[640px] items-center justify-center sm:h-[460px] lg:h-[620px]"
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
            >
              <div className="absolute inset-0 rounded-[3rem] border border-white/10 bg-[radial-gradient(circle_at_50%_48%,rgba(147,51,234,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-xl" />
              <div className="absolute inset-x-[12%] bottom-[12%] h-28 rounded-full bg-fuchsia-500/18 blur-[90px]" />
              <div className="absolute inset-x-[18%] top-[18%] h-24 rounded-full bg-violet-500/12 blur-[80px]" />
              <div className="absolute left-[14%] top-[14%] h-40 w-40 rounded-[2.5rem] border border-white/8 bg-white/5 backdrop-blur-2xl" />
              <div className="absolute right-[8%] bottom-[14%] hidden h-32 w-32 rounded-[2.2rem] border border-white/8 bg-white/5 backdrop-blur-2xl lg:block" />
              <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 opacity-40" />

              {(loading ? [0, 1] : heroCreators).map((creator, index) => {
                const layout = HERO_CARD_LAYOUT[index];

                return (
                  <motion.div
                    key={loading ? `skeleton-${index}` : creator.id}
                    animate={{ y: [0, layout.floatOffset, 0] }}
                    transition={{
                      duration: layout.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`absolute ${layout.className} ${layout.visibility}`}
                    style={{ scale: layout.scale }}
                  >
                    <motion.div
                      animate={{
                        x: pointer.x * layout.parallaxX,
                        y: pointer.y * layout.parallaxY,
                        rotate: layout.rotation + pointer.x * 5,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 16,
                      }}
                      whileHover={{ scale: 1.03 }}
                      className="relative"
                    >
                      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle,rgba(236,72,153,0.16),transparent_68%)] blur-2xl" />
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

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-5 left-4 right-4 rounded-[1.75rem] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl sm:left-8 sm:right-auto sm:w-[18rem]"
              >
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                  Why it works
                </p>
                <p className="mt-2 text-sm font-medium text-white/88">
                  One clear page for links, audience proof, and creator
                  identity.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${chipClass}`}
              >
                <WandSparkles className="h-4 w-4 text-fuchsia-300" />
                Product capabilities
              </div>
              <h2
                className={`font-display text-4xl font-semibold tracking-tight sm:text-5xl ${primaryTextClass}`}
              >
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
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(147,51,234,0.22),rgba(236,72,153,0.2))]">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3
                    className={`font-display text-xl font-semibold ${primaryTextClass}`}
                  >
                    {feature.title}
                  </h3>
                  <p className={`mt-3 text-sm leading-7 ${secondaryTextClass}`}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CreatorShowcaseSection
          creators={featuredCreators}
          loading={loading}
          source={source}
          chipClass={chipClass}
          primaryTextClass={primaryTextClass}
          secondaryTextClass={secondaryTextClass}
          isLightMode={isLightMode}
        />

        <section id="themes" className="px-6 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${chipClass}`}
              >
                <Palette className="h-4 w-4 text-fuchsia-300" />
                Theme showcase
              </div>
              <h2
                className={`font-display text-4xl font-semibold tracking-tight sm:text-5xl ${primaryTextClass}`}
              >
                The same creator page can shift tone instantly.
              </h2>
              <p
                className={`mt-5 max-w-xl text-base leading-8 ${secondaryTextClass}`}
              >
                LinkHub themes are not just color swaps. They change atmosphere,
                contrast, and depth so creators can match their audience and
                their work.
              </p>

              <div className="mt-8 space-y-3">
                {THEME_SHOWCASE_PRESETS.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setActiveTheme(themeOption.id)}
                    className={`w-full rounded-[26px] border px-5 py-4 text-left transition-all duration-200 ${
                      activeTheme === themeOption.id
                        ? themeButtonActiveClass
                        : themeButtonInactiveClass
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p
                          className={`font-display text-lg font-semibold ${primaryTextClass}`}
                        >
                          {themeOption.title}
                        </p>
                        <p
                          className={`mt-1 text-sm leading-6 ${secondaryTextClass}`}
                        >
                          {themeOption.description}
                        </p>
                      </div>
                      {activeTheme === themeOption.id && (
                        <BadgeCheck className="h-5 w-5 flex-shrink-0 text-fuchsia-300" />
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
                      <MobilePreviewCard
                        creator={themePreviewCreator}
                        themeOverride={activeTheme}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                  {[
                    {
                      title: "Theme-aware preview",
                      description:
                        "The landing page reuses the same mobile preview primitive instead of drawing static mockups.",
                    },
                    {
                      title: "Real creator content",
                      description:
                        "Links, handles, bios, and avatars are rendered from featured-user data with safe fallbacks.",
                    },
                    {
                      title: "Scalable architecture",
                      description:
                        "One component powers hero cards, showcase states, and future campaign modules.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className={`rounded-[26px] border p-5 ${innerThemeCardClass}`}
                    >
                      <p
                        className={`font-display text-lg font-semibold ${primaryTextClass}`}
                      >
                        {item.title}
                      </p>
                      <p
                        className={`mt-2 text-sm leading-7 ${secondaryTextClass}`}
                      >
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 pt-8 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,rgba(147,51,234,0.24),rgba(236,72,153,0.16))] p-[1px] shadow-[0_30px_90px_rgba(15,23,42,0.3)]">
            <div
              className={`rounded-[40px] px-8 py-12 backdrop-blur-2xl lg:px-12 lg:py-14 ${ctaInnerClass}`}
            >
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p
                    className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${panelClass}`}
                  >
                    <Link2 className="h-4 w-4 text-fuchsia-300" />
                    Built to outgrow simple link pages
                  </p>
                  <h2
                    className={`font-display text-4xl font-semibold tracking-tight sm:text-5xl ${primaryTextClass}`}
                  >
                    Launch a page that feels more like a product than a profile.
                  </h2>
                  <p
                    className={`mt-4 max-w-xl text-base leading-8 ${secondaryTextClass}`}
                  >
                    Start with a polished LinkHub page, then keep iterating with
                    analytics, themes, and richer creator modules as your
                    audience grows.
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
                    className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-colors ${secondaryButtonClass}`}
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

      <footer className={`border-t px-6 py-8 lg:px-8 ${footerBorderClass}`}>
        <div
          className={`mx-auto flex max-w-7xl flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between ${footerTextClass}`}
        >
          <div>
            <p className={`font-display ${primaryTextClass}`}>LinkHub</p>
            <p>Modern creator pages with live previews and real data.</p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className={`transition-colors ${headerLinkClass}`}
            >
              Features
            </a>
            <a
              href="#creators"
              className={`transition-colors ${headerLinkClass}`}
            >
              Creators
            </a>
            <a
              href="#themes"
              className={`transition-colors ${headerLinkClass}`}
            >
              Themes
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
