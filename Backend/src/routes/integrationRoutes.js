import express from "express";
const router = express.Router();
import {
  getIntegrations,
  toggleIntegration,
  connectIntegration,
  disconnectIntegration,
  syncIntegration,
  syncAllIntegrations,
} from "../controllers/integrationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

router.get("/", authenticateToken, getIntegrations);
router.post("/connect", authenticateToken, connectIntegration);
router.post("/disconnect", authenticateToken, disconnectIntegration);
router.delete("/:provider", authenticateToken, disconnectIntegration);
router.post("/toggle", authenticateToken, toggleIntegration);
router.post("/sync-all", authenticateToken, syncAllIntegrations);
router.post("/:provider/sync", authenticateToken, syncIntegration);
router.post("/sync", authenticateToken, syncIntegration);

export default router;
