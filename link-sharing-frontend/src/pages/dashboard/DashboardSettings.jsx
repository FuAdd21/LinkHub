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
  { id: "profile", label: "Profile", icon: User },
  { id: "domain", label: "Domain", icon: Globe },
  { id: "publishing", label: "Publishing", icon: Share2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
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
  const [usageSummaries, setUsageSummaries] = useState(
    userData?.usage_summaries !== 0 && userData?.usage_summaries !== false
  );

  // Security Form state
  const [passwords, setPasswords] = useState({ current: "", next: "" });
  const [newEmailInput, setNewEmailInput] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1">
          Manage workspace identity, publishing, and account preferences.
        </p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Workspace settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Control the details behind your LinkHub profile.
        </p>
      </div>

      {/* Main Settings Card with Subtab Rail */}
      <div className="flex flex-col lg:flex-row rounded-2xl bg-[#13120D] border border-white/5 overflow-hidden min-h-[600px]">
        {/* Left Subtabs Navigation */}
        <div className="w-full lg:w-56 bg-[#11120F] border-b lg:border-b-0 lg:border-r border-white/5 p-3 flex lg:flex-col gap-1 overflow-x-auto">
          {SUBTABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all text-left ${
                  isActive
                    ? "bg-[#1a1914] text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                {isActive && (
                  <span className="hidden lg:block absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-[#c6f035] rounded-r" />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Content Pane */}
        <div className="flex-1 p-6 sm:p-8 space-y-6">
          {activeTab === "profile" && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-white">Profile information</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This information appears across your workspace and public profile.
                </p>
              </div>

              {/* Avatar Row */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Avatar
                </span>
                <div className="flex items-center gap-4 pt-1">
                  <div className="w-16 h-16 rounded-full border-2 border-[#c6f035] p-0.5 flex items-center justify-center shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#1a1914] flex items-center justify-center font-bold text-base text-[#c6f035]">
                        {userInitials}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
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
                      className="px-4 py-2 rounded-lg bg-[#1a1914] hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-colors"
                    >
                      Change
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleAvatarRemove}
                        disabled={uploadingAvatar}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-xs font-semibold text-slate-400 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Display name
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
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs font-mono text-white focus:border-[#c6f035] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
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

              {/* Public Profile Toggles */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Public profile
                </span>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-medium text-white">Show profile in search</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Allow your LinkHub page to appear in discovery results.
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

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-medium text-white">Usage summaries</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Receive a concise weekly performance report.
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

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="px-4 py-2 rounded-lg bg-[#1a1914] hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "domain" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Custom domain</h3>
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

          {activeTab === "security" && (
            <div className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Security & Password</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your authentication credentials and manage session safety.
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Current password
                  </label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    New password
                  </label>
                  <input
                    type="password"
                    value={passwords.next}
                    onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {activeTab === "publishing" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Publishing & SEO</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control how your public profile displays in search engines and social links.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  SEO Title
                </label>
                <input
                  type="text"
                  defaultValue={`${name} (@${username}) — LinkHub`}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  defaultValue={bio}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#11120F] border border-white/10 text-xs text-white focus:border-[#c6f035] focus:outline-none resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => toast.success("SEO parameters updated")}
                className="px-5 py-2 rounded-lg bg-[#c6f035] text-[#0B0A07] font-bold text-xs hover:brightness-110"
              >
                Save SEO
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Notifications</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose which alerts and reports you want delivered to your email.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#11120F] border border-white/5">
                  <div>
                    <h5 className="text-xs font-bold text-white">Traffic Surges</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Get notified when daily profile views spike above normal.
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#c6f035] w-4 h-4" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#11120F] border border-white/5">
                  <div>
                    <h5 className="text-xs font-bold text-white">Security Notifications</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Immediate alert upon sign-in from a new device.
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#c6f035] w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Subscription & Plan</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your subscription tier and payment details.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#11120F] border border-[#c6f035]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#c6f035] uppercase tracking-wider">
                    PRO TIER ACTIVE
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Renews monthly</span>
                </div>
                <h4 className="text-base font-bold text-white">LinkHub Pro</h4>
                <p className="text-xs text-slate-400">
                  Unlimited destinations, verified badges, custom themes, and full analytics history.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
