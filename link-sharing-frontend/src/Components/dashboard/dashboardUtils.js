import { API_BASE_URL } from "../../api/dashboardApi";
import { SOCIAL_PLATFORM_FIELDS } from "./dashboardConfig";

export function cx(...classNames) {
  return classNames.filter(Boolean).join(" ");
}

export function formatCompactNumber(value) {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: numericValue >= 1000 ? 1 : 0,
  }).format(numericValue);
}

export function getAvatarUrl(user) {
  if (!user?.avatar) {
    return null;
  }

  return user.avatar.startsWith("http")
    ? user.avatar
    : `${API_BASE_URL}${user.avatar}`;
}

export function getPublicProfileUrl(username) {
  return username ? `/${username}` : "#";
}

export function getVisibleLinks(links = []) {
  return links.filter((link) => link.is_visible !== 0);
}

export function getScheduledLinks(links = []) {
  return links.filter((link) => Boolean(link.scheduled_at));
}

export function getConnectedPlatforms(user) {
  return SOCIAL_PLATFORM_FIELDS.filter(({ key }) => Boolean(user?.[key]));
}

export function getPageCompletion(user, links = []) {
  const checks = [
    Boolean(user?.avatar),
    Boolean(user?.username),
    Boolean(user?.bio),
    getVisibleLinks(links).length > 0,
    getConnectedPlatforms(user).length > 0,
  ];

  const completedCount = checks.filter(Boolean).length;
  return Math.round((completedCount / checks.length) * 100);
}

export function buildSparklinePath(values = [], width = 260, height = 80) {
  if (!values.length) {
    return "";
  }

  const maxValue = Math.max(...values, 1);
  const step = values.length === 1 ? width : width / (values.length - 1);

  return values
    .map((point, index) => {
      const x = Number((index * step).toFixed(2));
      const y = Number((height - (point / maxValue) * height).toFixed(2));
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function formatChartDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) {
    return "Not scheduled";
  }

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
