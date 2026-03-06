import express from "express";
const router = express.Router();
import {
  getPublicProfile,
  setupUsername,
  updateProfile,
  checkUsername,
} from "../controllers/profileController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

// Public routes
router.get("/profile/check/:username", checkUsername);
router.get("/profile/:username", getPublicProfile);

// Authenticated routes
router.put("/profile/username", authenticateToken, setupUsername);
router.put("/profile", authenticateToken, updateProfile);

export default router;
