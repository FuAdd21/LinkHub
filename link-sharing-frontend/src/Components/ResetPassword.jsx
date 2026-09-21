import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../api/authApi.js";
import { getErrorMessage } from "../api/responseHandler.js";
import LinkHubLogo from "./common/LinkHubLogo";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token is missing from the URL.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        token,
        newPassword: password,
      });
      setSuccess(true);
      toast.success("Password successfully restored!");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to reset password. The link may have expired."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-[#c6f035] selection:text-black font-sans flex flex-col justify-between">
      {/* ──── Header Navigation ──── */}
      <header className="w-full border-b border-white/[0.07] px-6 sm:px-10 lg:px-16 py-4.5 flex items-center justify-between">
        <LinkHubLogo showPro={true} />

        <Link
          to="/login"
          className="text-xs font-bold tracking-wider font-mono text-[#c6f035] uppercase hover:underline"
        >
          SIGN IN
        </Link>
      </header>

      {/* ──── Main Content ──── */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-14 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-xl p-8 sm:p-10 shadow-2xl relative">
            <div className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#c6f035] uppercase mb-4">
              PASSWORD RESTORATION
            </div>

            {!token ? (
              <div className="text-center py-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                  Invalid Recovery Link
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  No recovery token was detected in this link. Recovery links can only be used once and expire after 1 hour.
                </p>
                <Link
                  to="/forgot-password"
                  className="w-full py-3.5 bg-[#c6f035] text-[#07080a] font-bold text-sm rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>Request new recovery link</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : success ? (
              <div className="text-center py-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c6f035]/10 border border-[#c6f035]/20 text-[#c6f035] mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                  Access restored
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  Your new password is now active and previous sessions have been safely invalidated. Redirecting you to sign in...
                </p>
                <Link
                  to="/login"
                  className="w-full py-3.5 bg-[#c6f035] text-[#07080a] font-bold text-sm rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign in now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                  Define new password.
                </h1>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-8">
                  Choose a robust password with at least 8 characters to secure your command center.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        minLength={8}
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#111215] border border-white/10 text-sm text-white focus:border-[#c6f035] focus:ring-1 focus:ring-[#c6f035] focus:outline-none transition-all placeholder:text-zinc-600 font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3.5 flex items-center text-zinc-500 hover:text-zinc-300"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        minLength={8}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#111215] border border-white/10 text-sm text-white focus:border-[#c6f035] focus:ring-1 focus:ring-[#c6f035] focus:outline-none transition-all placeholder:text-zinc-600 font-sans"
                      />
                    </div>
                  </div>

                  {/* Password requirements hint */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? "bg-[#c6f035]" : "bg-zinc-600"}`} />
                      <span className={password.length >= 8 ? "text-zinc-300" : "text-zinc-500"}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className={`w-1.5 h-1.5 rounded-full ${password && password === confirmPassword ? "bg-[#c6f035]" : "bg-zinc-600"}`} />
                      <span className={password && password === confirmPassword ? "text-zinc-300" : "text-zinc-500"}>
                        Passwords match
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || password.length < 8 || password !== confirmPassword}
                    className="w-full py-3.5 bg-[#c6f035] text-[#07080a] font-bold text-sm rounded-xl hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_2px_12px_rgba(198,240,53,0.15)] flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#07080a]/30 border-t-[#07080a] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Update password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ──── Footer ──── */}
      <footer className="w-full border-t border-white/[0.07] px-6 sm:px-10 lg:px-16 py-5 flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
        <div>LINKHUB / 2026</div>
        <div>SESSION INTEGRITY VERIFIED</div>
      </footer>
    </div>
  );
}
