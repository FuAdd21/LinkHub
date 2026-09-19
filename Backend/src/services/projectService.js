import { projectRepository } from "../repositories/projectRepository.js";
import { AppError } from "../errors/AppError.js";

const MAX_PROJECTS = 25;

export const projectService = {
  async getProjects(userId) {
    return projectRepository.findByUserId(userId);
  },

  async createProject(userId, projectData) {
    const count = await projectRepository.countByUserId(userId);
    if (count >= MAX_PROJECTS) {
      throw AppError.badRequest(
        `Project limit reached. You can showcase up to ${MAX_PROJECTS} projects.`
      );
    }
    return projectRepository.create(userId, projectData);
  },

  async updateProject(userId, projectId, updateData) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw AppError.notFound("Project not found");
    }
    if (project.user_id !== userId) {
      throw AppError.forbidden("You do not have permission to modify this project");
    }
    return projectRepository.update(projectId, updateData);
  },

  async deleteProject(userId, projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw AppError.notFound("Project not found");
    }
    if (project.user_id !== userId) {
      throw AppError.forbidden("You do not have permission to delete this project");
    }
    return projectRepository.delete(projectId);
  },

  async reorderProjects(userId, order) {
    const userProjects = await projectRepository.findByUserId(userId);
    const validIds = new Set(userProjects.map((p) => p.id));

    for (const id of order) {
      if (!validIds.has(id)) {
        throw AppError.forbidden("Invalid project ID in reorder list");
      }
    }
    return projectRepository.reorder(userId, order);
  },
};
