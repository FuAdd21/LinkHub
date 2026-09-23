import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { authApi } from "../api/authApi.js";
import { getErrorMessage } from "../api/responseHandler.js";
import LinkHubLogo from "./common/LinkHubLogo";
import { FaGoogle, FaApple } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.login({
        email,
        password,
      });
      const userData = {
        id: data.userId,
        name: data.name,
        username: data.username,
      };
      login(userData, data.csrfToken, data.token);
      toast.success("Identity verified. Welcome back.");

      if (data.username) {
        navigate("/dashboard");
      } else {
        navigate("/create-profile");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Verification failed. Please check credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-[#c6f035] selection:text-black font-sans flex flex-col justify-between">
      {/* ──── Header Navigation ──── */}
      <header className="w-full border-b border-white/[0.07] px-6 sm:px-10 lg:px-16 py-4.5 flex items-center justify-between">
        {/* Brand */}
        <LinkHubLogo showPro={true} />

        {/* Mobile Top Right Action */}
        <Link
          to="/register"
          className="md:hidden text-xs font-bold tracking-wider font-mono text-[#c6f035] uppercase hover:underline"
        >
          CREATE PROFILE
        </Link>
      </header>

      {/* ──── Main Content Section ──── */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 lg:py-16 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Live Identity Preview Frame (Desktop only) */}
          <div className="hidden lg:block lg:col-span-6">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-xl p-8 shadow-2xl relative flex flex-col justify-between min-h-[580px]">
              <div>
                {/* Monospace Kicker */}
                <div className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#c6f035] uppercase mb-4">
                  IDENTITY, CONTINUED
                </div>

                <h2 className="text-4xl font-extrabold text-white tracking-tight leading-[1.1] mb-3">
                  Welcome back<br />
                  to your signal.
                </h2>

                <p className="text-xs text-zinc-400 font-normal leading-relaxed max-w-sm mb-8">
                  Your links, reach, and proof are waiting—exactly where you left them.
                </p>

                {/* Inner Live Snapshot Card */}
                <div className="border border-white/[0.06] bg-[#121316] rounded-xl p-6 shadow-md">
                  <div className="text-[9px] font-mono font-medium tracking-[0.2em] text-zinc-500 uppercase mb-5">
                    LIVE SNAPSHOT
                  </div>

                  {/* Profile Summary */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-full border-2 border-[#c6f035] bg-[#0c0d10] text-[#c6f035] font-extrabold text-base flex items-center justify-center shrink-0">
                      MK
                    </div>
                    <div>
                      <div className="text-base font-bold text-white tracking-tight">
                        Maya Kim
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400 font-normal">
                        linkhub.io/maya
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.06] my-5" />

                  {/* Quick Metric Signals */}
                  <div className="flex items-center gap-12 mb-6">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-extrabold text-white tracking-tight">
                          24.8K
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c6f035]" />
                      </div>
                      <div className="text-[8px] font-mono font-medium text-zinc-500 uppercase tracking-widest mt-0.5">
                        VIEWS
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-extrabold text-white tracking-tight">
                          10.4K
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                      </div>
                      <div className="text-[8px] font-mono font-medium text-zinc-500 uppercase tracking-widest mt-0.5">
                        CLICKS
                      </div>
                    </div>
                  </div>

                  {/* Active Destination Status Bar */}
                  <div className="bg-[#0b0c0e] border border-white/[0.04] rounded-lg p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#c6f035] animate-pulse" />
                      <span className="text-xs font-semibold text-white tracking-tight">
                        All six destinations are live
                      </span>
                    </div>
                    <span className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
                      NOW
                    </span>
                  </div>
                </div>
              </div>

              {/* Secure Session Footnote */}
              <div className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase pt-6">
                SECURE SESSION &nbsp;·&nbsp; ENCRYPTED
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Form (Desktop & Mobile) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[440px]">
              {/* Kicker */}
              <div className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#c6f035] uppercase mb-2">
                SIGN IN
              </div>

              {/* Headline - Responsive (Desktop & Mobile) */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                <span className="sm:hidden">Welcome back.</span>
                <span className="hidden sm:inline">Return to your command center.</span>
              </h1>

              {/* Mobile Subtitle */}
              <p className="sm:hidden text-xs text-zinc-400 mb-6">
                Return to your command center.
              </p>

              {/* Desktop Subtitle with Link */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 mb-8">
                <span>New to LinkHub?</span>
                <Link
                  to="/register"
                  className="text-[#c6f035] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Create a profile →
                </Link>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maya@studio.dev"
                    required
                    className="w-full bg-[#121316] border border-white/10 rounded-lg px-4 py-3 sm:py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035] transition-all"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-[#121316] border border-white/10 rounded-lg px-4 py-3 sm:py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035] transition-all"
                  />
                  <div className="flex justify-end mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-[#c6f035] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#c6f035] text-[#07080a] font-bold text-sm rounded-lg hover:brightness-105 transition-all shadow-[0_2px_12px_rgba(198,240,53,0.15)] disabled:opacity-50 mt-2"
                >
                  {loading ? "Verifying..." : "Continue to LinkHub"}
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="w-full border-t border-white/[0.08]" />
                <span className="px-3 text-[9px] font-mono uppercase tracking-widest text-zinc-500 bg-[#07080a] absolute">
                  OR
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  title="Google SSO coming soon"
                  className="w-full py-3 px-4 bg-[#121316]/50 border border-white/5 rounded-lg text-xs font-semibold text-zinc-500 flex items-center justify-center gap-2 cursor-not-allowed select-none"
                >
                  <FaGoogle className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Google</span>
                  <span className="text-[9px] font-mono uppercase bg-white/[0.05] text-zinc-400 px-1.5 py-0.5 rounded ml-1">Soon</span>
                </div>

                <div
                  title="Apple SSO coming soon"
                  className="w-full py-3 px-4 bg-[#121316]/50 border border-white/5 rounded-lg text-xs font-semibold text-zinc-500 flex items-center justify-center gap-2 cursor-not-allowed select-none"
                >
                  <FaApple className="w-4 h-4 text-zinc-600" />
                  <span>Apple</span>
                  <span className="text-[9px] font-mono uppercase bg-white/[0.05] text-zinc-400 px-1.5 py-0.5 rounded ml-1">Soon</span>
                </div>
              </div>

              {/* Security Banner Card */}
              <div className="mt-6 border border-white/[0.08] bg-[#0c0d10] rounded-xl p-4 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#c6f035] mt-1 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white tracking-tight block">
                    Private by default
                  </span>
                  <span className="text-[11px] text-zinc-400 mt-0.5 block">
                    <span className="sm:hidden">Nothing publishes without consent.</span>
                    <span className="hidden sm:inline">We never publish or connect accounts without consent.</span>
                  </span>
                </div>
              </div>
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
          <Link to="/" className="hover:text-zinc-300 transition-colors">
            HOME
          </Link>
          <a href="#privacy" className="hover:text-zinc-300 transition-colors">
            PRIVACY
          </a>
          <a href="#terms" className="hover:text-zinc-300 transition-colors">
            TERMS
          </a>
        </div>
      </footer>
    </div>
  );
}
