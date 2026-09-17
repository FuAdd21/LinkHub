import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Link2,
  Sparkles,
  Share2,
  Copy,
  ExternalLink,
  Edit,
  LayoutDashboard,
  AlertCircle,
} from "lucide-react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaTelegram,
  FaSpotify,
} from "react-icons/fa";
import QRCodeGenerator from "../Components/QRCodeGenerator";
import { API_BASE_URL, assetUrl } from "../api/config.js";

function getPlatformIcon(platform = "", url = "") {
  const p = (platform || "").toLowerCase();
  const u = (url || "").toLowerCase();

  if (p.includes("github") || u.includes("github.com")) return FaGithub;
  if (p.includes("youtube") || u.includes("youtube.com") || u.includes("youtu.be")) return FaYoutube;
  if (p.includes("instagram") || u.includes("instagram.com")) return FaInstagram;
  if (p.includes("tiktok") || u.includes("tiktok.com")) return FaTiktok;
  if (p.includes("twitter") || p.includes("x") || u.includes("twitter.com") || u.includes("x.com")) return FaTwitter;
  if (p.includes("linkedin") || u.includes("linkedin.com")) return FaLinkedin;
  if (p.includes("telegram") || u.includes("t.me")) return FaTelegram;
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

function getSocialUrl(platform, value) {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const clean = value.replace(/^@/, "").trim();
  switch (platform.toLowerCase()) {
    case "youtube":
      return value.startsWith("@") ? `https://youtube.com/${value}` : `https://youtube.com/@${clean}`;
    case "github":
      return `https://github.com/${clean}`;
    case "instagram":
      return `https://instagram.com/${clean}`;
    case "tiktok":
      return `https://tiktok.com/@${clean}`;
    case "twitter":
    case "x":
      return `https://twitter.com/${clean}`;
    case "linkedin":
      return `https://linkedin.com/in/${clean}`;
    case "telegram":
      return `https://t.me/${clean}`;
    case "spotify":
      return `https://open.spotify.com/artist/${clean}`;
    default:
      return `https://${clean}`;
  }
}

export default function PublicProfile() {
  const { username } = useParams();
  const { user: authUser, isAuthenticated } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = isAuthenticated && authUser?.username === username;

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/api/profile/${username}`);
      setUserData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "User profile not found");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [fetchProfile, username]);

  // Track profile view analytics (if not the owner)
  useEffect(() => {
    if (userData && username && !isOwner) {
      axios.post(`${API_BASE_URL}/api/analytics/view/${username}`).catch(() => {});
    }
  }, [userData, username, isOwner]);

  // Dynamic document title & meta description
  useEffect(() => {
    if (userData) {
      const displayName = userData.name || `@${username}`;
      const bioText = userData.bio || `Explore ${displayName}'s curated links on LinkHub.`;
      document.title = `${displayName} (@${username}) | LinkHub`;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = bioText;
    }
  }, [userData, username]);

  const handleShare = async () => {
    const profileUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userData?.name || username} on LinkHub`,
          text: userData?.bio || `Check out ${userData?.name || username}'s profile`,
          url: profileUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if share was cancelled or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleLinkClick = (linkId) => {
    if (!linkId) return;
    try {
      axios.post(`${API_BASE_URL}/api/analytics/click/${linkId}`).catch(() => {});
    } catch {}
  };

  // ──── Loading State ────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0A07] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-5 w-full max-w-[420px]">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 animate-pulse" />
          <div className="w-36 h-4 rounded-full bg-white/5 animate-pulse" />
          <div className="w-24 h-3 rounded-full bg-white/5 animate-pulse" />
          <div className="w-56 h-3 rounded-full bg-white/5 animate-pulse" />
          <div className="w-full mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-14 rounded-xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ──── Error State ────
  if (error || !userData) {
    return (
      <div className="min-h-screen bg-[#0B0A07] flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full bg-[#13120D] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Profile Not Found</h2>
          <p className="text-xs text-slate-400">
            The profile at <span className="text-[#c6f035] font-mono font-bold">@{username}</span> does not exist or has not been claimed.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#c6f035] text-[#0d0f0d] font-bold text-xs font-mono rounded-xl hover:brightness-110 transition-all"
            >
              Go to LinkHub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const name = userData.name || userData.username;
  const bio = userData.bio || "";
  const avatarUrl = userData.avatar ? assetUrl(userData.avatar) : null;
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const accentColor = userData.accent_color || "#c6f035";
  const visibleLinks = (userData.links || []).filter((l) => l.is_visible !== 0);
  const totalAudience = userData.totalAudience || 0;
  const totalAudienceFormatted = userData.totalAudienceFormatted || "0";

  // Build active socials list from user.socials & integrations
  const socialsMap = new Map();

  // First check connected integrations
  if (Array.isArray(userData.integrations)) {
    userData.integrations.forEach((item) => {
      if (item.profileUrl) {
        socialsMap.set(item.provider.toLowerCase(), item.profileUrl);
      } else if (item.handle) {
        socialsMap.set(
          item.provider.toLowerCase(),
          getSocialUrl(item.provider, item.handle)
        );
      }
    });
  }

  // Next check profile socials object
  if (userData.socials) {
    Object.entries(userData.socials).forEach(([platform, val]) => {
      if (val && !socialsMap.has(platform.toLowerCase())) {
        socialsMap.set(platform.toLowerCase(), getSocialUrl(platform, val));
      }
    });
  }

  const activeSocials = Array.from(socialsMap.entries());

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-4 py-10 sm:py-16 relative overflow-x-hidden selection:bg-[#c6f035] selection:text-[#0d0f0d]"
      style={{
        backgroundColor: "#0B0A07",
        backgroundImage: "radial-gradient(circle at top, rgba(198, 240, 53, 0.03), transparent 70%)",
      }}
    >
      {/* Top Floating Owner Action Bar */}
      {isOwner && (
        <div className="fixed top-4 right-4 z-40">
          <Link
            to="/dashboard/links"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#13120D]/90 hover:bg-[#181711] backdrop-blur-md border border-white/10 hover:border-[#c6f035]/50 text-white text-xs font-mono font-bold transition-all shadow-xl"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#c6f035]" />
            <span className="hidden sm:inline">Edit in Dashboard</span>
            <span className="sm:hidden">Edit</span>
          </Link>
        </div>
      )}

      {/* Main Profile Canvas Card (matches LiveCanvasPreview exactly) */}
      <div className="w-full max-w-[440px] flex flex-col items-center text-center space-y-4 relative z-10">
        {/* Avatar with distinctive accent ring */}
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-[0_8px_30px_rgba(198,240,53,0.15)] transition-transform hover:scale-105"
          style={{ borderColor: accentColor }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full rounded-full bg-[#1a1914] flex items-center justify-center font-black text-xl sm:text-2xl"
              style={{ color: accentColor }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Identity: Name + Verified Check */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {name}
          </h1>
          {userData.show_verified_badge && (
            <CheckCircle2
              className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
              style={{ fill: accentColor, color: "#0d0f0d" }}
            />
          )}
        </div>

        {/* Handle */}
        <div
          className="text-xs sm:text-sm font-mono font-bold -mt-2"
          style={{ color: accentColor }}
        >
          @{username}
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-xs sm:text-sm text-[#8c948c] max-w-[340px] leading-relaxed pt-0.5">
            {bio}
          </p>
        )}

        {/* Combined Audience Proof Pill */}
        {totalAudience > 0 && (
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wide"
            style={{
              backgroundColor: `${accentColor}15`,
              border: `1px solid ${accentColor}35`,
              color: accentColor,
            }}
          >
            <span>{totalAudienceFormatted} combined audience</span>
          </div>
        )}

        {/* Connected Socials Row */}
        {activeSocials.length > 0 && userData.show_social_row !== false && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {activeSocials.map(([platform, url]) => {
              const IconComponent = getPlatformIcon(platform, url);
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  className="w-9 h-9 rounded-xl bg-[#181711] border border-white/10 hover:border-white/25 flex items-center justify-center text-[#c5cbc5] hover:text-white hover:-translate-y-0.5 transition-all shadow-sm"
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        )}

        {/* Destination Links Cards */}
        <div className="w-full space-y-3 pt-3">
          {visibleLinks.length === 0 ? (
            <div className="py-8 px-4 rounded-xl bg-[#13120D] border border-white/5 text-center text-xs text-slate-500 font-mono">
              No links published yet.
            </div>
          ) : (
            visibleLinks.map((link) => {
              const Icon = getPlatformIcon(link.platform, link.url);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link.id)}
                  className="group w-full p-3.5 sm:p-4 rounded-xl bg-[#13120D]/80 hover:bg-[#161510] border border-white/5 hover:border-[#c6f035]/60 backdrop-blur-md flex items-center justify-between transition-all hover:-translate-y-0.5 shadow-md"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1a1914] border border-white/5 flex items-center justify-center text-white shrink-0 group-hover:border-[#c6f035]/30 transition-colors">
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-bold text-white truncate max-w-[220px] sm:max-w-[280px]">
                        {link.title}
                      </div>
                      <div className="text-[11px] font-mono text-[#788278] truncate max-w-[220px] sm:max-w-[280px]">
                        {extractDomain(link.url)}
                      </div>
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#c6f035] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                </a>
              );
            })
          )}
        </div>

        {/* Share Profile & QR Section */}
        <div className="w-full flex items-center justify-center gap-3 pt-6 pb-2 border-t border-white/5">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161510] hover:bg-[#1a1914] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-mono font-bold transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-[#c6f035]" />
            <span>Share profile</span>
          </button>

          <QRCodeGenerator username={username} />
        </div>
      </div>

      {/* Footer Branding Watermark */}
      <div className="pt-10 pb-2 text-center relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#606760] hover:text-slate-300 transition-colors"
        >
          <Sparkles className="w-3 h-3 text-[#c6f035]" />
          <span>Made with LinkHub</span>
        </Link>
      </div>
    </div>
  );
}
