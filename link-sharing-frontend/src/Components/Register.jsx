import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/config.js";
import { AuthContext } from "../context/AuthContext";
import LinkHubLogo from "./common/LinkHubLogo";
import { Check } from "lucide-react";
import { FaGoogle, FaApple } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in your name, email, and password.");
      return;
    }

    setLoading(true);

    try {
      // 1. Register user
      await api.post("/register", form);

      // 2. Automatically log in to get session token
      try {
        const loginRes = await api.post("/login", {
          email: form.email,
          password: form.password,
        });

        if (loginRes.data?.token || loginRes.data?.userId) {
          login(
            loginRes.data.token,
            {
              id: loginRes.data.userId,
              name: form.name,
              username: loginRes.data.username || "",
            },
            loginRes.data.csrfToken
          );
          toast.success("Account created! Let's set up your profile.");
          navigate("/create-profile");
          return;
        }
      } catch {
        // If auto-login fails, send to login page
      }


      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please check your inputs.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-[#c6f035] selection:text-black font-sans flex flex-col justify-between">
      {/* ──── Header ──── */}
      <header className="w-full border-b border-white/[0.07] px-6 sm:px-10 lg:px-16 py-4.5 flex items-center justify-between">
        <LinkHubLogo showPro={true} />

        <div className="text-xs font-mono font-medium tracking-widest text-zinc-400 uppercase">
          <span className="hidden sm:inline">STEP 01 / 03</span>
          <span className="sm:hidden text-[#c6f035] font-bold">01 / 03</span>
        </div>
      </header>

      {/* ──── Main Content ──── */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          {/* Top Header Row with Kicker & Desktop Stepper */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#c6f035] uppercase">
              CREATE YOUR IDENTITY
            </div>

            {/* Stepper Timeline (Desktop) */}
            <div className="hidden sm:flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#c6f035] text-[#07080a] flex items-center justify-center text-[10px] font-bold font-mono">
                  01
                </div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-white uppercase">
                  ACCOUNT
                </span>
              </div>
              <div className="w-8 h-[1px] bg-zinc-800 mx-3" />
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#121316] border border-white/10 text-zinc-500 flex items-center justify-center text-[10px] font-bold font-mono">
                  02
                </div>
                <span className="text-[9px] font-mono font-medium tracking-widest text-zinc-500 uppercase">
                  PROFILE
                </span>
              </div>
              <div className="w-8 h-[1px] bg-zinc-800 mx-3" />
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#121316] border border-white/10 text-zinc-500 flex items-center justify-center text-[10px] font-bold font-mono">
                  03
                </div>
                <span className="text-[9px] font-mono font-medium tracking-widest text-zinc-500 uppercase">
                  PUBLISH
                </span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Start your journey.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mb-8">
            Create your account to claim your unique signal and dashboard.
          </p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
                FULL NAME
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Maya Kim"
                required
                className="w-full bg-[#121316] border border-white/10 rounded-lg px-4 py-3 sm:py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035] transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="maya@studio.dev"
                required
                className="w-full bg-[#121316] border border-white/10 rounded-lg px-4 py-3 sm:py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035] transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Create a strong password"
                required
                className="w-full bg-[#121316] border border-white/10 rounded-lg px-4 py-3 sm:py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035] transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#c6f035] text-[#07080a] font-bold text-sm rounded-lg hover:brightness-105 transition-all shadow-[0_2px_12px_rgba(198,240,53,0.15)] disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account..." : "Continue to profile setup &rarr;"}
            </button>
          </form>

          {/* Already have an account */}
          <div className="text-center mt-6 text-xs text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#c6f035] font-semibold hover:underline">
              Sign in
            </Link>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-8 border border-white/[0.08] bg-[#0c0d10] rounded-xl p-4 flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-[#c6f035] mt-1 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white tracking-tight block">
                Zero spam policy
              </span>
              <span className="text-[11px] text-zinc-400 mt-0.5 block">
                Your data is protected. We will never share or sell your details.
              </span>
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
