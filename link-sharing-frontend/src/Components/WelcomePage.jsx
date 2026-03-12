import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Link2,
  Moon,
  Sun,
  Monitor,
  Palette,
  Share2,
  Sparkles,
  UserPlus,
  Zap,
  CheckCircle2,
  LayoutTemplate,
} from "lucide-react";
import PremiumDashboardPreview from "./PremiumDashboardPreview";

const FEATURE_CARDS = [
  {
    icon: Link2,
    title: "All Links in One Place",
    description: "Connect your social platforms, favorite content, and digital products effortlessly.",
  },
  {
    icon: LayoutTemplate,
    title: "Beautiful Custom Pages",
    description: "Design a hub that perfectly matches your brand with premium themes.",
  },
  {
    icon: BarChart3,
    title: "Creator Analytics",
    description: "Understand your audience deeply with real-time conversion metrics.",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Claim your URL and go live in minutes without writing any code.",
  },
  {
    icon: Globe2,
    title: "Mobile Optimized",
    description: "Your hub looks stunning and loads instantly on every device.",
  },
  {
    icon: UserPlus,
    title: "Unlimited Growth",
    description: "Capture emails and build your audience directly from your link in bio.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Create your LinkHub",
    description:
      "Claim your unique username and choose a stunning premium theme to represent your brand.",
  },
  {
    step: "2",
    title: "Add your links",
    description:
      "Drop in your social profiles, latest videos, articles, and products. We format them instantly.",
  },
  {
    step: "3",
    title: "Share everywhere",
    description:
      "Put your LinkHub link in your bio and instantly connect your audience to all of your content.",
  },
];

const WelcomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    let activeTheme = theme;
    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    root.setAttribute("data-theme", activeTheme);
    localStorage.setItem("theme", theme);
    // Support fallback for any tailwind base styles using standard dark scheme text
    root.style.colorScheme = activeTheme === "dark" ? "dark" : "light";
  }, [theme]);

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  const handlePrimaryAction = () => {
    if (user) navigate("/dashboard");
    else navigate("/register");
  };

  return (
    <div
      className="landing-page relative min-h-screen bg-[var(--saas-bg-main)] text-[var(--saas-text-primary)] transition-colors duration-300 selection:bg-purple-500/30 overflow-x-hidden font-sans"
    >
      {/* Premium Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(139,92,246,0.12),transparent_40%),radial-gradient(circle_at_85%_30%,rgba(59,130,246,0.12),transparent_40%),linear-gradient(180deg,var(--saas-bg-main)_0%,var(--saas-bg-surface)_100%)] opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(var(--saas-border)_1px,transparent_1px),linear-gradient(90deg,var(--saas-border)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000,transparent)]" />
      </div>

      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--saas-border)] bg-[var(--saas-bg-main)]/60 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--saas-accent-gradient)] font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:scale-105 transition-transform">
              LH
            </div>
            <span className="font-semibold tracking-tight text-[var(--saas-text-primary)]">
              LinkHub
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--saas-text-secondary)] md:flex">
            <a href="#features" className="hover:text-[var(--saas-text-primary)] transition-colors">Features</a>
            <a href="#demo" className="hover:text-[var(--saas-text-primary)] transition-colors">Demo</a>
            <a href="#benefits" className="hover:text-[var(--saas-text-primary)] transition-colors">Benefits</a>
            <a href="#how-it-works" className="hover:text-[var(--saas-text-primary)] transition-colors">How it works</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={cycleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--saas-border)] bg-[var(--saas-card)] text-[var(--saas-text-secondary)] hover:bg-[var(--saas-bg-elevated)] hover:text-[var(--saas-text-primary)] transition-all"
            >
              {theme === "dark" ? <Moon className="h-4 w-4" /> : theme === "light" ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="hidden text-sm font-medium text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] transition-colors sm:block"
            >
              Log in
            </button>
            <button
              onClick={handlePrimaryAction}
              className="relative overflow-hidden rounded-full bg-[var(--saas-text-primary)] px-5 py-2 text-sm font-semibold text-[var(--saas-bg-main)] transition-transform hover:scale-105 active:scale-95 shadow-sm"
            >
              <span className="relative z-10">Create LinkHub</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* 1. Hero Section - Full Viewport 100vh with 2-Column Grid */}
        <section className="relative min-h-[100vh] border-b border-[var(--saas-border)] px-6 lg:px-12 max-w-[1400px] mx-auto flex flex-col justify-center pt-24 pb-12 lg:pt-32 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center h-full w-full">
            
            {/* Left Column (Text block) */}
            <div className="text-left flex flex-col justify-center h-full pt-10 lg:pt-0 lg:pr-8 xl:pr-16 z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--saas-border)] bg-[var(--saas-card)] py-1.5 px-3 text-sm font-medium text-[var(--saas-accent-primary)] backdrop-blur-sm mb-6 lg:mb-8 self-start shadow-sm">
                <Sparkles className="h-4 w-4" />
                <span>LinkHub v2.0 is now live</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[var(--saas-text-primary)] mb-6 leading-[1.1] text-balance">
                One link to rule <br />
                <span 
                  className="inline-block bg-clip-text text-transparent"
                  style={{ backgroundImage: 'var(--saas-accent-gradient)' }}
                >
                  your audience.
                </span>
              </h1>

              <p className="text-lg text-[var(--saas-text-secondary)] mb-8 lg:mb-10 max-w-xl leading-relaxed">
                LinkHub gives you a premium, lightning-fast landing page to
                showcase your latest work, social links, and products—all in one
                place that looks absolutely stunning.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handlePrimaryAction}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--saas-accent-glow)] transition-all hover:scale-105 active:scale-95 bg-purple-600"
                  style={{ backgroundImage: 'var(--saas-accent-gradient)' }}
                >
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-[var(--saas-border)] bg-[var(--saas-card)] px-8 py-4 text-base font-medium text-[var(--saas-text-primary)] backdrop-blur-sm transition-all hover:bg-[var(--saas-bg-elevated)] hover:border-[var(--saas-border-hover)] shadow-sm"
                >
                  View Demo
                </button>
              </div>

              <div className="mt-8 lg:mt-12 flex items-center gap-4 text-sm text-[var(--saas-text-secondary)]">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-[var(--saas-bg-main)] bg-[var(--saas-accent-gradient)] shadow-sm"
                    />
                  ))}
                </div>
                <p>
                  Trusted by <span className="text-[var(--saas-text-primary)] font-medium">100,000+</span> creators
                </p>
              </div>
            </div>

            {/* Right Column (Premium SaaS Preview) */}
            <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[400px] lg:min-h-0 z-10">
               <motion.div
                 initial={{ y: 30, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                 className="relative w-full max-w-[500px] xl:max-w-[560px] ml-auto pb-10 lg:pb-0"
               >
                 <PremiumDashboardPreview />
               </motion.div>
            </div>
            
          </div>
        </section>        {/* 2. Social Proof */}
        <section
          id="stats"
          className="border-y border-[var(--saas-border)] bg-[var(--saas-bg-surface)] py-12 px-6"
        >
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-70">
            <p className="text-sm font-semibold uppercase tracking-widest text-center md:text-left text-[var(--saas-text-secondary)]">
              Trusted by leading creators
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {/* Premium abstract Logos using text for simplicity/speed but styled beautifully */}
              <span className="font-display text-2xl font-bold tracking-tighter text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] transition-colors cursor-default grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105 transform duration-300">
                Vercel
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] transition-colors cursor-default grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105 transform duration-300">
                Linear
              </span>
              <span className="font-display text-2xl font-bold tracking-widest italic text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] transition-colors cursor-default grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105 transform duration-300">
                Notion
              </span>
              <span className="font-display text-2xl flex items-center gap-1 font-bold text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] transition-colors cursor-default grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105 transform duration-300">
                <Zap className="h-5 w-5 fill-current" /> Stripe
              </span>
            </div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section id="features" className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[var(--saas-text-primary)] mb-6">
              Features that feel like magic.
            </h2>
            <p className="text-lg text-[var(--saas-text-secondary)]">
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
                className="group relative rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-card)] p-8 overflow-hidden hover:bg-[var(--saas-card-hover)] hover:border-[var(--saas-border-hover)] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--saas-accent-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--saas-bg-elevated)] text-[var(--saas-accent-primary)] border border-[var(--saas-border)] group-hover:bg-[var(--saas-accent-primary)] group-hover:text-white transition-all duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--saas-text-primary)] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--saas-text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Product Demo Section */}
        <section id="demo" className="py-32 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[var(--saas-text-primary)] mb-6">
              A dashboard you'll actually love.
            </h2>
            <p className="text-lg text-[var(--saas-text-secondary)]">
              Manage all your links, themes, and analytics from a lightning-fast, premium interface designed for speed and simplicity.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative lg:mx-auto max-w-5xl rounded-3xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)] shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center p-2"
          >
            {/* Faked inner dashboard browser frame */}
            <div className="w-full h-full rounded-[20px] bg-[var(--saas-bg-surface)] border border-[var(--saas-border)] overflow-hidden flex flex-col">
               <div className="h-12 border-b border-[var(--saas-border)] flex items-center px-4 gap-2 bg-[var(--saas-bg-elevated)]">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/50"/><div className="w-3 h-3 rounded-full bg-amber-400/20 border border-amber-400/50"/><div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/50"/></div>
                  <div className="mx-auto rounded-md bg-[var(--saas-bg-main)] border border-[var(--saas-border)] px-3 py-1 flex items-center text-xs text-[var(--saas-text-secondary)]"><Globe2 className="w-3 h-3 mr-2 opacity-50"/> linkhub.to/dashboard</div>
               </div>
               <div className="flex-1 p-6 lg:p-10 flex gap-6">
                 {/* Fake sidebar */}
                 <div className="hidden lg:flex w-48 flex-col gap-2">
                    <div className="h-8 w-24 bg-[var(--saas-text-primary)] rounded opacity-10 mb-6"/>
                    <div className="h-4 w-full bg-[var(--saas-card)] rounded mb-2 border border-[var(--saas-border)] p-4 flex items-center gap-3"><LayoutTemplate className="w-4 h-4 text-[var(--saas-accent-primary)]"/> <span className="text-sm font-medium text-[var(--saas-text-primary)]">Links</span></div>
                    <div className="h-4 w-full bg-transparent rounded mb-2 p-4 flex items-center gap-3"><Palette className="w-4 h-4 text-[var(--saas-text-secondary)]"/> <span className="text-sm text-[var(--saas-text-secondary)]">Design</span></div>
                    <div className="h-4 w-full bg-transparent rounded mb-2 p-4 flex items-center gap-3"><BarChart3 className="w-4 h-4 text-[var(--saas-text-secondary)]"/> <span className="text-sm text-[var(--saas-text-secondary)]">Analytics</span></div>
                 </div>
                 {/* Fake content */}
                 <div className="flex-1 flex flex-col gap-4">
                    <div className="flex justify-between items-center mb-4">
                       <div className="w-32 h-6 bg-[var(--saas-text-primary)] opacity-10 rounded"/>
                       <div className="w-24 h-8 bg-[var(--saas-accent-primary)] opacity-90 rounded-full"/>
                    </div>
                    <div className="w-full h-20 bg-[var(--saas-card)] border border-[var(--saas-border)] rounded-xl flex items-center px-6 gap-4">
                       <div className="w-10 h-10 rounded bg-[var(--saas-bg-main)] border border-[var(--saas-border)]"/>
                       <div className="flex-1"><div className="w-40 h-4 bg-[var(--saas-text-primary)] opacity-20 rounded mb-2"/><div className="w-64 h-3 bg-[var(--saas-text-secondary)] opacity-20 rounded"/></div>
                    </div>
                    <div className="w-full h-20 bg-[var(--saas-card)] border border-[var(--saas-border)] rounded-xl flex items-center px-6 gap-4">
                       <div className="w-10 h-10 rounded bg-[var(--saas-bg-main)] border border-[var(--saas-border)]"/>
                       <div className="flex-1"><div className="w-32 h-4 bg-[var(--saas-text-primary)] opacity-20 rounded mb-2"/><div className="w-48 h-3 bg-[var(--saas-text-secondary)] opacity-20 rounded"/></div>
                    </div>
                 </div>
               </div>
            </div>
            {/* Soft backdrop glow behind the dashboard */}
            <div className="absolute -inset-1 bg-[var(--saas-accent-gradient)] opacity-[0.15] blur-2xl -z-10 rounded-[40px]"/>
          </motion.div>
        </section>

        {/* 5. Benefits Section */}
        <section id="benefits" className="py-24 px-6 lg:px-8 border-y border-[var(--saas-border)] bg-[var(--saas-bg-surface)]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-12 order-2 lg:order-1">
              <div className="relative aspect-square max-w-md mx-auto w-full flex items-center justify-center">
                 {/* Decorative background circle */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-pink-600/10 rounded-full blur-3xl"/>
                 
                 <div className="relative z-10 w-full grid grid-cols-2 gap-4 gap-y-6">
                    <motion.div whileHover={{ y: -5 }} className="bg-[var(--saas-card)] border border-[var(--saas-border)] rounded-2xl p-6 shadow-lg backdrop-blur text-center col-span-2 transform -rotate-1 relative top-4">
                       <div className="w-12 h-12 mx-auto bg-[var(--saas-accent-glow)] rounded-full flex items-center justify-center text-[var(--saas-accent-primary)] mb-3"><UserPlus className="w-6 h-6"/></div>
                       <h4 className="text-[var(--saas-text-primary)] font-bold text-lg mb-1">Grow Audience</h4>
                       <p className="text-[var(--saas-text-secondary)] text-sm">Capture emails and leads natively.</p>
                    </motion.div>
                    
                    <motion.div whileHover={{ y: -5 }} className="bg-[var(--saas-card)] border border-[var(--saas-border)] rounded-2xl p-6 shadow-lg backdrop-blur text-center transform rotate-2">
                       <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-3"><Zap className="w-6 h-6"/></div>
                       <h4 className="text-[var(--saas-text-primary)] font-bold text-lg mb-1">Monetize</h4>
                       <p className="text-[var(--saas-text-secondary)] text-sm">Sell digital info products.</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-[var(--saas-card)] border border-[var(--saas-border)] rounded-2xl p-6 shadow-lg backdrop-blur text-center transform -rotate-2">
                       <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-3"><Globe2 className="w-6 h-6"/></div>
                       <h4 className="text-[var(--saas-text-primary)] font-bold text-lg mb-1">Own Your Hub</h4>
                       <p className="text-[var(--saas-text-secondary)] text-sm">Custom domain mapping.</p>
                    </motion.div>
                 </div>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[var(--saas-text-primary)] mb-6">
                Turn your following into an enterprise.
              </h2>
              <p className="text-lg text-[var(--saas-text-secondary)] mb-8">
                LinkHub isn't just about routing traffic. We provide the tools you need to build your audience, monetize your skills, and own your internet presence without relying on algorithmic feeds.
              </p>
              <ul className="space-y-4">
                {[
                  "Built-in newsletter capture forms",
                  "Sell digital products with zero fees",
                  "Connect custom domains effortlessly",
                  "Retarget visitors with pixel integration"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-[var(--saas-text-primary)] font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[var(--saas-accent-primary)]"/>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
             <h2 className="text-4xl font-bold text-[var(--saas-text-primary)] mb-6">Get started in three simple steps.</h2>
          </div>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[var(--saas-border)] to-transparent" />
            
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
               {HOW_IT_WORKS.map((step, idx) => (
                 <div key={idx} className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-[var(--saas-card)] border border-[var(--saas-border)] shadow-lg flex items-center justify-center mb-6 text-2xl font-bold text-[var(--saas-accent-primary)] relative">
                       {/* Subtle animated border glow */}
                       <div className="absolute inset-0 rounded-2xl bg-[var(--saas-accent-gradient)] opacity-0 hover:opacity-100 mix-blend-overlay transition-opacity duration-300"/>
                       {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--saas-text-primary)] mb-3">{step.title}</h3>
                    <p className="text-[var(--saas-text-secondary)] leading-relaxed">{step.description}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* 7. Final Call To Action */}
        <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-[40px] overflow-hidden border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] w-full">
            <div className="absolute inset-0 bg-[var(--saas-accent-gradient)] opacity-[0.05] pointer-events-none" />
            <div className="absolute top-0 right-0 w-full h-[500px] bg-[var(--saas-accent-gradient)] opacity-10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"/>
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-[var(--saas-accent-gradient)] opacity-10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"/>

            <div className="relative z-10 px-6 py-24 md:py-32 text-center flex flex-col items-center justify-center">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--saas-text-primary)] mb-6 max-w-2xl text-balance">
                Start building your creator hub today.
              </h2>
              <p className="text-lg text-[var(--saas-text-secondary)] mb-10 max-w-xl mx-auto">
                Join exactly zero friction. It's perfectly designed out of the box so you can focus on creating.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={handlePrimaryAction}
                  className="rounded-full bg-[var(--saas-text-primary)] px-8 py-4 text-base font-semibold text-[var(--saas-bg-main)] shadow-xl shadow-[var(--saas-accent-glow)] transition-transform hover:scale-105 active:scale-95"
                >
                  Create Your LinkHub
                </button>
              </div>
              <p className="mt-8 text-sm text-[var(--saas-text-secondary)] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--saas-text-primary)]" /> No credit card required. Free forever design.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Professional Footer */}
      <footer className="border-t border-[var(--saas-border)] bg-[var(--saas-bg-main)] pt-20 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--saas-accent-gradient)] font-bold text-white shadow-lg shadow-[var(--saas-accent-glow)]">
                LH
              </div>
              <span className="font-semibold tracking-tight text-[var(--saas-text-primary)] text-xl">
                LinkHub
              </span>
            </Link>
            <p className="text-[var(--saas-text-secondary)] text-sm max-w-sm mb-6">
              The premium creator operating system. Beautiful, fast, and built
              for conversion.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] transition-colors"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                className="text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] transition-colors"
              >
                <GitHubIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--saas-text-primary)] mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-[var(--saas-text-secondary)]">
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Docs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--saas-text-primary)] mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-[var(--saas-text-secondary)]">
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Creator Showcase
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--saas-text-primary)] mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-[var(--saas-text-secondary)]">
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--saas-text-primary)] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-[var(--saas-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--saas-text-secondary)]">
            © {new Date().getFullYear()} LinkHub Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-[var(--saas-text-secondary)]">
            <span>
              Status:{" "}
              <span className="text-emerald-500">All systems operational</span>
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
