import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      const userData = {
        id: res.data.userId,
        name: res.data.name,
        username: res.data.username,
      };
      login(res.data.token, userData);
      toast.success("Welcome back!");

      if (res.data.username) {
        navigate(`/${res.data.username}`);
      } else {
        navigate("/create-profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
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
            Welcome back
          </h2>
          <p className="text-sm text-center text-white/40 mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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

            <div className="flex justify-end">
              <Link to="/forgot-password" className="app-auth-link text-xs">
                Forgot password?
              </Link>
            </div>

            <MotionButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="app-auth-button py-3 text-sm font-medium disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </MotionButton>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="app-auth-link font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Login;
