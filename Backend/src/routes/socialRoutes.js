import express from "express";
const router = express.Router();
import {
  fetchSocialProfileData,
  fetchSocialProfiles,
} from "../controllers/socialController.js";
import { socialRateLimiter } from "../middleware/rateLimiter.js";

router.post("/fetch", socialRateLimiter, fetchSocialProfileData);
router.get("/", fetchSocialProfiles);

export default router;
