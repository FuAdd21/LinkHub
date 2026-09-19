import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "../controllers/projectController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validation.js";
import {
  createProjectSchema,
  updateProjectSchema,
  reorderProjectsSchema,
} from "../validators/projectSchemas.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getProjects);
router.post("/", validateRequest(createProjectSchema), createProject);
router.patch("/reorder", validateRequest(reorderProjectsSchema), reorderProjects);
router.patch("/:id", validateRequest(updateProjectSchema), updateProject);
router.delete("/:id", deleteProject);

export default router;
