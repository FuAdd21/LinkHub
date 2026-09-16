import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL, getDashboardAuthConfig } from "../../api/dashboardApi";

export default function DashboardSettings({ userData, onLogout }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(userData?.email || "");
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [emailPassword, setEmailPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleEmailChange(e) {
    if (e) e.preventDefault();
    if (!email || email === userData?.email) {
      toast.error("Enter a new email address");
      return;
    }
    if (!emailPassword) {
      toast.error("Current password required to change email");
      return;
    }
    setSaving(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/email`,
        { newEmail: email, currentPassword: emailPassword },
        getDashboardAuthConfig()
      );
      setEmailPassword("");
      toast.success("Email updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update email");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e) {
    if (e) e.preventDefault();
    if (!passwords.current || !passwords.new) {
      toast.error("Both password fields are required");
      return;
    }
    setChangingPassword(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/password`,
        { currentPassword: passwords.current, newPassword: passwords.new },
        getDashboardAuthConfig()
      );
      setPasswords({ current: "", new: "" });
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    if (!deletePassword) {
      toast.error("Enter your password to confirm deletion");
      return;
    }
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/users/account`, {
        ...getDashboardAuthConfig(),
        data: { currentPassword: deletePassword },
      });
      toast.success("Account deleted");
      onLogout();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="space-y-8 text-left">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Account Settings</h1>
          <p className="text-on-surface-variant font-medium">Manage your account credentials and personal information.</p>
        </div>

        {/* Email Change Card */}
        <div className="bg-surface-container/40 backdrop-blur-xl border border-outline-variant/10 rounded-[2rem] p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-outline uppercase tracking-[0.3em] px-1 mb-2">Email Address</label>
            <input 
              className="w-full bg-surface-container-high border border-outline-variant/5 rounded-xl py-4 px-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all outline-none font-bold tracking-tight text-sm" 
              placeholder="hello@creator.com" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-outline uppercase tracking-[0.3em] px-1 mb-2">Confirm with Current Password</label>
            <input 
              className="w-full bg-surface-container-high border border-outline-variant/5 rounded-xl py-4 px-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all outline-none font-bold tracking-tight text-sm" 
              placeholder="Enter current password" 
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
            />
          </div>
          <div className="pt-2">
            <button 
                onClick={handleEmailChange}
                disabled={saving}
                className="px-10 py-4 bg-primary text-on-primary font-black rounded-xl active:scale-95 transition-all shadow-xl shadow-primary/20 hover:brightness-110 uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
            >
                {saving ? "Saving..." : "Update Email"}
            </button>
          </div>
        </div>

        {/* Password Change Card */}
        <div className="bg-surface-container/40 backdrop-blur-xl border border-outline-variant/10 rounded-[2rem] p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-outline uppercase tracking-[0.3em] px-1 mb-2">Change Password</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                className="w-full bg-surface-container-high border border-outline-variant/5 rounded-xl py-4 px-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all outline-none font-bold tracking-tight text-sm" 
                placeholder="Current Password" 
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
              />
              <input 
                className="w-full bg-surface-container-high border border-outline-variant/5 rounded-xl py-4 px-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all outline-none font-bold tracking-tight text-sm" 
                placeholder="New Password" 
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
              />
            </div>
            <p className="text-[10px] text-outline/50 px-1 mt-2">Min 8 characters, 1 uppercase letter, 1 number</p>
          </div>

          <div className="pt-2">
            <button 
                onClick={handlePasswordChange}
                disabled={changingPassword}
                className="px-10 py-4 bg-primary text-on-primary font-black rounded-xl active:scale-95 transition-all shadow-xl shadow-primary/20 hover:brightness-110 uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
            >
                {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-surface-container-low/20 rounded-[1.5rem] p-8 border border-outline-variant/10">
          {!showDeleteConfirm ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <h3 className="text-error font-black text-lg uppercase tracking-tight">Danger Zone</h3>
                <p className="text-on-surface-variant text-sm mt-1 font-medium opacity-60">Permanently delete your account and all links.</p>
              </div>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="px-8 py-3 bg-error/10 text-error hover:bg-error hover:text-white rounded-xl font-bold transition-all uppercase tracking-[0.1em] text-[10px] border border-error/20 active:scale-95"
              >
                  Delete Account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-error font-black text-lg uppercase tracking-tight">Confirm Account Deletion</h3>
              <p className="text-on-surface-variant text-sm font-medium opacity-60">
                This action is irreversible. All your links, analytics, and profile data will be permanently removed.
              </p>
              <input 
                className="w-full bg-surface-container-high border border-error/20 rounded-xl py-4 px-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-error/40 transition-all outline-none font-bold tracking-tight text-sm" 
                placeholder="Enter your password to confirm" 
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              <div className="flex gap-4">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="px-8 py-3 bg-error text-white rounded-xl font-bold transition-all uppercase tracking-[0.1em] text-[10px] active:scale-95 disabled:opacity-50"
                >
                    {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
                <button 
                  onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); }}
                  className="px-8 py-3 bg-white/5 text-on-surface-variant rounded-xl font-bold transition-all uppercase tracking-[0.1em] text-[10px] active:scale-95 hover:bg-white/10"
                >
                    Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
