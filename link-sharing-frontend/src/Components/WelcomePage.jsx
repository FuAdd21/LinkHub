import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LinkHubLogo from "./common/LinkHubLogo";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { ArrowRight, Check } from "lucide-react";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [activeTemplate, setActiveTemplate] = useState("Obsidian");

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
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-[#c6f035] selection:text-black font-sans flex flex-col justify-between scroll-smooth">
      {/* ──── Top Navigation ──── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#07080a]/90 w-full border-b border-white/[0.07] px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between">
        {/* Brand */}
        <LinkHubLogo />

        {/* Center Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#product" className="hover:text-white transition-colors">
            Product
          </a>
          <a href="#templates" className="hover:text-white transition-colors">
            Templates
          </a>
          <a href="#solutions" className="hover:text-white transition-colors">
            Solutions
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="hidden md:inline-block text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <button
            onClick={handleStart}
            className="hidden md:inline-flex items-center justify-center bg-[#c6f035] text-[#07080a] font-bold text-xs px-4 py-2 rounded-lg hover:brightness-105 active:scale-95 transition-all shadow-[0_2px_10px_rgba(198,240,53,0.2)]"
          >
            Start free
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

      {/* ──── Main Content ──── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 lg:py-16 space-y-24 sm:space-y-32">
        {/* ════════ SECTION 00: IDENTITY INFRASTRUCTURE ════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-2">
          {/* Left Column: Hero Text & Call-To-Action */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-block text-[11px] font-mono font-medium tracking-[0.18em] text-[#c6f035] uppercase mb-4 sm:mb-6">
              00 / IDENTITY INFRASTRUCTURE
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-white leading-[1.04] mb-5 sm:mb-6">
              One link.<br />
              Every signal.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-zinc-400 font-normal leading-relaxed max-w-md mb-8 sm:mb-10">
              Build a public identity that brings your work, audience, and proof into one intelligent surface.
            </p>

            {/* Desktop CTAs */}
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={handleStart}
                className="inline-flex items-center justify-center bg-[#c6f035] text-[#07080a] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-lg hover:brightness-105 active:scale-95 transition-all shadow-[0_2px_12px_rgba(198,240,53,0.15)]"
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
                className="w-full py-3.5 bg-[#c6f035] text-[#07080a] font-bold text-sm rounded-xl text-center shadow-lg active:scale-95 transition-transform"
              >
                Create your profile
              </button>
            </div>

            {/* Micro Caption */}
            <div className="hidden sm:block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mt-7">
              NO CREDIT CARD &nbsp;·&nbsp; LIVE IN 90 SECONDS
            </div>
          </div>

          {/* Right Column: Hero Interactive Preview Frame */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            {/* Desktop: Command Center live preview (matching image copy 6.png) */}
            <div className="hidden sm:block w-full max-w-[560px] rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden">
              {/* Top Window Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22d3ee]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c6f035]/80" />
                </div>
                <div className="text-[10px] font-mono text-zinc-500 tracking-wider">
                  <span className="text-[#c6f035] font-bold">LIVE</span> / linkhub.io/maya
                </div>
              </div>

              {/* Inner Split Layout */}
              <div className="grid grid-cols-12 gap-4">
                {/* Left Mini Rail */}
                <div className="col-span-3 border-r border-white/[0.06] pr-3 space-y-4">
                  <div className="w-7 h-7 rounded-lg bg-[#c6f035] text-[#07080a] font-extrabold flex items-center justify-center text-xs">
                    LH
                  </div>
                  <div className="space-y-2 text-[9px] font-mono uppercase tracking-wider text-zinc-500">
                    <div className="p-1 rounded bg-white/5 text-[#c6f035] font-bold">Overview</div>
                    <div className="p-1 hover:text-zinc-300">Links</div>
                    <div className="p-1 hover:text-zinc-300">Appearance</div>
                    <div className="p-1 hover:text-zinc-300">Analytics</div>
                  </div>
                </div>

                {/* Right Mini Dashboard */}
                <div className="col-span-9 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">Good morning, Maya.</h3>
                    <p className="text-[11px] text-zinc-500">Your identity is live and performing.</p>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-[#121316] border border-white/[0.06]">
                      <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">VIEWS</div>
                      <div className="text-sm font-bold text-white mt-1">24.8K</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#121316] border border-white/[0.06]">
                      <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">CLICKS</div>
                      <div className="text-sm font-bold text-white mt-1">10.4K</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#121316] border border-white/[0.06]">
                      <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">CTR</div>
                      <div className="text-sm font-bold text-white mt-1">41.8%</div>
                    </div>
                  </div>

                  {/* Mini Chart Canvas */}
                  <div className="p-3 rounded-lg bg-[#121316] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                      <span>AUDIENCE SIGNAL / 30 DAYS</span>
                      <span className="text-[#c6f035] font-bold">+18.3%</span>
                    </div>
                    {/* SVG Curve */}
                    <svg viewBox="0 0 300 80" className="w-full h-16 overflow-visible">
                      <defs>
                        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#c6f035" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#c6f035" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,65 Q 40,60 80,45 T 160,35 T 240,25 T 300,10 L 300,80 L 0,80 Z"
                        fill="url(#chartGrad)"
                      />
                      <path
                        d="M 0,65 Q 40,60 80,45 T 160,35 T 240,25 T 300,10"
                        fill="none"
                        stroke="#c6f035"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="80" cy="45" r="3.5" fill="#c6f035" />
                      <circle cx="160" cy="35" r="3.5" fill="#c6f035" />
                      <circle cx="240" cy="25" r="3.5" fill="#c6f035" />
                      <circle cx="300" cy="10" r="4" fill="#c6f035" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Public Identity Card Preview (matching image copy 7.png) */}
            <div className="sm:hidden w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-xl p-6 shadow-2xl relative">
              <div className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#c6f035] uppercase mb-5">
                PUBLIC IDENTITY / LIVE
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#c6f035] bg-[#121316] text-[#c6f035] font-extrabold text-xl flex items-center justify-center">
                  MK
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Maya Kim</h2>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">@maya · 2.84M reach</p>
                </div>
                <div>
                  <span className="bg-[#c6f035] text-[#07080a] text-[10px] font-bold font-mono tracking-wider uppercase px-3 py-1 rounded-full inline-block">
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <div className="bg-[#121417] border border-white/[0.06] rounded-xl p-3.5 flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Open-source toolkit</div>
                  <div className="text-xs font-mono font-bold text-[#c6f035]">4.2K</div>
                </div>
                <div className="bg-[#121417] border border-white/[0.06] rounded-xl p-3.5 flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Build in public</div>
                  <div className="text-xs font-mono font-bold text-[#c6f035]">3.1K</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ SECTION 01: PROOF, NOT NOISE ════════ */}
        <section className="border-t border-white/[0.07] pt-12">
          <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#c6f035] uppercase mb-6">
            01 / PROOF, NOT NOISE
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* 4 Performance Metrics */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">24.8K</span>
                  <span className="w-2 h-2 rounded-full bg-[#c6f035]" />
                </div>
                <div className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest mt-1.5">
                  MONTHLY VIEWS
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">41.8%</span>
                  <span className="w-2 h-2 rounded-full bg-[#22d3ee]" />
                </div>
                <div className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest mt-1.5">
                  CLICK RATE
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">2.84M</span>
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                </div>
                <div className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest mt-1.5">
                  SOCIAL REACH
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">06</span>
                  <span className="w-2 h-2 rounded-full bg-[#c6f035]" />
                </div>
                <div className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest mt-1.5">
                  LIVE SOURCES
                </div>
              </div>
            </div>

            {/* Right Editorial Statement */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/[0.07] pt-6 lg:pt-0 lg:pl-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                Elegant in public.<br />
                Intelligent underneath.
              </h3>
              <p className="text-xs text-zinc-400 mt-2 font-normal leading-relaxed">
                Real profiles. Live audience signals. One considered surface.
              </p>
            </div>
          </div>
        </section>

        {/* ════════ SECTION 02: PRODUCT ════════ */}
        <section id="product" className="border-t border-white/[0.07] pt-16">
          <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#c6f035] uppercase mb-4">
            02 / PRODUCT
          </div>

          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
              Your identity, operated.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Publish beautifully. Measure precisely. Keep every destination current from one focused command center.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 hover:border-white/20 p-8 transition-all hover:-translate-y-1">
              <div className="text-[10px] font-mono font-bold text-[#c6f035] uppercase tracking-widest mb-4">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#c6f035] transition-colors">
                BUILD
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Arrange links, social proof, and profile details with instant live visual feedback.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 hover:border-white/20 p-8 transition-all hover:-translate-y-1">
              <div className="text-[10px] font-mono font-bold text-[#22d3ee] uppercase tracking-widest mb-4">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#22d3ee] transition-colors">
                CONNECT
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sync live audiences across your channels with verified real-time platform data.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 hover:border-white/20 p-8 transition-all hover:-translate-y-1">
              <div className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-widest mb-4">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#f59e0b] transition-colors">
                UNDERSTAND
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                See what earns attention and action with privacy-preserving engagement telemetry.
              </p>
            </div>
          </div>
        </section>

        {/* ════════ SECTION 03: TEMPLATES ════════ */}
        <section id="templates" className="border-t border-white/[0.07] pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#c6f035] uppercase mb-4">
                03 / TEMPLATES
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Start distinct. Stay yours.
              </h2>
            </div>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#c6f035] uppercase tracking-wider hover:underline"
            >
              <span>View all templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Specimen Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Template 1: Obsidian */}
            <div
              onClick={() => setActiveTemplate("Obsidian")}
              className={`cursor-pointer rounded-2xl border transition-all p-6 bg-[#0c0d10]/95 hover:-translate-y-1 ${
                activeTemplate === "Obsidian" ? "border-[#c6f035] shadow-[0_0_20px_rgba(198,240,53,0.1)]" : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              {/* Graphic Specimen Preview */}
              <div className="h-44 rounded-xl bg-[#11120F] border border-white/[0.06] p-5 flex flex-col justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#c6f035] bg-black/40 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c6f035]" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2 w-24 bg-[#c6f035] rounded-full" />
                    <div className="h-1.5 w-36 bg-zinc-600 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/10 rounded" />
                  <div className="h-2 w-4/5 bg-white/10 rounded" />
                  <div className="h-2 w-3/5 bg-white/5 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">OBSIDIAN</h4>
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">Editorial / Dark</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </div>
            </div>

            {/* Template 2: Paper */}
            <div
              onClick={() => setActiveTemplate("Paper")}
              className={`cursor-pointer rounded-2xl border transition-all p-6 bg-[#0c0d10]/95 hover:-translate-y-1 ${
                activeTemplate === "Paper" ? "border-[#c6f035] shadow-[0_0_20px_rgba(198,240,53,0.1)]" : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              {/* Graphic Specimen Preview */}
              <div className="h-44 rounded-xl bg-[#e9eae6] border border-white/[0.06] p-5 flex flex-col justify-between mb-5 text-[#11120F]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-black/20 bg-white flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#11120F]" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2 w-28 bg-[#11120F]/80 rounded-full" />
                    <div className="h-1.5 w-32 bg-[#11120F]/40 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-[#11120F]/20 rounded" />
                  <div className="h-2 w-4/5 bg-[#11120F]/20 rounded" />
                  <div className="h-2 w-3/5 bg-[#11120F]/10 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">PAPER</h4>
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">Minimal / Light</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </div>
            </div>

            {/* Template 3: Signal */}
            <div
              onClick={() => setActiveTemplate("Signal")}
              className={`cursor-pointer rounded-2xl border transition-all p-6 bg-[#0c0d10]/95 hover:-translate-y-1 ${
                activeTemplate === "Signal" ? "border-[#c6f035] shadow-[0_0_20px_rgba(198,240,53,0.1)]" : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              {/* Graphic Specimen Preview */}
              <div className="h-44 rounded-xl bg-[#0a1118] border border-cyan-500/20 p-5 flex flex-col justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-cyan-400 bg-cyan-950/40 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00d2ff]" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2 w-28 bg-[#00d2ff] rounded-full" />
                    <div className="h-1.5 w-36 bg-cyan-800 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-cyan-500/20 rounded" />
                  <div className="h-2 w-4/5 bg-cyan-500/15 rounded" />
                  <div className="h-2 w-3/5 bg-cyan-500/10 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">SIGNAL</h4>
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">Data / Graphic</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </div>
            </div>
          </div>
        </section>

        {/* ════════ SECTION 04: SOLUTIONS ════════ */}
        <section id="solutions" className="border-t border-white/[0.07] pt-16">
          <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#c6f035] uppercase mb-4">
            04 / SOLUTIONS
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-12">
            Built for the way you create.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 p-8 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#c6f035] uppercase tracking-widest mb-3">
                  CREATORS
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Turn every audience into one owned destination.
                </h3>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider pt-6 border-t border-white/[0.05]">
                Audience sync &nbsp;·&nbsp; Link performance
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 p-8 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#22d3ee] uppercase tracking-widest mb-3">
                  DEVELOPERS
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Ship projects with visible proof and clean telemetry.
                </h3>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider pt-6 border-t border-white/[0.05]">
                GitHub signals &nbsp;·&nbsp; Release links
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 p-8 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-widest mb-3">
                  BRANDS
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Unify campaigns, channels, and conversion insight.
                </h3>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider pt-6 border-t border-white/[0.05]">
                Team control &nbsp;·&nbsp; Campaign views
              </div>
            </div>
          </div>
        </section>

        {/* ════════ SECTION 05: PRICING ════════ */}
        <section id="pricing" className="border-t border-white/[0.07] pt-16">
          <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#c6f035] uppercase mb-4">
            05 / PRICING
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-12">
            Simple from first link to full signal.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Free Tier */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 p-8 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-4">
                  FREE
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$0</span>
                  <span className="text-xs font-mono text-zinc-500 uppercase">/MO</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">Publish a complete identity</p>
              </div>

              <button
                onClick={handleStart}
                className="mt-8 w-full py-3 rounded-lg border border-white/10 hover:border-white/30 text-xs font-mono font-bold text-white uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Start free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pro Tier (Featured with Lime Border) */}
            <div className="rounded-2xl border-2 border-[#c6f035] bg-[#0c0d10]/95 p-8 flex flex-col justify-between shadow-[0_0_30px_rgba(198,240,53,0.12)] relative">
              <div className="absolute -top-3 right-6 bg-[#c6f035] text-[#07080a] text-[9px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full">
                RECOMMENDED
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-[#c6f035] uppercase tracking-widest mb-4">
                  PRO
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$12</span>
                  <span className="text-xs font-mono text-zinc-500 uppercase">/MO</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">Live data and deep analytics</p>
              </div>

              <button
                onClick={handleStart}
                className="mt-8 w-full py-3 rounded-lg bg-[#c6f035] text-[#07080a] text-xs font-mono font-bold uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Choose Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Studio Tier */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 p-8 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-4">
                  STUDIO
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$29</span>
                  <span className="text-xs font-mono text-zinc-500 uppercase">/MO</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">Multiple profiles and controls</p>
              </div>

              <button
                onClick={handleStart}
                className="mt-8 w-full py-3 rounded-lg border border-white/10 hover:border-white/30 text-xs font-mono font-bold text-white uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Choose Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Bottom Full-Width CTA (matching image copy 7.png) */}
          <div className="sm:hidden pt-8">
            <button
              onClick={handleStart}
              className="w-full py-4 bg-[#c6f035] text-[#07080a] font-bold text-sm rounded-xl text-center shadow-lg active:scale-95 transition-transform"
            >
              Start your profile
            </button>
          </div>
        </section>
      </main>

      {/* ──── Footer ──── */}
      <footer className="w-full border-t border-white/[0.07] px-6 sm:px-10 lg:px-16 py-6 flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
        <div>LINKHUB / 2026</div>

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
