import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../api/config.js";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/register`, form);
      toast.success("Identity registered. Welcome to the ecosystem.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="app-auth-shell min-h-screen px-4 py-12 relative overflow-hidden bg-[var(--saas-bg-main)]">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--saas-accent-primary)] opacity-10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[460px] mx-auto"
      >
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[var(--saas-accent-gradient)] font-black text-white text-xl shadow-[0_0_30px_var(--saas-accent-glow)] group-hover:scale-105 transition-transform">
              LH
            </div>
          </Link>
          <h1 className="mt-8 text-3xl font-black tracking-tight text-[var(--saas-text-primary)] font-display">
            Start your journey.
          </h1>
          <p className="mt-2 text-[14px] font-medium text-[var(--saas-text-secondary)]">
            Create your premium creator identity
          </p>
        </div>

        <div className="app-auth-panel rounded-[2.5rem] p-8 md:p-10 border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] shadow-2xl backdrop-blur-3xl overflow-hidden relative">
           <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
           
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-2 px-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--saas-text-secondary)] group-focus-within:text-[var(--saas-accent-primary)] transition-colors">
                     <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Signature"
                    required
                    className="w-full bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] focus:border-[var(--saas-accent-primary)] focus:ring-4 focus:ring-[var(--saas-accent-glow)]/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--saas-text-primary)] transition-all outline-none placeholder:text-[var(--saas-text-secondary)]/30"
                  />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-2 px-1">
                  Mobile
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--saas-text-secondary)] group-focus-within:text-[var(--saas-accent-primary)] transition-colors">
                     <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Contact"
                    required
                    className="w-full bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] focus:border-[var(--saas-accent-primary)] focus:ring-4 focus:ring-[var(--saas-accent-glow)]/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--saas-text-primary)] transition-all outline-none placeholder:text-[var(--saas-text-secondary)]/30"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-2 px-1">
                Identity Profile
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--saas-text-secondary)] group-focus-within:text-[var(--saas-accent-primary)] transition-colors">
                   <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="name@ecosystem.com"
                  required
                  className="w-full bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] focus:border-[var(--saas-accent-primary)] focus:ring-4 focus:ring-[var(--saas-accent-glow)]/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--saas-text-primary)] transition-all outline-none placeholder:text-[var(--saas-text-secondary)]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-2 px-1">
                Security Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--saas-text-secondary)] group-focus-within:text-[var(--saas-accent-primary)] transition-colors">
                   <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] focus:border-[var(--saas-accent-primary)] focus:ring-4 focus:ring-[var(--saas-accent-glow)]/10 rounded-2xl py-3.5 pl-11 pr-11 text-sm font-semibold text-[var(--saas-text-primary)] transition-all outline-none placeholder:text-[var(--saas-text-secondary)]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--saas-text-secondary)]/40 hover:text-[var(--saas-text-primary)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            <MotionButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-black bg-[var(--saas-accent-gradient)] shadow-lg shadow-[var(--saas-accent-glow)] hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Register Identity
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </MotionButton>
          </form>

          <div className="mt-8 pt-8 border-t border-[var(--saas-border)]">
              <p className="text-center text-[var(--saas-text-secondary)] text-sm font-medium">
                Already part of the ecosystem?{" "}
                <Link to="/login" className="text-[var(--saas-accent-primary)] font-black hover:underline ml-1">
                  Established Access
                </Link>
              </p>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Register;
