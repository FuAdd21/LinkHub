import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Link2,
  Sparkles,
} from "lucide-react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaSpotify,
} from "react-icons/fa";
import { getAvatarUrl, getVisibleLinks } from "../dashboardUtils";
import "./LiveCanvasPreview.css";

function getPlatformIcon(platform = "", url = "") {
  const p = (platform || "").toLowerCase();
  const u = (url || "").toLowerCase();

  if (p.includes("github") || u.includes("github.com")) return FaGithub;
  if (p.includes("youtube") || u.includes("youtube.com") || u.includes("youtu.be")) return FaYoutube;
  if (p.includes("instagram") || u.includes("instagram.com")) return FaInstagram;
  if (p.includes("twitter") || p.includes("x") || u.includes("twitter.com") || u.includes("x.com")) return FaTwitter;
  if (p.includes("linkedin") || u.includes("linkedin.com")) return FaLinkedin;
  if (p.includes("tiktok") || u.includes("tiktok.com")) return FaTiktok;
  if (p.includes("spotify") || u.includes("spotify.com")) return FaSpotify;

  return Link2;
}

function extractDomain(url = "") {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace("www.", "") + (parsed.pathname !== "/" ? parsed.pathname.slice(0, 15) : "");
  } catch {
    return url || "linkhub.io";
  }
}

export default function LiveCanvasPreview({ user, links = [], integrations }) {
  const username = user?.username || "maya";
  const name = user?.name || user?.username || "Maya K.";
  const bio = user?.bio || "Developer, designer, and curious builder sharing the work in progress.";
  const avatarUrl = getAvatarUrl(user?.avatar || user);

  const visibleLinks = getVisibleLinks(links);
  const displayLinks = visibleLinks.length > 0
    ? visibleLinks.slice(0, 4)
    : [
        { id: 1, title: "Explore my open-source toolkit", url: "https://github.com/maya", platform: "github" },
        { id: 2, title: "Build in public — weekly", url: "https://youtube.com/@maya", platform: "youtube" },
        { id: 3, title: "Behind the scenes", url: "https://instagram.com/maya", platform: "instagram" },
      ];

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const publicUrl = `/${username}`;

  // Connected integrations list if passed
  const connectedList = Array.isArray(integrations)
    ? integrations
    : integrations?.connected || [];

  return (
    <div className="canvas-rail-container">
      {/* Top Header */}
      <div className="canvas-header">
        <div>
          <div className="canvas-badge">Live Canvas</div>
          <Link
            to={publicUrl}
            target="_blank"
            className="canvas-public-link mt-0.5"
          >
            <span>Public profile</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Phone Canvas with subtle grid */}
      <div className="canvas-phone-frame preview-grid">
        {/* Avatar */}
        <div className="canvas-avatar-circle">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* User Identity */}
        <div className="canvas-name">
          <span>{name}</span>
          <CheckCircle2 className="w-4 h-4 fill-[#c6f035] text-[#0d0f0d]" />
        </div>

        <div className="canvas-handle">@{username}</div>

        <p className="canvas-bio">{bio}</p>

        {/* Social Icons Pill Row */}
        <div className="canvas-socials-row">
          <a
            href={user?.githubUser ? `https://github.com/${user.githubUser}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="canvas-social-btn"
            aria-label="GitHub"
          >
            <FaGithub className="w-3.5 h-3.5" />
          </a>
          <a
            href={user?.instagram ? `https://instagram.com/${user.instagram}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="canvas-social-btn"
            aria-label="Instagram"
          >
            <FaInstagram className="w-3.5 h-3.5" />
          </a>
          <a
            href={user?.youtubeId ? `https://youtube.com/${user.youtubeId}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="canvas-social-btn"
            aria-label="YouTube"
          >
            <FaYoutube className="w-3.5 h-3.5" />
          </a>
          <a
            href="#"
            className="canvas-social-btn"
            aria-label="Website"
          >
            <Globe className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Rich Connected Social Channel Cards */}
        {connectedList.length > 0 && (
          <div className="w-full space-y-2 mb-2">
            {connectedList.slice(0, 3).map((net) => {
              const p = net.provider.toLowerCase();
              const isYT = p === "youtube";
              const isGH = p === "github";
              const isIG = p === "instagram";
              const actionUrl = isYT
                ? (net.profileUrl ? (net.profileUrl.includes("?") ? `${net.profileUrl}&sub_confirmation=1` : `${net.profileUrl}?sub_confirmation=1`) : `https://youtube.com/${net.handle}?sub_confirmation=1`)
                : net.profileUrl;

              return (
                <div
                  key={net.provider}
                  className="w-full p-2.5 rounded-xl bg-[#13120D]/90 border border-white/10 flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0 bg-[#161916] flex items-center justify-center">
                      {net.avatar ? (
                        <img src={net.avatar} alt={net.name} className="w-full h-full object-cover" />
                      ) : isYT ? (
                        <FaYoutube className="w-4 h-4 text-[#ff0000]" />
                      ) : isGH ? (
                        <FaGithub className="w-4 h-4 text-white" />
                      ) : (
                        <FaInstagram className="w-4 h-4 text-[#d946ef]" />
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-xs font-bold text-white truncate max-w-[120px]">
                        {net.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        <span className="text-[#c6f035] font-bold">{net.formattedFollowers || net.followers}</span> {net.label ? net.label.toLowerCase() : "followers"}
                      </div>
                    </div>
                  </div>

                  <a
                    href={actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold shrink-0 shadow-sm ${
                      isYT
                        ? "bg-[#ff0000] text-white"
                        : isIG
                        ? "bg-gradient-to-r from-[#d946ef] to-[#f43f5e] text-white"
                        : "bg-[#c6f035] text-[#0d0f0d]"
                    }`}
                  >
                    {isYT ? "Subscribe" : "Follow"}
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Links Cards */}
        <div className="canvas-links-list">
          {displayLinks.map((link) => {
            const Icon = getPlatformIcon(link.platform, link.url);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="canvas-link-item"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-[#161916] border border-white/5 flex items-center justify-center text-white flex-shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-bold text-white truncate max-w-[150px]">
                      {link.title}
                    </div>
                    <div className="text-[10px] text-[#788278] truncate max-w-[150px]">
                      {extractDomain(link.url)}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
              </a>
            );
          })}
        </div>

        {/* Footer Brand */}
        <div className="canvas-footer">
          <Sparkles className="w-3 h-3 text-[#c6f035]" />
          <span>Made with LinkHub</span>
        </div>
      </div>
    </div>
  );
}
