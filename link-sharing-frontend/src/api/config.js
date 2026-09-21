import axios from "axios";

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
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Shared Axios instance with auth header, cookies, CSRF, and 401/403 interceptor.
 * Import this instead of raw axios for API calls.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Attach CSRF token on state-modifying requests
api.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();
  if (["post", "put", "delete", "patch"].includes(method)) {
    const csrfToken = getCookie("csrf_token");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return config;
});

// Global 401/403 interceptor — auto-logout on expired/invalid token
let logoutHandler = null;

export function setLogoutHandler(handler) {
  logoutHandler = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const code =
        error.response?.data?.error?.code || error.response?.data?.code;
      if (
        code === "TOKEN_EXPIRED" ||
        code === "TOKEN_INVALID" ||
        code === "NO_TOKEN" ||
        code === "SESSION_REVOKED"
      ) {
        if (logoutHandler) {
          logoutHandler();
        }
      }
    }
    return Promise.reject(error);
  }
);
