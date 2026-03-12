import React from "react";
import { Link2, LayoutTemplate, BarChart3, Image as ImageIcon, Settings, User, Bell } from "lucide-react";

export default function PremiumDashboardPreview() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-[24px] md:rounded-[32px] border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] overflow-hidden shadow-2xl flex flex-col transition-colors duration-300 transform-gpu">
      {/* Top Navigation Bar */}
      <div className="h-12 md:h-14 border-b border-[var(--saas-border)] bg-[var(--saas-bg-elevated)] flex items-center justify-between px-4 md:px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-md bg-[var(--saas-accent-gradient)] shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
          <div className="h-4 w-16 md:w-24 rounded bg-[var(--saas-card)] border border-[var(--saas-border)]" />
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="h-6 w-6 md:h-8 md:w-8 rounded-full border border-[var(--saas-border)] bg-gradient-to-br from-[var(--saas-card)] to-transparent flex items-center justify-center text-[var(--saas-text-secondary)] shadow-inner">
            <Bell size={14} className="opacity-70" />
          </div>
          <div className="h-6 w-6 md:h-8 md:w-8 rounded-full border border-[var(--saas-border)] bg-gradient-to-br from-[var(--saas-card)] to-transparent flex items-center justify-center text-[var(--saas-text-secondary)] shadow-inner">
            <User size={14} className="opacity-70" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-14 md:w-48 border-r border-[var(--saas-border)] bg-[var(--saas-bg-main)]/30 backdrop-blur-lg flex flex-col py-4 md:py-6 px-2 md:px-3 gap-2 z-10">
          {[
            { icon: LayoutTemplate, label: "Overview" },
            { icon: BarChart3, label: "Analytics" },
            { icon: Link2, label: "Links" },
            { icon: ImageIcon, label: "Appearance" },
            { icon: Settings, label: "Settings" }
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2 rounded-lg transition-colors ${
                i === 0
                  ? "bg-[var(--saas-card)] border border-[var(--saas-border)] text-[var(--saas-text-primary)] shadow-sm"
                  : "text-[var(--saas-text-secondary)] hover:bg-[var(--saas-card)]/50"
              }`}
            >
              <item.icon size={16} />
              <span className="hidden md:block text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-6 relative overflow-hidden bg-[var(--saas-bg-main)]/20">
          {/* Soft background glows */}
          <div className="absolute -top-10 -right-10 w-48 md:w-64 h-48 md:h-64 bg-[var(--saas-accent-gradient)] opacity-10 md:opacity-15 blur-[60px] md:blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[var(--saas-accent-primary)] opacity-5 md:opacity-10 blur-[60px] rounded-full pointer-events-none" />

          <div className="flex justify-between items-end relative z-10">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-[var(--saas-text-primary)] tracking-tight">
                Welcome back
              </h3>
              <p className="text-xs md:text-sm text-[var(--saas-text-secondary)]">Overview of your activity</p>
            </div>
            <div className="hidden md:flex h-8 px-4 rounded-full bg-[var(--saas-text-primary)] text-[var(--saas-bg-main)] items-center justify-center text-xs font-semibold shadow-lg hover:scale-105 transition-transform cursor-default">
              View Analytics
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 relative z-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 md:h-24 rounded-xl md:rounded-2xl border border-[var(--saas-border)] bg-gradient-to-br from-[var(--saas-card)] to-transparent p-3 md:p-4 flex flex-col justify-between backdrop-blur-md shadow-sm"
              >
                <div className="h-3 md:h-4 w-8 md:w-12 bg-[var(--saas-border)] rounded-md" />
                <div className="h-5 md:h-6 w-16 md:w-20 bg-[var(--saas-text-secondary)] opacity-[0.15] rounded-md" />
              </div>
            ))}
          </div>

          <div className="flex-1 rounded-xl md:rounded-2xl border border-[var(--saas-border)] bg-gradient-to-b from-[var(--saas-card)] to-transparent p-3 md:p-4 flex flex-col gap-3 backdrop-blur-md shadow-sm relative z-10">
            <div className="h-3 md:h-4 w-24 md:w-32 bg-[var(--saas-border)] rounded-md mb-1 md:mb-2" />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-10 md:h-12 w-full rounded-lg md:rounded-xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)]/50 flex items-center px-3 md:px-4 justify-between hover:bg-[var(--saas-bg-elevated)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 md:h-6 md:w-6 rounded-md bg-[var(--saas-card)] border border-[var(--saas-border)]" />
                  <div className="h-2 md:h-3 w-16 md:w-24 bg-[var(--saas-border)] rounded-md" />
                </div>
                <div className="h-2 md:h-3 w-12 md:w-16 bg-[var(--saas-border)] rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glossy overlay effect to make it feel premium */}
      <div className="pointer-events-none absolute inset-0 rounded-[24px] md:rounded-[32px] border border-white/[0.04] ring-1 ring-inset ring-white/[0.04] mix-blend-overlay z-20" />
    </div>
  );
}
