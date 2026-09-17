import express from "express";
const router = express.Router();
import {
  upload,
  updateAvatar,
  removeAvatar,
  uploadBanner,
  updateBanner,
  getMe,
  updateProfileDetails,
  updateSocialProfiles,
  changePassword,
  changeEmail,
  deleteAccount,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

router.get("/me", authenticateToken, getMe);
router.put("/avatar", authenticateToken, upload.single("avatar"), updateAvatar);
router.delete("/avatar", authenticateToken, removeAvatar);
router.put(
  "/banner",
  authenticateToken,
  uploadBanner.single("banner"),
  updateBanner,
);
router.put("/profile-details", authenticateToken, updateProfileDetails);
router.put("/social-profiles", authenticateToken, updateSocialProfiles);
router.put("/password", authenticateToken, changePassword);
router.put("/email", authenticateToken, changeEmail);
router.delete("/account", authenticateToken, deleteAccount);

export default router;
