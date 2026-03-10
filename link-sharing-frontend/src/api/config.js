/**
 * Shared API configuration — single source of truth for the base URL.
 * Import from here instead of re-declaring `API_BASE_URL` in every file.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

/**
 * Resolves a server-relative asset path (e.g. `/uploads/avatars/1.jpg`)
 * into a fully-qualified URL the browser can load.
 */
export function assetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
