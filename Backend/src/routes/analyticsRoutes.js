import express from "express";
const router = express.Router();
import {
  trackClick,
  trackProfileView,
  getAnalytics,
} from "../controllers/analyticsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { analyticsRateLimiter } from "../middleware/rateLimiter.js";

// Public: track a link click (rate limited)
router.post("/analytics/click/:linkId", analyticsRateLimiter, trackClick);

// Public: track a profile page view (rate limited)
router.post("/analytics/view/:username", analyticsRateLimiter, trackProfileView);

// Authenticated: get user analytics
router.get("/analytics", authenticateToken, getAnalytics);

export default router;
