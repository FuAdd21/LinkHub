import { useState } from "react";
import toast from "react-hot-toast";

export default function DashboardSettings({ userData, onLogout }) {
  const [email, setEmail] = useState(userData?.email || "");
  const [passwords, setPasswords] = useState({ current: "", new: "" });

  function handleSave(e) {
    if (e) e.preventDefault();
    toast.success("Account changes saved");
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="space-y-8 text-left">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Account Settings</h1>
          <p className="text-on-surface-variant font-medium">Manage your account credentials and personal information.</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container/40 backdrop-blur-xl border border-outline-variant/10 rounded-[2rem] p-8 space-y-8">
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
            <label className="block text-[10px] font-black text-outline uppercase tracking-[0.3em] px-1 mb-2">Password Change</label>
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
          </div>

          <div className="pt-2">
            <button 
                onClick={handleSave}
                className="px-10 py-4 bg-primary text-on-primary font-black rounded-xl active:scale-95 transition-all shadow-xl shadow-primary/20 hover:brightness-110 uppercase tracking-[0.2em] text-[10px]"
            >
                Save Changes
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-surface-container-low/20 rounded-[1.5rem] p-8 border border-outline-variant/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-error font-black text-lg uppercase tracking-tight">Danger Zone</h3>
              <p className="text-on-surface-variant text-sm mt-1 font-medium opacity-60">Permanently delete your account and all links.</p>
            </div>
            <button className="px-8 py-3 bg-error/10 text-error hover:bg-error hover:text-white rounded-xl font-bold transition-all uppercase tracking-[0.1em] text-[10px] border border-error/20 active:scale-95">
                Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
