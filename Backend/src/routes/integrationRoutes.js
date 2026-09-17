import express from "express";
const router = express.Router();
import {
  getIntegrations,
  toggleIntegration,
  syncIntegration,
} from "../controllers/integrationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

router.get("/", authenticateToken, getIntegrations);
router.post("/toggle", authenticateToken, toggleIntegration);
router.post("/:provider/sync", authenticateToken, syncIntegration);

export default router;
