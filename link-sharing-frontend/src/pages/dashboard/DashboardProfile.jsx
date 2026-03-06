import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Camera, Save, Check, AlertCircle, ExternalLink } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const DashboardProfile = ({ userData, onRefresh }) => {
  const [username, setUsername] = useState(userData?.username || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Update local state when userData changes
  React.useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setBio(userData.bio || "");
    }
  }, [userData]);

  const checkUsername = async (value) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    setUsername(clean);

    if (clean.length < 3) {
      setUsernameStatus(null);
      return;
    }

    if (clean === userData?.username) {
      setUsernameStatus("available");
      return;
    }

    setUsernameStatus("checking");
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/profile/check/${clean}`
      );
      setUsernameStatus(res.data.available ? "available" : "taken");
    } catch {
      setUsernameStatus(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save username if changed
      if (username && username !== userData?.username) {
        await axios.put(
          `${API_BASE_URL}/api/profile/username`,
          { username },
          { headers }
        );
      }

      // Save bio
      await axios.put(
        `${API_BASE_URL}/api/profile`,
        { bio },
        { headers }
      );

      toast.success("Profile saved! Redirecting to your public page...");
      onRefresh?.();

      // Redirect to public profile page
      if (username && username.length >= 3) {
        setTimeout(() => {
          navigate(`/${username}`);
        }, 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await axios.put(`${API_BASE_URL}/api/users/avatar`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      toast.success("Avatar uploaded!");
      onRefresh?.();
    } catch {
      toast.error("Failed to upload avatar");
    }
  };

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (userData?.avatar) {
      return userData.avatar.startsWith("http")
        ? userData.avatar
        : `${API_BASE_URL}${userData.avatar}`;
    }
    return null;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
        Profile
      </h2>
      <p className="text-[var(--text-muted)] text-sm mb-8">
        Set up your public identity
      </p>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--input-border)] group-hover:border-[var(--accent)] transition-colors"
                 style={{ backgroundColor: "var(--input-bg)" }}>
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl"
                     style={{ color: "var(--text-muted)" }}>
                  {(userData?.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-[var(--text-primary)] text-sm font-medium">
              Profile Photo
            </p>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">
              Click to upload (JPG, PNG)
            </p>
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">
              linkhub.com/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => checkUsername(e.target.value)}
              placeholder="yourname"
              className="w-full pl-[110px] pr-10 py-3 rounded-xl text-sm transition-colors
                       focus:outline-none focus:ring-1"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                color: "var(--text-primary)",
              }}
            />
            {/* Status indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {usernameStatus === "checking" && (
                <div className="w-4 h-4 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
              )}
              {usernameStatus === "available" && (
                <Check className="w-4 h-4 text-green-400" />
              )}
              {usernameStatus === "taken" && (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
          {usernameStatus === "taken" && (
            <p className="text-red-400 text-xs mt-1.5">
              This username is already taken
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell visitors about yourself..."
            maxLength={160}
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm resize-none transition-colors
                     focus:outline-none focus:ring-1"
            style={{
              backgroundColor: "var(--input-bg)",
              border: "1px solid var(--input-border)",
              color: "var(--text-primary)",
            }}
          />
          <p className="text-[var(--text-muted)] text-xs mt-1 text-right">
            {bio.length}/160
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          <motion.button
            type="submit"
            disabled={saving || usernameStatus === "taken"}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white
                     text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            style={{ background: "var(--accent-gradient)" }}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Profile"}
          </motion.button>

          {userData?.username && (
            <a
              href={`/${userData.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{
                color: "var(--accent)",
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--card-border)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Page
            </a>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default DashboardProfile;
