import { projectService } from "../services/projectService.js";

export const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projects = await projectService.getProjects(userId);
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const project = await projectService.createProject(userId, req.validated);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.id);
    const updated = await projectService.updateProject(userId, projectId, req.validated);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.id);
    await projectService.deleteProject(userId, projectId);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const reorderProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { order } = req.validated;
    await projectService.reorderProjects(userId, order);
    res.json({ success: true, message: "Projects reordered successfully" });
  } catch (err) {
    next(err);
  }
};
