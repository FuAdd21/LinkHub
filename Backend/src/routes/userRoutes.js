import express from "express";
const router = express.Router();
import {
  upload,
  updateAvatar,
  getMe,
  updateSocialProfiles,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

router.put("/avatar", authenticateToken, upload.single("avatar"), updateAvatar);
router.get("/me", authenticateToken, getMe);
router.put("/social-profiles", authenticateToken, updateSocialProfiles);

export default router;
