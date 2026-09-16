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

  return Link2;
}

function extractDomain(url = "") {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace("www.", "") + parsed.pathname.slice(0, 15);
  } catch {
    return url || "linkhub.io";
  }
}

export default function LiveCanvasPreview({ user, links = [] }) {
  const username = user?.username || "maya";
  const name = user?.name || user?.username || "Maya K.";
  const bio = user?.bio || "Developer, designer, and curious builder sharing the work in progress.";
  const avatarUrl = getAvatarUrl(user);

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
