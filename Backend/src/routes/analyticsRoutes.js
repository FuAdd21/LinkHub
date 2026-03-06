import express from "express";
const router = express.Router();
import { trackClick, getAnalytics } from "../controllers/analyticsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

// Public: track a click
router.post("/analytics/click/:linkId", trackClick);

// Authenticated: get user analytics
router.get("/analytics", authenticateToken, getAnalytics);

export default router;
