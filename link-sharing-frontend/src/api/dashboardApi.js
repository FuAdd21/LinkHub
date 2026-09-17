import { api, API_BASE_URL } from "./config.js";

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
    api.get("/api/users/me"),
    api.get("/api/mylinks"),
    api.get("/api/analytics"),
    api.get("/api/integrations"),
  ])
    .then(([userResponse, linksResponse, analyticsResponse, integrationsResponse]) =>
      writeDashboardSnapshot({
        user: userResponse.data,
        links: linksResponse.data,
        analytics: analyticsResponse.data,
        integrations: integrationsResponse.data,
      }),
    )
    .finally(() => {
      dashboardCache.pending = null;
    });

  dashboardCache.pending = request;

  return request;
}

export { API_BASE_URL };
