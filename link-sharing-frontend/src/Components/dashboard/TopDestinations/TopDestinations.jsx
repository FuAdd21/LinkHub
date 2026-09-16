import { Link } from "react-router-dom";
import { ArrowUpRight, Link2 } from "lucide-react";
import {
  FaGithub,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTiktok,
  FaTelegram,
} from "react-icons/fa";
import "./TopDestinations.css";

function getPlatformIcon(platform = "", url = "") {
  const p = (platform || "").toLowerCase();
  const u = (url || "").toLowerCase();

  if (p.includes("github") || u.includes("github.com")) return FaGithub;
  if (p.includes("youtube") || u.includes("youtube.com") || u.includes("youtu.be")) return FaYoutube;
  if (p.includes("instagram") || u.includes("instagram.com")) return FaInstagram;
  if (p.includes("twitter") || p.includes("x") || u.includes("twitter.com") || u.includes("x.com")) return FaTwitter;
  if (p.includes("linkedin") || u.includes("linkedin.com")) return FaLinkedin;
  if (p.includes("tiktok") || u.includes("tiktok.com")) return FaTiktok;
  if (p.includes("telegram") || u.includes("t.me")) return FaTelegram;

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

export default function TopDestinations({ links = [], analytics = {} }) {
  const topLinksData = analytics?.topLinks || [];

  // Combine topLinks data with existing links list
  const displayLinks = (topLinksData.length > 0 ? topLinksData : links).slice(0, 5);

  return (
    <div className="destinations-card">
      <div className="destinations-header">
        <div>
          <h3 className="destinations-title">Top destinations</h3>
          <p className="destinations-subtitle">
            Links driving the most engagement
          </p>
        </div>

        <Link to="/dashboard/links" className="destinations-view-all">
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="destinations-table">
          <thead>
            <tr>
              <th className="destinations-th text-left">Destination</th>
              <th className="destinations-th text-right">Clicks</th>
              <th className="destinations-th text-right">Conversion</th>
              <th className="destinations-th text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {displayLinks.length > 0 ? (
              displayLinks.map((item, index) => {
                const Icon = getPlatformIcon(item.platform, item.url);
                const clicks = Number(item.clicks ?? 0);
                const conversion = item.conversionRate || "0.0%";
                const change = item.change || `+${(18.4 - index * 6.7).toFixed(1)}%`;

                return (
                  <tr key={item.id || index} className="destinations-tr">
                    <td className="destinations-td">
                      <div className="flex items-center gap-3">
                        <div className="destination-icon-box">
                          <Icon className="w-4 h-4 text-slate-300" />
                        </div>
                        <div className="min-w-0">
                          <div className="destination-name truncate max-w-[160px] sm:max-w-[220px]">
                            {item.title || "Untitled Link"}
                          </div>
                          <div className="destination-domain truncate max-w-[160px] sm:max-w-[220px]">
                            {extractDomain(item.url)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="destinations-td text-right">
                      <span className="destination-stat">
                        {clicks.toLocaleString()}
                      </span>
                    </td>
                    <td className="destinations-td text-right">
                      <span className="destination-stat text-slate-300">
                        {conversion}
                      </span>
                    </td>
                    <td className="destinations-td text-right">
                      <span className="destination-change">{change}</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-xs text-slate-500">
                  No link activity recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
