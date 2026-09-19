import express from "express";
const router = express.Router();
import {
  trackClick,
  trackProfileView,
  getAnalytics,
} from "../controllers/analyticsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  clickLimiter,
  viewLimiter,
  analyticsQueryLimiter,
} from "../middleware/rateLimiter.js";

// Public: track a link click (rate limited to 60/min)
router.post("/analytics/click/:linkId", clickLimiter, trackClick);

// Public: track a profile page view (rate limited to 30/min)
router.post("/analytics/view/:username", viewLimiter, trackProfileView);

// Authenticated: get user analytics (rate limited to 30/min)
router.get("/analytics", authenticateToken, analyticsQueryLimiter, getAnalytics);

export default router;
