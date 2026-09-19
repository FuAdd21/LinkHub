import { api } from "./config.js";
import { unwrapResponse } from "./responseHandler.js";

export const projectsApi = {
  async getProjects() {
    const res = await api.get("/api/projects");
    return unwrapResponse(res);
  },

  async createProject(projectData) {
    const res = await api.post("/api/projects", projectData);
    return unwrapResponse(res);
  },

  async updateProject(id, updateData) {
    const res = await api.patch(`/api/projects/${id}`, updateData);
    return unwrapResponse(res);
  },

  async deleteProject(id) {
    const res = await api.delete(`/api/projects/${id}`);
    return unwrapResponse(res);
  },

  async reorderProjects(order) {
    const res = await api.patch("/api/projects/reorder", { order });
    return unwrapResponse(res);
  },

  async getCredentials() {
    const res = await api.get("/api/credentials");
    return unwrapResponse(res);
  },

  async createCredential(data) {
    const res = await api.post("/api/credentials", data);
    return unwrapResponse(res);
  },

  async updateCredential(id, data) {
    const res = await api.patch(`/api/credentials/${id}`, data);
    return unwrapResponse(res);
  },

  async deleteCredential(id) {
    const res = await api.delete(`/api/credentials/${id}`);
    return unwrapResponse(res);
  },
};
