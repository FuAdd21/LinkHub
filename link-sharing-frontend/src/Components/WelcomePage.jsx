import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";
import {
  Zap,
  Link2,
  BarChart3,
  Palette,
  Smartphone,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleGetStarted = () => {
    if (user) navigate("/dashboard");
    else navigate("/register");
  };

  const FEATURES = [
    {
      icon: Link2,
      title: "Smart Links",
      desc: "Auto-detect platforms, fetch metadata, and display rich previews",
      color: "#8B5CF6",
    },
    {
      icon: BarChart3,
      title: "Deep Analytics",
      desc: "Track clicks, devices, and top-performing links in real time",
      color: "#EC4899",
    },
    {
      icon: Palette,
      title: "Custom Themes",
      desc: "Choose from stunning themes or craft your own unique look",
      color: "#3B82F6",
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      desc: "Premium experiences on every device, designed for creators",
      color: "#10B981",
    },
  ];

  const STEPS = [
    {
      num: "01",
      title: "Create Account",
      desc: "Sign up in seconds and claim your unique username",
    },
    {
      num: "02",
      title: "Add Your Links",
      desc: "Paste any URL — we auto-detect the platform and fetch metadata",
    },
    {
      num: "03",
      title: "Share Everywhere",
      desc: "One link for all your bios, posts, and profiles",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* ───── NAVBAR ───── */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              L
            </div>
            <span className="text-lg font-bold">LinkHub</span>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-6"
          >
            <a
              href="#features"
              className="hidden sm:block text-white/50 text-sm hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how"
              className="hidden sm:block text-white/50 text-sm hover:text-white transition-colors"
            >
              How it works
            </a>
            <button
              onClick={() => navigate("/login")}
              className="text-white/70 text-sm hover:text-white transition-colors"
            >
              Log in
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign up free
            </motion.button>
          </motion.nav>
        </div>
      </header>

      {/* ───── HERO ───── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] rounded-full bg-pink-600/8 blur-[100px]" />

        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 border border-purple-500/20 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-purple-300 text-xs font-medium">
                Next-Gen Link-in-Bio Platform
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
              One Link.
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Endless Reach.
              </span>
            </h1>

            <p className="text-white/40 text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              Connect your audience to everything you create — with one smart,
              beautiful, shareable link. Build your digital identity in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGetStarted}
                className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-base font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-shadow"
              >
                Get Started — It's Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <p className="text-white/20 text-sm">
                No credit card required
              </p>
            </div>
          </motion.div>

          {/* Right: Phone Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-[60px] rounded-full" />

              {/* Phone frame */}
              <div className="relative bg-[#1a1a1a] rounded-[2.5rem] p-3 border border-white/10 shadow-2xl w-[280px]">
                <div className="flex justify-center mb-1">
                  <div className="w-20 h-5 bg-black rounded-full" />
                </div>

                <div className="bg-[#0a0a0a] rounded-[2rem] p-6 min-h-[420px]">
                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-3">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-sm opacity-60" />
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center text-xl font-bold text-white/50">
                        F
                      </div>
                    </div>
                    <p className="text-white text-sm font-semibold">fuad</p>
                    <p className="text-white/30 text-[10px] mt-0.5">
                      Brand, Product & Systems Design
                    </p>
                  </div>

                  {/* Social row */}
                  <div className="flex justify-center gap-2 mb-5">
                    {[FaYoutube, FaGithub, FaInstagram, FaTwitter, FaTiktok].map(
                      (Icon, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"
                        >
                          <Icon className="w-3 h-3 text-white/40" />
                        </div>
                      )
                    )}
                  </div>

                  {/* Links */}
                  <div className="space-y-2">
                    {[
                      { icon: "🎨", title: "Amit Patel Designs" },
                      { icon: "🌊", title: "Surface Room" },
                      { icon: "🟦", title: "Behance" },
                      { icon: "🟠", title: "Dribbble" },
                      { icon: "📱", title: "Twitter" },
                      { icon: "💼", title: "LinkedIn" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5"
                      >
                        <span className="text-xs">{item.icon}</span>
                        <span className="text-white/70 text-[11px] font-medium">
                          {item.title}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                stand out
              </span>
            </h2>
            <p className="text-white/30 max-w-lg mx-auto">
              Built for creators, designers, and professionals who want more
              than just links
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-white/10 transition-colors group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feat.color}15` }}
                >
                  <feat.icon
                    className="w-5 h-5"
                    style={{ color: feat.color }}
                  />
                </div>
                <h3 className="text-white font-semibold mb-2">{feat.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section
        id="how"
        className="py-24 px-6 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get started in{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                3 steps
              </span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl"
              >
                <span className="text-3xl font-bold bg-gradient-to-b from-purple-400 to-purple-600/30 bg-clip-text text-transparent flex-shrink-0">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {step.title}
                  </h3>
                  <p className="text-white/30 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to build your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              digital identity
            </span>
            ?
          </h2>
          <p className="text-white/30 mb-8 max-w-md mx-auto">
            Join thousands of creators who use LinkHub to connect with their
            audience
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-base font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-shadow"
          >
            Create Your Page
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-[10px] font-bold text-white">
              L
            </div>
            <span className="text-white/50 text-sm">LinkHub</span>
          </div>

          <div className="flex items-center gap-5">
            {[FaYoutube, FaInstagram, FaTwitter, FaGithub, FaLinkedin].map(
              (Icon, i) => (
                <Icon
                  key={i}
                  className="w-4 h-4 text-white/20 hover:text-white/50 transition-colors cursor-pointer"
                />
              )
            )}
          </div>

          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} LinkHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
