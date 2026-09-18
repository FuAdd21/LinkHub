import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Link2,
  Sparkles,
  Share2,
  LayoutDashboard,
  AlertCircle,
  ExternalLink,
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
import { api, API_BASE_URL, assetUrl } from "../api/config.js";
import "../Components/dashboard/LiveCanvasPreview/LiveCanvasPreview.css";

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
    return parsed.hostname.replace("www.", "") + (parsed.pathname !== "/" ? parsed.pathname.slice(0, 18) : "");
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
      const res = await api.get(`/api/profile/${username}`);
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
      api.post(`/api/analytics/view/${username}`).catch(() => {});
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
      } catch {}
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
      api.post(`/api/analytics/click/${linkId}`).catch(() => {});
    } catch {}
  };

  // ──── Loading State ────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070705] preview-grid flex items-center justify-center p-4">
        <div className="canvas-phone-frame preview-grid w-full max-w-[390px] p-8 border border-white/10 rounded-[32px] bg-[#0B0A07] flex flex-col items-center gap-5 animate-pulse">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10" />
          <div className="w-36 h-4 rounded-full bg-white/5" />
          <div className="w-24 h-3 rounded-full bg-white/5" />
          <div className="w-56 h-3 rounded-full bg-white/5" />
          <div className="w-full mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-14 rounded-xl bg-white/5 border border-white/10"
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
      <div className="min-h-screen bg-[#070705] preview-grid flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full bg-[#0B0A07] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-4">
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

  // Integrations list from API
  const connectedIntegrations = Array.isArray(userData.integrations) ? userData.integrations : [];

  // Connected social pills row
  const socialsMap = new Map();
  connectedIntegrations.forEach((item) => {
    if (item.profileUrl) {
      socialsMap.set(item.provider.toLowerCase(), item.profileUrl);
    } else if (item.handle) {
      socialsMap.set(item.provider.toLowerCase(), getSocialUrl(item.provider, item.handle));
    }
  });

  if (userData.socials) {
    Object.entries(userData.socials).forEach(([platform, val]) => {
      if (val && !socialsMap.has(platform.toLowerCase())) {
        socialsMap.set(platform.toLowerCase(), getSocialUrl(platform, val));
      }
    });
  }

  // Include any links explicitly configured with display_mode === 'header_pill'
  visibleLinks.forEach((l) => {
    if (l.display_mode === "header_pill") {
      const pKey = (l.platform || extractDomain(l.url) || "link").toLowerCase();
      socialsMap.set(pKey, l.url);
    }
  });

  const activeSocials = Array.from(socialsMap.entries());

  // Destination links to render in canvas-links-list:
  // ONLY links with display_mode === 'link' (or unset/null)
  // Guarantees links in header_pill or rich_card mode are never duplicated in the destination list!
  const destinationLinks = visibleLinks.filter((l) => (l.display_mode || "link") === "link");

  return (
    <div className="min-h-screen bg-[#070705] preview-grid flex flex-col items-center justify-center p-4 sm:p-8 relative selection:bg-[#c6f035] selection:text-[#0d0f0d] overflow-x-hidden">
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

      {/* ─── Center Phone Canvas Container (Matches screenshot perfectly) ─── */}
      <div className="canvas-phone-frame preview-grid w-full max-w-[390px] sm:max-w-[420px] rounded-[32px] sm:rounded-[36px] border border-white/10 bg-[#0B0A07] p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(198,240,53,0.06)] flex flex-col items-center relative z-10">
        {/* Avatar with distinctive lime accent ring */}
        <div
          className="canvas-avatar-circle w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 p-0.5 flex items-center justify-center shrink-0 overflow-hidden mb-3 shadow-[0_0_24px_rgba(198,240,53,0.25)] transition-transform hover:scale-105"
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
              className="w-full h-full rounded-full bg-[#1a1914] flex items-center justify-center font-black text-2xl text-[#c6f035]"
              style={{ color: accentColor }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* User Identity: Name + Verified Check */}
        <div className="canvas-name text-lg sm:text-xl font-extrabold text-white flex items-center gap-1.5">
          <span>{name}</span>
          {userData.show_verified_badge && (
            <CheckCircle2
              className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
              style={{ fill: accentColor, color: "#0d0f0d" }}
            />
          )}
        </div>

        {/* Handle */}
        <div
          className="canvas-handle text-xs sm:text-sm font-mono font-bold mt-0.5"
          style={{ color: accentColor }}
        >
          @{username}
        </div>

        {/* Bio */}
        {bio && (
          <p className="canvas-bio text-xs text-[#8c948c] text-center max-w-[260px] mt-1.5 leading-relaxed">
            {bio}
          </p>
        )}

        {/* Live Audience Proof Pill */}
        {totalAudience > 0 && (
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wide mt-2.5"
            style={{
              backgroundColor: `${accentColor}15`,
              border: `1px solid ${accentColor}35`,
              color: accentColor,
            }}
          >
            <span>{totalAudienceFormatted} combined audience</span>
          </div>
        )}

        {/* Social Icons Pill Row */}
        {activeSocials.length > 0 && userData.show_social_row !== false && (
          <div className="canvas-socials-row flex items-center justify-center gap-2 my-4">
            {activeSocials.map(([platform, url]) => {
              const IconComponent = getPlatformIcon(platform, url);
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  className="canvas-social-btn w-9 h-9 rounded-xl bg-[#181711] border border-white/10 hover:border-white/25 flex items-center justify-center text-[#c5cbc5] hover:text-white hover:-translate-y-0.5 transition-all shadow-sm"
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        )}

        {/* ─── Rich Connected Social Content & Channel Cards ─── */}
        {connectedIntegrations.length > 0 && (
          <div className="w-full space-y-2.5 mb-2.5">
            {connectedIntegrations.map((net) => {
              const p = net.provider.toLowerCase();
              const isYouTube = p === "youtube";
              const isGitHub = p === "github";
              const isInstagram = p === "instagram";
              const isTikTok = p === "tiktok";

              // Direct subscribe URL for YouTube: adds sub_confirmation=1 to trigger subscription modal
              const actionUrl = isYouTube
                ? (net.profileUrl ? (net.profileUrl.includes("?") ? `${net.profileUrl}&sub_confirmation=1` : `${net.profileUrl}?sub_confirmation=1`) : `https://youtube.com/${net.handle}?sub_confirmation=1`)
                : net.profileUrl;

              return (
                <div
                  key={net.provider}
                  className="w-full p-3 rounded-xl bg-[#13120D]/90 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shrink-0 bg-[#161916] flex items-center justify-center">
                      {net.avatar ? (
                        <img
                          src={net.avatar}
                          alt={net.name}
                          className="w-full h-full object-cover"
                        />
                      ) : isYouTube ? (
                        <FaYoutube className="w-5 h-5 text-[#ff0000]" />
                      ) : isGitHub ? (
                        <FaGithub className="w-5 h-5 text-white" />
                      ) : isInstagram ? (
                        <FaInstagram className="w-5 h-5 text-[#d946ef]" />
                      ) : isTikTok ? (
                        <FaTiktok className="w-5 h-5 text-[#00f2ff]" />
                      ) : (
                        <Link2 className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0 text-left">
                      <div className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
                        <span className="truncate">{net.name}</span>
                        {isYouTube && <FaYoutube className="w-3.5 h-3.5 text-[#ff0000] shrink-0" />}
                        {isGitHub && <FaGithub className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                        {isInstagram && <FaInstagram className="w-3.5 h-3.5 text-[#d946ef] shrink-0" />}
                        {isTikTok && <FaTiktok className="w-3.5 h-3.5 text-[#00f2ff] shrink-0" />}
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        <span className="text-[#c6f035] font-bold">
                          {net.formattedFollowers || net.followers}
                        </span>{" "}
                        {net.label ? net.label.toLowerCase() : "followers"}
                        {isYouTube && net.videos > 0 && (
                          <span className="text-slate-500"> · {net.videos} videos</span>
                        )}
                        {isGitHub && net.repos > 0 && (
                          <span className="text-slate-500"> · {net.repos} repos</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Direct Subscribe / Follow Action Button */}
                  <a
                    href={actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 transition-all active:scale-95 shadow-sm flex items-center gap-1 ${
                      isYouTube
                        ? "bg-[#ff0000] hover:bg-[#d90000] text-white"
                        : isInstagram
                        ? "bg-gradient-to-r from-[#d946ef] to-[#f43f5e] hover:opacity-90 text-white"
                        : isTikTok
                        ? "bg-[#00f2ff] hover:brightness-110 text-[#0d0f0d]"
                        : "bg-[#c6f035] hover:brightness-110 text-[#0d0f0d]"
                    }`}
                  >
                    <span>{isYouTube ? "Subscribe" : "Follow"}</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Destination Links List (Clean Instrumented Identity style) ─── */}
        <div className="canvas-links-list w-full space-y-2.5">
          {destinationLinks.map((link) => {
            const Icon = getPlatformIcon(link.platform, link.url);
            return (
              <a
                key={link.id}
                href={link.id ? `${API_BASE_URL}/r/${link.id}` : link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className="canvas-link-item group w-full p-3 sm:p-3.5 rounded-xl bg-[#13120D]/90 hover:bg-[#161510] border border-white/10 hover:border-[#c6f035]/60 backdrop-blur-md flex items-center justify-between transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#161916] border border-white/5 flex items-center justify-center text-white shrink-0 group-hover:border-[#c6f035]/30 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[180px] sm:max-w-[220px]">
                      {link.title}
                    </div>
                    <div className="text-[10px] font-mono text-[#788278] truncate max-w-[180px] sm:max-w-[220px]">
                      {extractDomain(link.url)}
                    </div>
                  </div>
                </div>

                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#c6f035] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
              </a>
            );
          })}
        </div>

        {/* Footer Brand inside the canvas (Matches screenshot) */}
        <div className="canvas-footer flex items-center gap-1.5 mt-6 text-[10px] font-mono font-bold tracking-[0.2em] text-[#606760] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#c6f035]" />
          <span>MADE WITH LINKHUB</span>
        </div>
      </div>

      {/* Share Profile & QR Controls (Placed neatly outside the phone frame) */}
      <div className="flex items-center justify-center gap-3 pt-6 relative z-10">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13120D] hover:bg-[#181711] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-mono font-bold transition-all shadow-md"
        >
          <Share2 className="w-3.5 h-3.5 text-[#c6f035]" />
          <span>Share profile</span>
        </button>

        <QRCodeGenerator username={username} />
      </div>
    </div>
  );
}
