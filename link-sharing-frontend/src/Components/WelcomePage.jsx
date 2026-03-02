import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleGetStarted = () => {
    if (user) navigate("/dashboard");
    else navigate("/login");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-100 via-white to-sky-50 text-gray-800 scroll-smooth">
      {/* ===== NAVBAR ===== */}
      <header className="flex justify-between items-center px-6 py-4 shadow-md bg-black/70 backdrop-blur-sm sticky top-0 z-50">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <img src="/logo192.png" alt="LinkHub Logo" className="w-8 h-8 rounded-full" />
          <h1 className="text-2xl font-bold text-sky-700">LinkHub</h1>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-6 text-gray-700 font-medium"
        >
          <button onClick={() => scrollToSection("how")} className="hover:text-sky-600">
            How it works
          </button>
          <button onClick={() => scrollToSection("pricing")} className="hover:text-sky-600">
            Pricing
          </button>
          <button onClick={() => scrollToSection("help")} className="hover:text-sky-600">
            Help
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 border border-sky-600 text-sky-600 rounded-full hover:bg-sky-50 transition"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition"
            >
              Sign up free
            </button>
          </div>
        </motion.nav>
      </header>

      {/* ===== HERO SECTION ===== */}
      <main className="flex flex-col md:flex-row bg-blue-500 justify-between items-center px-8 md:px-16 py-20 flex-grow">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <h2 className="text-5xl font-bold text-black-700 mb-6 leading-tight">
                Welcome to LinkHub
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Connect your audience to everything you create — with just one
            smart, shareable link. Create, customize, and share your digital
            identity effortlessly.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="px-6 py-3 bg-sky-600 text-white text-lg rounded-full hover:bg-sky-700 transition"
          >
            Get Started
          </motion.button>
          <h2 className="text-4xl font-bold text-sky-300 mb-6 leading-tight">
            One Link, Endless Connections
          </h2>
        </motion.div>

        {/* Right Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative mt-12 md:mt-0"
        >
          <div className="bg-gradient-to-b from-sky-400 to-sky-600 text-white rounded-3xl shadow-2xl p-6 w-72 mx-auto">
            <div className="bg-white/90 text-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
              U
            </div>
            <h3 className="text-center font-semibold text-lg mb-1">Smart User</h3>
            <p className="text-center text-sm mb-6 opacity-90">
              Details about your business
            </p>
            <div className="space-y-3">
              <button className="w-full py-2 bg-white text-gray-800 rounded-full font-medium hover:bg-gray-100 transition">
                My YouTube
              </button>
              <button className="w-full py-2 bg-white text-gray-800 rounded-full font-medium hover:bg-gray-100 transition">
                My Instagram
              </button>
              <button className="w-full py-2 bg-white text-gray-800 rounded-full font-medium hover:bg-gray-100 transition">
                My Twitter
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ===== SCROLL INDICATOR ===== */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-center mb-10 text-sky-600 font-medium"
      >
        ↓ Scroll to explore
      </motion.div>

      {/* ===== SECTIONS ===== */}
      <section id="how" className="px-6 md:px-16 py-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-sky-700 mb-10">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Create Your Page</h3>
            <p className="text-gray-600">
              Sign up and personalize your link page with your photo, colors, and bio.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">2. Add Links</h3>
            <p className="text-gray-600">
              Add all your important links — from YouTube to your store, all in one place.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">3. Share Everywhere</h3>
            <p className="text-gray-600">
              Share your single LinkHub link in bios, profiles, and messages.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 md:px-16 py-20 bg-sky-50">
        <h2 className="text-3xl font-bold text-center text-sky-700 mb-10">
          Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <p className="text-gray-600 mb-4">$0 / month</p>
            <p>Basic features for personal use.</p>
          </div>
          <div className="bg-sky-600 text-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="mb-4">$5 / month</p>
            <p>More customization and analytics.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-2">Business</h3>
            <p className="text-gray-600 mb-4">$15 / month</p>
            <p>Everything you need for brands and teams.</p>
          </div>
        </div>
      </section>

      <section id="help" className="px-6 md:px-16 py-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-white-700 mb-10">
          Need Help?
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Have questions or need support? Visit our Help Center or reach out to
          our team at{" "}
          <a href="mailto:support@linkhub.com" className="text-sky-600 underline">
            support@linkhub.com
          </a>.
        </p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black text-white py-6 mt-auto text-center">
        <div className="flex justify-center gap-6 mb-3 text-xl">
          <FaFacebook className="hover:text-sky-300 transition" />
          <FaInstagram className="hover:text-sky-300 transition" />
          <FaTwitter className="hover:text-sky-300 transition" />
          <FaYoutube className="hover:text-sky-300 transition" />
        </div>
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} LinkHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default WelcomePage;
