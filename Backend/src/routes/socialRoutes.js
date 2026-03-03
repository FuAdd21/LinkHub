import express from "express";
const router = express.Router();
import {
  fetchSocialProfileData,
  fetchSocialProfiles,
} from "../controllers/socialController.js";

router.post("/fetch", fetchSocialProfileData);
router.get("/", fetchSocialProfiles);

export default router;
