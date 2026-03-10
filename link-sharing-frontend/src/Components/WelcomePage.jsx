import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Link2,
  Moon,
  Palette,
  Share2,
  Sparkles,
  UserPlus,
  Zap,
  CheckCircle2,
  LayoutTemplate,
} from "lucide-react";
import MobilePreviewCard, { MobilePreviewSkeleton } from "./MobilePreviewCard";
import useFeaturedCreators from "../hooks/useFeaturedCreators";
import {
  FEATURED_FALLBACK_CREATORS,
  THEME_SHOWCASE_PRESETS,
  normalizeCreator,
  resolveFeaturedCreators,
} from "../utils/featuredCreators";

const FEATURE_CARDS = [
  {
    icon: UserPlus,
    title: "Custom Profile",
    description: "Build an identity that captures your brand's unique energy.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Understand your audience with real-time conversion metrics.",
  },
  {
    icon: Link2,
    title: "Unlimited Links",
    description: "Add everything that matters. No caps, no restrictions.",
  },
  {
    icon: Share2,
    title: "Social Integrations",
    description: "Connect YouTube, Twitter, and Spotify effortlessly.",
  },
  {
    icon: Globe2,
    title: "Custom Domains",
    description: "Use your own domain for a fully white-labeled experience.",
  },
  {
    icon: Palette,
    title: "Premium Themes",
    description: "Switch your aesthetic instantly without touching code.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your profile",
    description:
      "Claim your unique LinkHub URL and set up your core identity in seconds.",
  },
  {
    step: "02",
    title: "Add your content",
    description:
      "Drop in links, socials, videos, and products. We format them perfectly.",
  },
  {
    step: "03",
    title: "Share anywhere",
    description:
      "Put your LinkHub link in your bio and watch your engagement grow.",
  },
];

const WelcomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTheme, setActiveTheme] = useState(THEME_SHOWCASE_PRESETS[0].id);
  const { creators, loading } = useFeaturedCreators(4);

  const featuredCreators = creators.length
    ? creators.map(normalizeCreator)
    : resolveFeaturedCreators(FEATURED_FALLBACK_CREATORS, 4);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("linkhub-landing-mode", "dark");
    document.documentElement.style.colorScheme = "dark";
    return () => {
      document.documentElement.style.colorScheme = "";
    };
  }, []);

  const handlePrimaryAction = () => {
    if (user) navigate("/dashboard");
    else navigate("/register");
  };

  const themePreviewCreator = {
    ...(featuredCreators[0] || normalizeCreator(FEATURED_FALLBACK_CREATORS[0])),
    theme: activeTheme,
    backgroundType: activeTheme === "minimal" ? "solid" : "gradient",
    backgroundValue:
      activeTheme === "minimal"
        ? "#f8fafc"
        : activeTheme === "neon-glow"
          ? "linear-gradient(180deg, #09061c 0%, #0d1d2f 100%)"
          : activeTheme === "glass-dark"
            ? "linear-gradient(180deg, #0c1527 0%, #1a2a46 100%)"
            : null,
  };

  return (
    <div
      data-landing-mode="dark"
      className="landing-page relative min-h-screen bg-[#000000] text-white selection:bg-purple-500/30 overflow-x-hidden font-sans"
    >
      {/* Premium Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(139,92,246,0.12),transparent_40%),radial-gradient(circle_at_85%_30%,rgba(59,130,246,0.12),transparent_40%),linear-gradient(180deg,#000000_0%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000,transparent)]" />
      </div>

      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-black/60 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              LH
            </div>
            <span className="font-semibold tracking-tight text-white">
              LinkHub
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/60 md:flex">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it works
            </a>
            <a href="#templates" className="hover:text-white transition-colors">
              Templates
            </a>
            <a href="#showcase" className="hover:text-white transition-colors">
              Showcase
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all">
              <Moon className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="hidden text-sm font-medium text-white/70 hover:text-white transition-colors md:block"
            >
              Log in
            </button>
            <button
              onClick={handlePrimaryAction}
              className="relative overflow-hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Create LinkHub</span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-fuchsia-200 opacity-0 hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* 1. Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-left lg:pr-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 px-3 text-sm font-medium text-violet-300 backdrop-blur-sm mb-8">
              <Sparkles className="h-4 w-4" />
              <span>LinkHub v2.0 is now live</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              One link to <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                rule your audience.
              </span>
            </h1>

            <p className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed">
              LinkHub gives you a premium, lightning-fast landing page to
              showcase your latest work, social links, and products—all in one
              place that looks absolutely stunning.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handlePrimaryAction}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-base font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-transform hover:scale-105 active:scale-95"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("showcase")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                View Showcase
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm text-white/50">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border border-black bg-gradient-to-br from-violet-500 to-fuchsia-500"
                  />
                ))}
              </div>
              <p>
                Trusted by <span className="text-white">100,000+</span> creators
                worldwide.
              </p>
            </div>
          </div>

          <div className="flex-1 relative w-full h-[500px] lg:h-[600px] flex items-center justify-center">
            {/* Abstract 3D Orb Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[300px] w-[300px] lg:h-[400px] lg:w-[400px] rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 opacity-60 blur-[80px] animate-pulse" />
              <div
                className="absolute h-[250px] w-[250px] lg:h-[300px] lg:w-[300px] rounded-full bg-gradient-to-bl from-blue-500 to-cyan-400 opacity-50 blur-[60px]"
                style={{ mixBlendMode: "screen" }}
              />
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 max-w-[320px] w-full transform rotate-2 shadow-2xl rounded-[32px] border border-white/20 bg-black/40 backdrop-blur-xl overflow-hidden"
            >
              {loading || !featuredCreators[0] ? (
                <MobilePreviewSkeleton />
              ) : (
                <MobilePreviewCard creator={featuredCreators[0]} priority />
              )}
            </motion.div>
          </div>
        </section>

        {/* 2. Social Proof */}
        <section
          id="stats"
          className="border-y border-white/[0.08] bg-white/[0.02] py-12 px-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
            <p className="text-sm font-semibold uppercase tracking-widest text-center md:text-left">
              Powering modern creators at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 grayscale">
              {/* Faked Premium Logos using text for simplicity/speed but styled beautifully */}
              <span className="font-display text-2xl font-bold tracking-tighter">
                Vercel
              </span>
              <span className="font-display text-2xl font-bold tracking-tight">
                Spotify
              </span>
              <span className="font-display text-2xl font-bold tracking-widest italic">
                TED
              </span>
              <span className="font-display text-2xl font-bold tracking-tight">
                Discord
              </span>
              <span className="font-display text-2xl flex items-center gap-1 font-bold">
                <Zap className="h-5 w-5 fill-current" /> Stripe
              </span>
            </div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section id="features" className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              Features that feel like magic.
            </h2>
            <p className="text-lg text-white/60">
              Everything you need to grow your audience, beautifully packaged
              into an interface you'll actually love using.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_CARDS.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 overflow-hidden hover:bg-white/[0.07] transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-violet-300 ring-1 ring-white/20 group-hover:bg-violet-500/20 group-hover:text-violet-200 transition-all">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. How It Works Section */}
        <section
          id="how-it-works"
          className="py-24 px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/[0.02]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-12">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
                    Zero to complete in minutes.
                  </h2>
                  <p className="text-lg text-white/60">
                    We removed the friction. Building your internet home is now
                    as easy as updating a social profile.
                  </p>
                </div>

                <div className="space-y-8">
                  {HOW_IT_WORKS.map((item, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 text-violet-300 font-bold text-lg">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-white/60">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-fuchsia-600/20 to-violet-600/20 blur-[80px]" />
                <div className="absolute inset-4 rounded-[40px] border border-white/20 bg-black/60 shadow-2xl backdrop-blur-xl flex flex-col justify-center p-8 gap-4 overflow-hidden">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 mx-auto mb-4" />
                  <div className="h-6 w-3/4 bg-white/10 rounded-full mx-auto" />
                  <div className="h-4 w-1/2 bg-white/5 rounded-full mx-auto mb-8" />

                  <div className="h-14 w-full bg-white/5 rounded-2xl border border-white/10" />
                  <div className="h-14 w-full bg-white/5 rounded-2xl border border-white/10" />
                  <div className="h-14 w-full bg-gradient-to-r from-violet-600/50 to-fuchsia-600/50 rounded-2xl border border-fuchsia-500/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Template Preview (New) */}
        <section
          id="templates"
          className="py-24 px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
        >
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {THEME_SHOWCASE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setActiveTheme(preset.id)}
                    className={`group relative rounded-2xl border p-4 text-left transition-all ${
                      activeTheme === preset.id
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
                        activeTheme === preset.id
                          ? "bg-violet-500 text-white"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      <Palette className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">
                      {preset.title}
                    </h4>
                    <p className="text-white/40 text-xs leading-relaxed">
                      {preset.description}
                    </p>
                    {activeTheme === preset.id && (
                      <motion.div
                        layoutId="active-glow"
                        className="absolute inset-0 rounded-2xl ring-2 ring-violet-500/50 pointer-events-none"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 order-1 lg:order-2">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
                Infinite styles. <br /> One profile.
              </h2>
              <p className="text-lg text-white/60 mb-8">
                LinkHub themes aren't just colors. They change the entire
                atmosphere, typography, and spacing of your page to match your
                brand's voice.
              </p>

              <div className="relative aspect-[4/3] bg-white/[0.02] rounded-[32px] border border-white/10 p-8 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTheme}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-[280px]"
                  >
                    <MobilePreviewCard creator={themePreviewCreator} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Creator Showcase Grid */}
        <section id="showcase" className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
                Built for top tier creators.
              </h2>
              <p className="text-lg text-white/60">
                Join thousands of creators who use LinkHub as their central hub
                across the internet.
              </p>
            </div>
            <button className="flex items-center gap-2 text-white hover:text-violet-300 transition-colors font-medium">
              View all examples <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCreators.slice(0, 4).map((creator, idx) => (
              <motion.div
                key={idx}
                className="relative w-full aspect-[9/16] max-h-[500px] rounded-[32px] border border-white/10 bg-black/40 overflow-hidden group shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="pointer-events-none absolute inset-0 transform scale-[0.65] origin-top translate-y-[-2%]">
                  <MobilePreviewCard creator={creator} priority={idx === 0} />
                </div>
                {/* Card overlay for the "Grid of example pages" look */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-semibold text-lg">
                    {creator.displayName}
                  </p>
                  <p className="text-white/60 text-sm">@{creator.username}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. Call To Action Section (Large gradient block) */}
        <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-[40px] overflow-hidden border border-white/20 bg-black w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-fuchsia-600/20 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <div className="relative z-10 px-6 py-24 md:py-32 text-center flex flex-col items-center justify-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/20">
                <LayoutTemplate className="h-8 w-8" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 max-w-2xl">
                Ready to elevate your online presence?
              </h2>
              <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
                Create your LinkHub in seconds. It's free, beautifully designed,
                and ready to help you convert your audience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={handlePrimaryAction}
                  className="rounded-full bg-white px-8 py-4 text-base font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-transform hover:scale-105"
                >
                  Create your LinkHub
                </button>
              </div>
              <p className="mt-6 text-sm text-white/50 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> No credit card required.
                Free forever design.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Professional Footer */}
      <footer className="border-t border-white/[0.08] bg-black pt-20 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 font-bold text-white shadow-lg shadow-violet-500/20">
                LH
              </div>
              <span className="font-semibold tracking-tight text-white text-xl">
                LinkHub
              </span>
            </Link>
            <p className="text-white/50 text-sm max-w-sm mb-6">
              The premium creator operating system. Beautiful, fast, and built
              for conversion.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/40 hover:text-white transition-colors"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                className="text-white/40 hover:text-white transition-colors"
              >
                <GitHubIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Docs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Creator Showcase
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} LinkHub Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <span>
              Status:{" "}
              <span className="text-emerald-400">All systems operational</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple icon components for footer
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.961h-1.96z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default WelcomePage;
