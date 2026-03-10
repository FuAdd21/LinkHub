// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      // Placeholder API call - replace with real endpoint
      console.log("Forgot password request for:", email);
      setMessage(
        "If an account exists, a password reset link has been sent to your email.",
      );
      setEmail("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black to br from-orange-50 to-red-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full mx-4 p-8 bg-black rounded-2xl shadow-xl"
      >
        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-center text-white mb-4"
        >
          Forgot Password
        </motion.h2>
        <p className="text-center text-white mb-6">
          Enter your email address, and we’ll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200"
          >
            Send Reset Link
          </motion.button>
        </form>
        {error && (
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
          >
            {error}
          </motion.p>
        )}
        {message && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center"
          >
            {message}
          </motion.p>
        )}
        <p className="text-center text-gray-600 mt-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            className="text-orange-600 hover:text-orange-800 font-semibold "
          >
            Back to Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
