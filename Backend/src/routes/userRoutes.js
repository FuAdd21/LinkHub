import express from "express";
const router = express.Router();
import {
  upload,
  updateAvatar,
  uploadBanner,
  updateBanner,
  getMe,
  updateSocialProfiles,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

router.put("/avatar", authenticateToken, upload.single("avatar"), updateAvatar);
router.post(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  updateAvatar,
);
router.put(
  "/banner",
  authenticateToken,
  uploadBanner.single("banner"),
  updateBanner,
);
router.post(
  "/banner",
  authenticateToken,
  uploadBanner.single("banner"),
  updateBanner,
);
router.get("/me", authenticateToken, getMe);
router.put("/social-profiles", authenticateToken, updateSocialProfiles);

export default router;
