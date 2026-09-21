import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../api/authApi.js";
import { getErrorMessage } from "../api/responseHandler.js";
import LinkHubLogo from "./common/LinkHubLogo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setLoading(true);

    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
      toast.success("Recovery link dispatched to your inbox.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Recovery request failed. Please check the email provided."));
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
          {/* Card Container */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-xl p-8 sm:p-10 shadow-2xl relative">
            <div className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#c6f035] uppercase mb-4">
              IDENTITY RECOVERY
            </div>

            {!sent ? (
              <>
                <h1 className="text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                  Reset your access.
                </h1>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-8">
                  Enter the email linked to your LinkHub account. We'll dispatch a secure recovery token.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase mb-2">
                      Account Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#111215] border border-white/10 text-sm text-white focus:border-[#c6f035] focus:ring-1 focus:ring-[#c6f035] focus:outline-none transition-all placeholder:text-zinc-600 font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#c6f035] text-[#07080a] font-bold text-sm rounded-xl hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_2px_12px_rgba(198,240,53,0.15)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#07080a]/30 border-t-[#07080a] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Dispatch recovery link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c6f035]/10 border border-[#c6f035]/20 text-[#c6f035] mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                  Check your inbox
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  We've dispatched a recovery link to <span className="text-white font-mono">{email}</span>. Click the link to define a new password.
                </p>
                <div className="p-4 rounded-xl bg-[#111215] border border-white/5 text-[11px] text-zinc-400 mb-6 font-mono text-left">
                  <span className="text-[#c6f035] font-bold">NOTE:</span> The recovery link is cryptographically signed and expires in 1 hour for your security.
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-xs font-mono font-medium text-zinc-400 hover:text-[#c6f035] transition-colors"
                >
                  Didn't receive it? Try another address
                </button>
              </div>
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
        <div>SECURE ACCESS RECOVERY</div>
      </footer>
    </div>
  );
}
