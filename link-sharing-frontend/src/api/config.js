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
  if (!path) return "";
  if (path.startsWith("http")) return path;
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
});

// Attach token and CSRF token to requests
api.interceptors.request.use((config) => {
  // 1. Bearer token fallback if present
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. Attach CSRF token on state-modifying requests
  const method = (config.method || "get").toLowerCase();
  if (["post", "put", "delete", "patch"].includes(method)) {
    const csrfToken = getCookie("csrf_token") || localStorage.getItem("csrf_token");
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
      const code = error.response?.data?.code;
      if (code === "TOKEN_EXPIRED" || code === "TOKEN_INVALID" || code === "NO_TOKEN") {
        if (logoutHandler) {
          logoutHandler();
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Checks if a JWT token is expired by decoding its payload.
 * Does NOT verify signature — only checks the `exp` claim.
 */
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
