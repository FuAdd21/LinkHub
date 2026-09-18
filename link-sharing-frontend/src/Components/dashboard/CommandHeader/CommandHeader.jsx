import { useState } from "react";
import {
  Bell,
  Check,
  Copy,
  Menu,
  Share2,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import "./CommandHeader.css";

export default function CommandHeader({
  title = "Overview",
  user,
  onMenuClick = () => {},
  onShare = null,
}) {
  const [copied, setCopied] = useState(false);

  const username = user?.username || "maya";
  const displayUrl = `linkhub.io/${username}`;
  const fullUrl = `${window.location.origin}/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Profile URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
      return;
    }

    if (navigator.share) {
      navigator
        .share({
          title: `${user?.name || username}'s LinkHub`,
          text: `Check out my links on LinkHub!`,
          url: fullUrl,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <header className="command-header">
      {/* Left: Menu & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden command-icon-btn"
          aria-label="Open sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 font-medium">LinkHub</span>
          <span className="text-slate-700">/</span>
          <span className="text-white font-semibold">{title}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* Profile Link Copy Pill */}
        <button
          onClick={handleCopy}
          className="hidden sm:flex command-link-pill items-center gap-1.5"
          title="Click to copy public profile URL"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#c6f035]" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className="font-mono text-xs">{displayUrl}</span>
        </button>

        {/* View Live Profile Button */}
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="command-icon-btn hidden sm:flex"
          title="Open live public profile"
          aria-label="Open live profile"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
        </a>

        {/* Notification Bell */}
        <button
          className="command-icon-btn"
          aria-label="Notifications"
          onClick={() => toast("You're up to date! No new notifications.", { icon: "🔔" })}
        >
          <Bell className="w-4 h-4 text-slate-300" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c6f035]" />
        </button>

        {/* Share Profile Button */}
        <button
          onClick={handleShare}
          className="command-share-btn"
          aria-label="Share profile"
        >
          <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Share profile</span>
        </button>
      </div>
    </header>
  );
}
