import { api } from "./config.js";
import { unwrapResponse } from "./responseHandler.js";

export const analyticsApi = {
  async getAnalytics(days = 30) {
    const res = await api.get(`/api/analytics?days=${days}`);
    return unwrapResponse(res);
  },

  async trackClick(linkId) {
    const res = await api.post(`/api/analytics/click/${linkId}`);
    return unwrapResponse(res);
  },

  async trackView(username) {
    const res = await api.post(`/api/analytics/view/${username}`);
    return unwrapResponse(res);
  },
};
