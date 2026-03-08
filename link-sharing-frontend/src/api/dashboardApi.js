import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const DASHBOARD_CACHE_TTL = 30000;

const dashboardCache = {
  data: null,
  expiresAt: 0,
  pending: null,
};

export function getDashboardAuthConfig() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function readDashboardSnapshot() {
  const hasFreshData =
    dashboardCache.data && Date.now() < dashboardCache.expiresAt;

  return hasFreshData ? dashboardCache.data : null;
}

export function writeDashboardSnapshot(nextSnapshot) {
  dashboardCache.data = nextSnapshot;
  dashboardCache.expiresAt = Date.now() + DASHBOARD_CACHE_TTL;
  return nextSnapshot;
}

export function invalidateDashboardSnapshot() {
  dashboardCache.data = null;
  dashboardCache.expiresAt = 0;
}

export async function fetchDashboardSnapshot({ force = false } = {}) {
  if (!force) {
    const cached = readDashboardSnapshot();
    if (cached) {
      return cached;
    }

    if (dashboardCache.pending) {
      return dashboardCache.pending;
    }
  }

  const request = Promise.all([
    axios.get(`${API_BASE_URL}/api/users/me`, getDashboardAuthConfig()),
    axios.get(`${API_BASE_URL}/api/mylinks`, getDashboardAuthConfig()),
    axios.get(`${API_BASE_URL}/api/analytics`, getDashboardAuthConfig()),
  ])
    .then(([userResponse, linksResponse, analyticsResponse]) =>
      writeDashboardSnapshot({
        user: userResponse.data,
        links: linksResponse.data,
        analytics: analyticsResponse.data,
      }),
    )
    .finally(() => {
      dashboardCache.pending = null;
    });

  dashboardCache.pending = request;

  return request;
}

export { API_BASE_URL };
