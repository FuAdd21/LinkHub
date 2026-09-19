import { api } from "./config.js";
import { unwrapResponse } from "./responseHandler.js";
import { invalidateDashboardSnapshot } from "./dashboardApi.js";

export const integrationsApi = {
  async getIntegrations() {
    const res = await api.get("/api/integrations");
    return unwrapResponse(res);
  },

  async connectIntegration(provider, handle) {
    const res = await api.post("/api/integrations/connect", { provider, handle });
    invalidateDashboardSnapshot();
    return unwrapResponse(res);
  },

  async syncIntegration(provider) {
    const res = await api.post("/api/integrations/sync", { provider });
    invalidateDashboardSnapshot();
    return unwrapResponse(res);
  },

  async disconnectIntegration(provider) {
    const res = await api.delete(`/api/integrations/${provider}`);
    invalidateDashboardSnapshot();
    return unwrapResponse(res);
  },

  async previewIntegration(provider, handle) {
    const res = await api.post("/api/integrations/preview", { provider, handle });
    return unwrapResponse(res);
  },

  async syncAll() {
    const res = await api.post("/api/integrations/sync-all");
    invalidateDashboardSnapshot();
    return unwrapResponse(res);
  },
};
