import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL, getDashboardAuthConfig } from "../../api/dashboardApi";

const FONTS = [
  { id: "Inter", label: "Inter", sub: "Modern, Clean, Neutral" },
  { id: "Playfair Display", label: "Playfair Display", sub: "Elegant, Classic, High-End" },
  { id: "Fira Code", label: "Fira Code", sub: "Technical, Edgy, Brutalist" },
  { id: "Montserrat", label: "Montserrat", sub: "Geometric, Loud, Bold" },
];

const ACCENTS = [
  "#919bff", "#94eccf", "#dcbcff", "#ff808b", "#8e98ff"
];

export default function DashboardThemes({ userData, onRefresh, onUserChange }) {
  const [loading, setLoading] = useState(false);
  const currentTheme = userData?.theme || "dark";

  async function updateTheme(updates) {
    setLoading(true);
    const loadingToast = toast.loading("Reshaping atmosphere...");
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/profile`,
        updates,
        getDashboardAuthConfig()
      );
      onUserChange(data.user);
      onRefresh();
      toast.success("Design system synchronized", { id: loadingToast });
    } catch (err) {
      toast.error("Atmosphere Forge Error", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Select Theme</h1>
        <p className="text-on-surface-variant font-medium">Customize how your public LinkHub profile looks to your audience.</p>
      </div>

      {/* Mode Selection */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-1">Mode</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => updateTheme({ theme: "dark" })}
            className={`flex flex-col items-center justify-center p-8 rounded-[1.5rem] border-2 transition-all ${
              currentTheme === "dark" 
                ? "bg-primary/5 border-primary shadow-[0_0_40px_rgba(145,155,255,0.1)]" 
                : "bg-surface-container/40 border-outline-variant/10 hover:border-outline/40"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all ${currentTheme === "dark" ? "bg-primary text-black" : "bg-surface-container-highest text-outline"}`}>
              <span className="material-symbols-outlined text-3xl">dark_mode</span>
            </div>
            <span className={`font-black text-sm uppercase tracking-widest ${currentTheme === "dark" ? "text-white" : "text-slate-400"}`}>Dark Mode</span>
          </button>

          <button
            onClick={() => updateTheme({ theme: "light" })}
            className={`flex flex-col items-center justify-center p-8 rounded-[1.5rem] border-2 transition-all ${
              currentTheme === "light" 
                ? "bg-white border-primary shadow-xl" 
                : "bg-surface-container/40 border-outline-variant/10 hover:border-outline/40"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all ${currentTheme === "light" ? "bg-primary text-black" : "bg-surface-container-highest text-outline"}`}>
              <span className="material-symbols-outlined text-3xl">light_mode</span>
            </div>
            <span className={`font-black text-sm uppercase tracking-widest ${currentTheme === "light" ? "text-black" : "text-slate-400"}`}>Light Mode</span>
          </button>
        </div>
      </div>

      {/* Accent Color Selection */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-1">Accent Color</label>
        <div className="flex flex-wrap gap-5 items-center">
          {ACCENTS.map((color) => (
            <button
              key={color}
              className={`w-14 h-14 rounded-full border-4 border-transparent hover:scale-110 active:scale-95 transition-all shadow-xl relative ${
                userData?.accent_color === color ? "ring-4 ring-primary/20 ring-offset-4 ring-offset-[#0b0e14]" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => updateTheme({ accent_color: color })}
            >
              {userData?.accent_color === color && (
                <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-black text-xl">check</span>
              )}
            </button>
          ))}
          <button className="w-14 h-14 rounded-full bg-surface-container-high border-2 border-dashed border-outline-variant/30 flex items-center justify-center text-outline hover:border-primary hover:text-primary transition-all group">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">add</span>
          </button>
        </div>
      </div>

      {/* Font Selection */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-1">Font Family</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => updateTheme({ font_family: font.id })}
              className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left ${
                userData?.font_family === font.id 
                  ? "bg-surface-container-high border-primary/50" 
                  : "bg-surface-container-low/40 border-outline-variant/10 hover:border-outline/40"
              }`}
            >
              <div>
                <h4 className="font-black text-white text-base tracking-tight">{font.label}</h4>
                <p className="text-[11px] font-medium text-outline mt-1">{font.sub}</p>
              </div>
              {userData?.font_family === font.id && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
