import { api } from "./config.js";
import { unwrapResponse } from "./responseHandler.js";
import { invalidateDashboardSnapshot } from "./dashboardApi.js";

export const linksApi = {
  async getLinks() {
    const res = await api.get("/api/mylinks");
    return unwrapResponse(res);
  },

  async createLink(linkData) {
    const res = await api.post("/api/mylinks", linkData);
    invalidateDashboardSnapshot();
    return unwrapResponse(res);
  },

  async updateLink(linkId, linkData) {
    const res = await api.put(`/api/mylinks/${linkId}`, linkData);
    invalidateDashboardSnapshot();
    return unwrapResponse(res);
  },

  async deleteLink(linkId) {
    const res = await api.delete(`/api/mylinks/${linkId}`);
    invalidateDashboardSnapshot();
    return unwrapResponse(res);
  },

  async reorderLinks(linkIds) {
    const res = await api.put("/api/mylinks/order", { linkIds });
    invalidateDashboardSnapshot();
    return unwrapResponse(res);
  },

  async toggleVisibility(linkId, is_visible) {
    const res = await api.put(`/api/mylinks/${linkId}/visibility`, { is_visible });
    invalidateDashboardSnapshot();
    return unwrapResponse(res);
  },

  async updateDisplayMode(linkId, display_mode) {
    const res = await api.put(`/api/mylinks/${linkId}/display-mode`, { display_mode });
    invalidateDashboardSnapshot();
    return unwrapResponse(res);
  },
};
