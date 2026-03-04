import express from "express";
const router = express.Router();
import {
  fetchSocialProfileData,
  fetchSocialProfiles,
} from "../controllers/socialController.js";
import { socialRateLimiter } from "../middleware/rateLimiter.js";

router.post("/fetch", fetchSocialProfileData);
router.get("/", socialRateLimiter, fetchSocialProfiles);

export default router;
