import { api } from "./config.js";
import { unwrapResponse } from "./responseHandler.js";

export const authApi = {
  async register(userData) {
    const res = await api.post("/register", userData);
    return unwrapResponse(res);
  },

  async login(credentials) {
    const res = await api.post("/login", credentials);
    return unwrapResponse(res);
  },

  async logout() {
    const res = await api.post("/logout");
    return unwrapResponse(res);
  },

  async getMe() {
    const res = await api.get("/api/users/me");
    return unwrapResponse(res);
  },

  async forgotPassword(email) {
    const res = await api.post("/forgot-password", { email });
    return unwrapResponse(res);
  },

  async resetPassword({ token, newPassword }) {
    const res = await api.post("/reset-password", { token, newPassword });
    return unwrapResponse(res);
  },

  async changePassword({ currentPassword, newPassword }) {
    const res = await api.put("/api/users/password", { currentPassword, newPassword });
    return unwrapResponse(res);
  },
};
