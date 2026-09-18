import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import LinkHubLogo from "./common/LinkHubLogo";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const handleStart = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleDemo = () => {
    navigate("/maya");
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-[#c6f035] selection:text-black font-sans flex flex-col justify-between">
      {/* ──── Top Navigation ──── */}
      <header className="w-full border-b border-white/[0.07] px-6 sm:px-10 lg:px-16 py-4.5 flex items-center justify-between">
        {/* Brand */}
        <LinkHubLogo showPro={true} />

        {/* Center Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#product" className="hover:text-white transition-colors">
            Product
          </a>
          <a href="#solutions" className="hover:text-white transition-colors">
            Solutions
          </a>
          <a href="#templates" className="hover:text-white transition-colors">
            Templates
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          {/* Desktop Sign In & CTA */}
          <Link
            to="/login"
            className="hidden md:inline-block text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <button
            onClick={handleStart}
            className="hidden md:inline-flex items-center justify-center bg-[#c6f035] text-[#07080a] font-bold text-xs px-4 py-2 rounded-lg hover:brightness-105 transition-all"
          >
            Create profile
          </button>

          {/* Mobile Sign In */}
          <Link
            to="/login"
            className="md:hidden text-xs font-bold tracking-wider font-mono text-[#c6f035] uppercase hover:underline"
          >
            SIGN IN
          </Link>
        </div>
      </header>

      {/* ──── Main Hero Content ──── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Hero Text & Call-To-Action */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-block text-[11px] font-mono font-medium tracking-[0.18em] text-[#c6f035] uppercase mb-4 sm:mb-6">
              IDENTITY INFRASTRUCTURE
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-white leading-[1.04] mb-5 sm:mb-6">
              One link.<br />
              Every signal.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-zinc-400 font-normal leading-relaxed max-w-md mb-8 sm:mb-10">
              A precise home for your work, audience, and proof—built for creators who care how they are understood.
            </p>

            {/* Desktop CTAs */}
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={handleStart}
                className="inline-flex items-center justify-center bg-[#c6f035] text-[#07080a] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-lg hover:brightness-105 transition-all shadow-[0_2px_12px_rgba(198,240,53,0.15)]"
              >
                Create your profile
              </button>
              <button
                onClick={handleDemo}
                className="inline-flex items-center justify-center bg-[#141518] border border-white/10 text-zinc-200 font-medium text-xs sm:text-sm px-6 py-3.5 rounded-lg hover:bg-white/5 hover:border-white/20 transition-all"
              >
                View demo
              </button>
            </div>

            {/* Mobile Single Full-Width Button */}
            <div className="sm:hidden w-full">
              <button
                onClick={handleStart}
                className="w-full py-3.5 bg-[#c6f035] text-[#07080a] font-bold text-sm rounded-xl text-center shadow-lg"
              >
                Create your profile
              </button>
            </div>

            {/* Micro Caption */}
            <div className="hidden sm:block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mt-7">
              NO CREDIT CARD &nbsp;·&nbsp; LIVE IN 90 SECONDS
            </div>
          </div>

          {/* Right Column: Public Identity / Live Card Preview */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[490px] rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative">
              {/* Card Label */}
              <div className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#c6f035] uppercase mb-6 sm:mb-8">
                PUBLIC IDENTITY / LIVE
              </div>

              {/* Identity Header */}
              <div className="space-y-4">
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#c6f035] bg-[#121316] text-[#c6f035] font-extrabold text-xl sm:text-2xl flex items-center justify-center select-none shadow-sm">
                  MK
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Maya Kim
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium mt-1">
                    Creator · Developer <span className="hidden sm:inline">· Systems thinker</span>
                  </p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2.5 pt-1">
                  <span className="bg-[#c6f035] text-[#07080a] text-[10px] font-bold font-mono tracking-wider uppercase px-4 py-1.5 rounded-full inline-block">
                    VERIFIED
                  </span>
                  <span className="hidden sm:inline-block bg-[#16171b] border border-white/5 text-zinc-300 text-[10px] font-mono font-medium tracking-wider uppercase px-4 py-1.5 rounded-full">
                    18.2K REACH
                  </span>
                </div>
              </div>

              {/* Source Cards */}
              <div className="mt-8 space-y-3">
                {/* Link 1 */}
                <div
                  onClick={() => toast.success("Live GitHub integration signal")}
                  className="group cursor-pointer bg-[#121417] border border-white/[0.06] hover:border-white/15 rounded-xl p-4 flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#c6f035] transition-colors">
                      Open-source toolkit
                    </div>
                    <div className="text-[9px] font-mono font-medium tracking-wider text-zinc-500 uppercase mt-0.5">
                      GITHUB
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#c6f035]">
                    4.2K
                  </div>
                </div>

                {/* Link 2 */}
                <div
                  onClick={() => toast.success("Live YouTube subscriber stream")}
                  className="group cursor-pointer bg-[#121417] border border-white/[0.06] hover:border-white/15 rounded-xl p-4 flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#c6f035] transition-colors">
                      <span className="sm:hidden">Build in public</span>
                      <span className="hidden sm:inline">Build in public — weekly</span>
                    </div>
                    <div className="text-[9px] font-mono font-medium tracking-wider text-zinc-500 uppercase mt-0.5">
                      YOUTUBE
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#c6f035]">
                    3.1K
                  </div>
                </div>

                {/* Link 3 (Desktop only in design) */}
                <div
                  onClick={() => toast.success("Live Instagram audience count")}
                  className="hidden sm:flex group cursor-pointer bg-[#121417] border border-white/[0.06] hover:border-white/15 rounded-xl p-4 items-center justify-between transition-all"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#c6f035] transition-colors">
                      Behind the scenes
                    </div>
                    <div className="text-[9px] font-mono font-medium tracking-wider text-zinc-500 uppercase mt-0.5">
                      INSTAGRAM
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#c6f035]">
                    1.8K
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ──── Desktop Proof, Not Noise & Intelligence Section ──── */}
        <div className="hidden lg:block border-t border-white/[0.07] mt-16 pt-12">
          <div className="grid grid-cols-12 gap-10 items-center">
            {/* Left: 3 Stats */}
            <div className="col-span-7">
              <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#c6f035] uppercase mb-4">
                PROOF, NOT NOISE
              </div>
              <div className="flex items-center gap-12 sm:gap-16">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      24.8K
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c6f035]" />
                  </div>
                  <div className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest mt-1">
                    MONTHLY VIEWS
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      41.8%
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                  </div>
                  <div className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest mt-1">
                    CLICK RATE
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      06
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                  </div>
                  <div className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest mt-1">
                    CONNECTED SOURCES
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Editorial Quote */}
            <div className="col-span-5">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                Your public identity stays elegant.<br />
                The intelligence stays underneath.
              </h3>
              <p className="text-xs text-zinc-400 mt-2 font-normal">
                Real profiles. Live audience signals. One considered surface.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ──── Footer ──── */}
      <footer className="w-full border-t border-white/[0.07] px-6 sm:px-10 lg:px-16 py-5 flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
        <div>
          LINKHUB / 2026
        </div>

        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-zinc-300 transition-colors">
            PRIVACY
          </a>
          <a href="#terms" className="hover:text-zinc-300 transition-colors">
            TERMS
          </a>
          <span className="hidden sm:inline">
            <a href="#status" className="hover:text-zinc-300 transition-colors">
              STATUS
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
