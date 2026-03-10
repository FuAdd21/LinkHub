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
      toast.success("Account created! Please sign in.");
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
    <div className="app-auth-shell px-4 py-8">
      <div className="app-auth-glow app-auth-glow-primary" />
      <div className="app-auth-glow app-auth-glow-secondary" />

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="app-auth-logo-mark font-display text-sm font-bold">
            L
          </div>
          <span className="font-display text-lg font-bold text-white">
            LinkHub
          </span>
        </div>

        <div className="app-auth-panel rounded-[1.75rem] p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Create your account
          </h2>
          <p className="text-sm text-center text-white/40 mb-8">
            Start building your link page in seconds
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your name"
                  required
                  className="app-auth-input py-3 pl-10 pr-4 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="app-auth-input py-3 pl-10 pr-4 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+1 234 567 890"
                  required
                  className="app-auth-input py-3 pl-10 pr-4 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="app-auth-input py-3 pl-10 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <MotionButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="app-auth-button mt-2 py-3 text-sm font-medium disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </MotionButton>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="app-auth-link font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Register;
