import React from "react";
import { Link } from "react-router-dom";

export function LinkHubMark({ className = "w-7 h-7", iconClassName = "w-4 h-4" }) {
  return (
    <div
      className={`rounded-lg bg-[#c6f035] flex items-center justify-center text-[#0b0c0e] shrink-0 font-black shadow-sm ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassName}
      >
        <path d="M7 8l-4 4 4 4" />
        <path d="M3 12h18" />
        <path d="M17 8l4 4-4 4" />
      </svg>
    </div>
  );
}

export default function LinkHubLogo({
  showPro = false,
  to = "/",
  className = "",
  markClassName = "w-8 h-8",
  textClassName = "text-[17px] font-bold text-white tracking-tight",
}) {
  const content = (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <LinkHubMark className={markClassName} iconClassName="w-4 h-4" />
      <span className={textClassName}>LinkHub</span>
      {showPro && (
        <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-zinc-400 border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 rounded">
          PRO
        </span>
      )}
    </div>
  );

  if (!to) return content;
  return <Link to={to}>{content}</Link>;
}
