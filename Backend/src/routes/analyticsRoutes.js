import express from "express";
const router = express.Router();
import {
  trackClick,
  trackProfileView,
  getAnalytics,
} from "../controllers/analyticsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

// Public: track a link click
router.post("/analytics/click/:linkId", trackClick);

// Public: track a profile page view
router.post("/analytics/view/:username", trackProfileView);

// Authenticated: get user analytics
router.get("/analytics", authenticateToken, getAnalytics);

export default router;
