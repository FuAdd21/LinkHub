import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  User,
  Globe,
  Share2,
  Bell,
  Shield,
  CreditCard,
  Upload,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../api/config";
import { getAvatarUrl } from "../../Components/dashboard/dashboardUtils";

const SUBTABS = [
  { id: "profile", label: "Profile" },
  { id: "domain", label: "Domain" },
  { id: "publishing", label: "Publishing" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "billing", label: "Billing" },
];

export default function DashboardSettings({ userData, onRefresh, onUserChange, onLogout }) {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form state
  const [name, setName] = useState(userData?.name || "Maya Kim");
  const [username, setUsername] = useState(userData?.username || "maya");
  const [email, setEmail] = useState(userData?.email || "maya@studio.dev");
  const [bio, setBio] = useState(userData?.bio || "Creator, developer, systems thinker.");
  const [showInSearch, setShowInSearch] = useState(
    userData?.show_in_search !== 0 && userData?.show_in_search !== false
  );
  const [showAudienceTotals, setShowAudienceTotals] = useState(
    userData?.show_audience_totals !== 0 && userData?.show_audience_totals !== false
  );
  const [usageSummaries, setUsageSummaries] = useState(
    userData?.usage_summaries !== 0 && userData?.usage_summaries !== false
  );

  // Security Form state
  const [passwords, setPasswords] = useState({ current: "", next: "" });

  // Domain state
  const [customDomain, setCustomDomain] = useState(userData?.custom_domain || "");

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      if (userData.name) setName(userData.name);
      if (userData.username) setUsername(userData.username);
      if (userData.email) setEmail(userData.email);
      if (userData.bio) setBio(userData.bio);
      if (userData.custom_domain) setCustomDomain(userData.custom_domain);
      setShowInSearch(userData.show_in_search !== 0 && userData.show_in_search !== false);
      setShowAudienceTotals(userData.show_audience_totals !== 0 && userData.show_audience_totals !== false);
      setUsageSummaries(userData.usage_summaries !== 0 && userData.usage_summaries !== false);
    }
  }, [userData]);

  // Handle Discard
  const handleDiscard = () => {
    if (userData) {
      setName(userData.name || "");
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setBio(userData.bio || "");
      setShowInSearch(userData.show_in_search !== 0 && userData.show_in_search !== false);
      setShowAudienceTotals(userData.show_audience_totals !== 0 && userData.show_audience_totals !== false);
      setUsageSummaries(userData.usage_summaries !== 0 && userData.usage_summaries !== false);
    }
    toast("Changes discarded", { icon: "↩️" });
  };

  // Handle Save Profile
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Saving workspace settings...");

    try {
      const payload = {
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        show_in_search: showInSearch ? 1 : 0,
        show_audience_totals: showAudienceTotals ? 1 : 0,
        usage_summaries: usageSummaries ? 1 : 0,
      };

      const res = await api.put("/api/users/profile-details", payload);
      onUserChange?.(res.data.user);
      onRefresh?.();
      toast.success("Settings saved successfully", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle Avatar Upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image must be under 5MB");
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    const toastId = toast.loading("Uploading avatar...");
    try {
      const res = await api.put("/api/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUserChange?.((prev) => ({ ...prev, avatar: res.data.avatar }));
      onRefresh?.();
      toast.success("Avatar updated", { id: toastId });
    } catch {
      toast.error("Failed to upload avatar", { id: toastId });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle Avatar Remove
  const handleAvatarRemove = async () => {
    setUploadingAvatar(true);
    const toastId = toast.loading("Removing avatar...");
    try {
      await api.delete("/api/users/avatar");
      onUserChange?.((prev) => ({ ...prev, avatar: null }));
      onRefresh?.();
      toast.success("Avatar removed", { id: toastId });
    } catch {
      toast.error("Failed to remove avatar", { id: toastId });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next) {
      toast.error("Both password fields are required");
      return;
    }
    setSaving(true);
    try {
      await api.put("/api/users/password", {
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPasswords({ current: "", next: "" });
      toast.success("Password updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = getAvatarUrl(userData?.avatar);
  const userInitials = (name || "MK")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your account credentials, security preferences, and data privacy.
          </p>
        </div>
      </div>

      {/* Horizontal Segmented Tabs Pill Bar (matching mobile-05 & tablet-05) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {SUBTABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? "border-[#c6f035] text-[#c6f035] bg-[#161510]"
                  : "border-white/5 text-slate-400 bg-[#13120D] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Card */}
      <div className="rounded-2xl bg-[#13120D] border border-white/5 p-5 sm:p-7 space-y-6">
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* PROFILE INFORMATION */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Profile Information
              </span>

              <div className="flex items-center gap-4 pt-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#c6f035] p-1 flex items-center justify-center shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#1a1914] flex items-center justify-center font-bold text-lg text-[#c6f035]">
                      {userInitials}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="px-4 py-2 rounded-lg bg-[#1a1914] hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
                  >
                    Change photo
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleAvatarRemove}
                      disabled={uploadingAvatar}
                      className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-xs font-semibold text-slate-400 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 2-Column Responsive Layout: Left Inputs, Right Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Left Column: Form Inputs */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Handle
                  </label>
                  <div className="flex items-center rounded-lg bg-[#11120F] border border-white/10 overflow-hidden focus-within:border-[#c6f035]">
                    <span className="px-3 text-xs font-mono text-slate-500 bg-black/20 border-r border-white/5 py-2.5">
                      linkhub.io/
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2.5 bg-transparent text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="hidden sm:block space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/5 text-xs font-mono text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Public Profile Toggles */}
              <div className="space-y-4 pt-2 md:pt-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Public Profile
                </span>

                <div className="space-y-4">
                  {/* Toggle 1: Appear in search */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-semibold text-white">Appear in search</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Allow public discovery
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowInSearch(!showInSearch)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        showInSearch ? "bg-[#c6f035]" : "bg-[#25241f]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0B0A07] shadow-lg ring-0 transition duration-200 ease-in-out ${
                          showInSearch ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-white/5" />

                  {/* Toggle 2: Show audience totals */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-semibold text-white">Show audience totals</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Display combined social proof
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAudienceTotals(!showAudienceTotals)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        showAudienceTotals ? "bg-[#c6f035]" : "bg-[#25241f]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0B0A07] shadow-lg ring-0 transition duration-200 ease-in-out ${
                          showAudienceTotals ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 3 on Tablet/Desktop: Activity summaries */}
                  <div className="hidden md:block">
                    <div className="border-t border-white/5 my-4" />
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h5 className="text-xs font-semibold text-white">Activity summaries</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Monthly performance email
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUsageSummaries(!usageSummaries)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          usageSummaries ? "bg-[#c6f035]" : "bg-[#25241f]"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0B0A07] shadow-lg ring-0 transition duration-200 ease-in-out ${
                            usageSummaries ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Actions: Full-width "Save changes" button (matching mobile-05) */}
            <div className="md:hidden pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-[#c6f035] text-[#0B0A07] font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#c6f035]/15 disabled:opacity-50"
              >
                {saving ? "Saving changes..." : "Save changes"}
              </button>
            </div>

            {/* Tablet & Desktop Actions: Discard & Save buttons (matching tablet-05) */}
            <div className="hidden md:flex items-center justify-end gap-3 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-5 py-2 rounded-lg bg-[#161510] hover:bg-white/5 border border-white/5 text-xs font-semibold text-slate-300 transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}

        {/* DOMAIN SUBTAB */}
        {activeTab === "domain" && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-sm font-bold text-white">Custom Domain</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Point your personal domain (e.g. links.yourdomain.com) to your LinkHub profile.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Domain Name
              </label>
              <input
                type="text"
                placeholder="links.mydomain.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs font-mono text-white focus:border-[#c6f035] focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#11120F] border border-white/5 space-y-2 text-xs font-mono">
              <span className="text-slate-400 font-bold">DNS Configuration</span>
              <p className="text-slate-500">
                Create a CNAME record in your DNS provider:
              </p>
              <div className="flex items-center justify-between p-2.5 rounded bg-black/40 text-slate-300">
                <span>CNAME @ cname.linkhub.io</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toast.success("Domain configuration saved")}
              className="px-5 py-2 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110"
            >
              Save Domain
            </button>
          </div>
        )}

        {/* PUBLISHING SUBTAB */}
        {activeTab === "publishing" && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white">Publishing & SEO</h3>
            <p className="text-xs text-slate-500">
              Configure how your LinkHub page appears when shared on social networks and search engines.
            </p>
            <div className="p-4 rounded-xl bg-[#11120F] border border-white/5 space-y-2 text-xs">
              <div className="font-bold text-white">Live URL</div>
              <div className="font-mono text-slate-400 text-[11px]">
                https://linkhub.io/{username}
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS SUBTAB */}
        {activeTab === "notifications" && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white">Notification Preferences</h3>
            <p className="text-xs text-slate-500">
              Manage email alerts for link clicks, milestones, and security logins.
            </p>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#11120F] border border-white/5">
              <span className="text-xs text-white">Milestone celebration alerts</span>
              <span className="text-xs font-bold text-[#c6f035]">Enabled</span>
            </div>
          </div>
        )}

        {/* SECURITY SUBTAB */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordChange} className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-sm font-bold text-white">Change Password</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure your account is using a secure, random password.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              Update Password
            </button>
          </form>
        )}

        {/* BILLING SUBTAB */}
        {activeTab === "billing" && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white">Subscription & Plan</h3>
            <p className="text-xs text-slate-500">
              You are currently on the LinkHub Pro plan with unlimited custom links and integrations.
            </p>
            <div className="p-4 rounded-xl bg-[#11120F] border border-[#c6f035]/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#c6f035]">LinkHub Pro</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Active tier · Renews yearly</div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#c6f035]/15 text-[#c6f035] text-xs font-bold font-mono">
                PRO
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
