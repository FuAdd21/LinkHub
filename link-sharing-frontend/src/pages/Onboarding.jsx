import React, { useState, useRef, useContext, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, assetUrl } from "../api/config.js";
import LinkHubLogo from "../Components/common/LinkHubLogo";
import { Check } from "lucide-react";

const CREATE_ROLES = ["Creator", "Developer", "Brand", "Other"];

export default function Onboarding() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.name || "Maya Kim");
  const [address, setAddress] = useState(user?.username || "maya");
  const [bio, setBio] = useState("Creator, developer, systems thinker.");
  const [selectedRole, setSelectedRole] = useState("Creator");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addressStatus, setAddressStatus] = useState("available");

  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);

  // Check username availability
  const checkUsernameApi = useCallback(async (clean) => {
    if (!clean || clean.length < 3) {
      setAddressStatus(null);
      return;
    }
    try {
      const res = await api.get(`/api/profile/check/${clean}`);
      setAddressStatus(res.data.available ? "available" : "taken");
    } catch {
      setAddressStatus("available");
    }
  }, []);

  const handleAddressChange = (value) => {
    // Strip linkhub.io/ prefix if user types/pastes it
    const cleanPrefix = value.replace(/^https?:\/\//, "").replace(/^linkhub\.io\/?/, "");
    const clean = cleanPrefix.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    setAddress(clean);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => checkUsernameApi(clean), 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5 MB limit.");
      return;
    }
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleComplete = async () => {
    const cleanUser = (address || "maya").trim();
    if (!cleanUser) {
      toast.error("LinkHub address is required.");
      return;
    }

    if (addressStatus === "taken") {
      toast.error("That LinkHub address is already taken. Please pick another.");
      return;
    }

    setLoading(true);

    try {
      // 1. Update Display Name and Username
      await api.put("/api/profile/username", { username: cleanUser });

      // 2. Set Bio, Theme, and Category
      await api.put("/api/profile", {
        bio,
        theme: "dark-pro",
        category: selectedRole,
        name: displayName,
      });

      // 3. Upload Avatar if selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        await api.put("/api/users/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }


      // Update local storage & auth context
      const updatedUser = {
        ...user,
        name: displayName,
        username: cleanUser,
      };
      if (token) login(token, updatedUser);

      toast.success("Profile initialized! Welcome to your command center.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initialize profile.");
    } finally {
      setLoading(false);
    }
  };

  const initials = (displayName || "Maya Kim")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "MK";

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-[#c6f035] selection:text-black font-sans flex flex-col justify-between">
      {/* ──── Header ──── */}
      <header className="w-full border-b border-white/[0.07] px-6 sm:px-10 lg:px-16 py-4.5 flex items-center justify-between">
        <LinkHubLogo showPro={true} />

        {/* Stepper Label in Header */}
        <div className="text-xs font-mono font-medium tracking-widest text-zinc-400 uppercase">
          <span className="hidden sm:inline">STEP 02 / 03</span>
          <span className="sm:hidden text-[#c6f035] font-bold">02 / 03</span>
        </div>
      </header>

      {/* ──── Main Content ──── */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12">
        {/* Top Header Row with Kicker & Stepper Timeline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#c6f035] uppercase">
            CREATE YOUR IDENTITY
          </div>

          {/* Stepper Timeline (Desktop) */}
          <div className="hidden sm:flex items-center">
            {/* Step 1: Account (Done) */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#c6f035] text-[#07080a] flex items-center justify-center text-[10px] font-bold">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-[9px] font-mono font-medium tracking-widest text-zinc-400 uppercase">
                ACCOUNT
              </span>
            </div>

            <div className="w-8 h-[1px] bg-[#c6f035] mx-3" />

            {/* Step 2: Profile (Active) */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#c6f035] text-[#07080a] flex items-center justify-center text-[10px] font-bold font-mono">
                02
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest text-white uppercase">
                PROFILE
              </span>
            </div>

            <div className="w-8 h-[1px] bg-zinc-800 mx-3" />

            {/* Step 3: Publish */}
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

        {/* Page Title & Subtitle */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
            <span className="sm:hidden">Make it yours.</span>
            <span className="hidden sm:inline">Make the first impression yours.</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal">
            <span className="sm:hidden">Choose the essentials. Fine-tune later.</span>
            <span className="hidden sm:inline">Choose the essentials now. Fine-tune everything later.</span>
          </p>
        </div>

        {/* Mobile Stepper Timeline Bar */}
        <div className="sm:hidden flex items-center justify-between my-6">
          <div className="w-6 h-6 rounded-full bg-[#c6f035] text-[#07080a] flex items-center justify-center text-xs font-bold shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div className="flex-1 h-[1px] bg-[#c6f035] mx-2" />
          <div className="w-6 h-6 rounded-full bg-[#c6f035] text-[#07080a] flex items-center justify-center text-xs font-bold font-mono shrink-0">
            2
          </div>
          <div className="flex-1 h-[1px] bg-zinc-800 mx-2" />
          <div className="w-6 h-6 rounded-full bg-[#121316] border border-white/10 text-zinc-600 flex items-center justify-center text-xs font-medium font-mono shrink-0">
            3
          </div>
        </div>

        {/* Two-Column Grid: Form Essentials (Left) + Phone Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Profile Essentials Form */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase">
                PROFILE ESSENTIALS
              </div>

              {/* Avatar Upload Block */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full border-2 border-[#c6f035] bg-[#121316] text-[#c6f035] font-extrabold text-xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#141518] border border-white/10 hover:bg-white/5 text-white font-semibold text-xs px-5 py-3 rounded-lg transition-all"
                  >
                    Upload photo
                  </button>
                  <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-1.5">
                    JPG or PNG · 5 MB max
                  </div>
                </div>
              </div>

              {/* Input Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Display Name */}
                <div>
                  <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
                    DISPLAY NAME
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Maya Kim"
                    className="w-full bg-[#121316] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c6f035] transition-all"
                  />
                </div>

                {/* LinkHub Address */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase">
                      LINKHUB ADDRESS
                    </label>
                    {address && (
                      <span
                        className={`text-[9px] font-mono uppercase ${
                          addressStatus === "available"
                            ? "text-[#c6f035]"
                            : "text-red-400"
                        }`}
                      >
                        {addressStatus === "available" ? "AVAILABLE" : "TAKEN"}
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={address.startsWith("linkhub.io/") ? address : `linkhub.io/${address}`}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="linkhub.io/maya"
                      className="w-full bg-[#121316] border border-white/10 rounded-lg px-4 py-3.5 text-sm font-mono text-white focus:outline-none focus:border-[#c6f035] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Short Bio */}
              <div>
                <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
                  SHORT BIO
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Creator, developer, systems thinker."
                  rows={2}
                  className="w-full bg-[#121316] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#c6f035] transition-all resize-none"
                />
              </div>

              {/* I Create As */}
              <div>
                <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-3">
                  I CREATE AS
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {CREATE_ROLES.map((role) => {
                    const isSelected = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`text-xs font-semibold px-6 py-2.5 rounded-full transition-all ${
                          isSelected
                            ? "bg-[#c6f035] text-[#07080a] shadow-sm font-bold"
                            : "bg-[#141518] border border-white/10 text-zinc-300 hover:border-white/20"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-zinc-500 mt-2.5">
                  This helps tailor your starting dashboard. It never limits your profile.
                </p>
              </div>
            </div>

            {/* Action Buttons (Desktop) */}
            <div className="hidden sm:flex items-center gap-4 mt-10">
              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="bg-[#c6f035] text-[#07080a] font-bold text-sm px-9 py-3.5 rounded-lg hover:brightness-105 transition-all shadow-[0_2px_12px_rgba(198,240,53,0.15)] disabled:opacity-50"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="bg-[#141518] border border-white/10 text-white font-semibold text-sm px-9 py-3.5 rounded-lg hover:bg-white/5 transition-all"
              >
                Back
              </button>
            </div>

            {/* Mobile Full-Width Continue Button */}
            <div className="sm:hidden mt-8 w-full">
              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="w-full py-4 bg-[#c6f035] text-[#07080a] font-bold text-sm rounded-xl text-center shadow-lg disabled:opacity-50"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
              <div className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase text-center mt-4">
                Saved securely · editable anytime
              </div>
            </div>
          </div>

          {/* Right Column: Desktop Phone Live Preview Mockup */}
          <div className="hidden lg:flex lg:col-span-4 justify-center">
            <div className="w-full max-w-[340px] rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-xl p-4 shadow-2xl">
              {/* Preview Header */}
              <div className="flex items-center justify-between px-1 mb-3">
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#c6f035] uppercase">
                  LIVE PREVIEW
                </span>
                <span className="text-[9px] font-mono font-medium tracking-widest text-zinc-500 uppercase">
                  MOBILE
                </span>
              </div>

              {/* Inner Phone Frame Canvas */}
              <div className="border border-white/[0.06] rounded-[22px] bg-[#07080a] p-6 flex flex-col items-center min-h-[440px]">
                {/* Preview Avatar */}
                <div className="w-16 h-16 rounded-full border-2 border-[#c6f035] bg-[#121316] text-[#c6f035] font-extrabold text-lg flex items-center justify-center overflow-hidden shadow-sm">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-base font-bold text-white tracking-tight mt-3.5 text-center">
                  {displayName || "Maya Kim"}
                </h3>

                {/* Handle */}
                <div className="text-[10px] font-mono text-zinc-500 mt-0.5 text-center">
                  @{address || "maya"}
                </div>

                {/* Bio */}
                <p className="text-[11px] text-zinc-400 text-center mt-2 leading-relaxed px-2 font-normal">
                  {bio || "Creator, developer, systems thinker."}
                </p>

                {/* Simulated Link Buttons */}
                <div className="w-full mt-6 space-y-2.5">
                  <div className="w-full py-3 bg-[#121316] border border-white/[0.06] rounded-xl text-xs font-medium text-white text-center">
                    My work
                  </div>
                  <div className="w-full py-3 bg-[#121316] border border-white/[0.06] rounded-xl text-xs font-medium text-white text-center">
                    Latest video
                  </div>
                  <div className="w-full py-3 bg-[#121316] border border-white/[0.06] rounded-xl text-xs font-medium text-white text-center">
                    Say hello
                  </div>
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
