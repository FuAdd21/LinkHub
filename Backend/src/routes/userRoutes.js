import express from "express";
const router = express.Router();
import { upload, updateAvatar, getMe } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

router.put("/avatar", authenticateToken, upload.single("avatar"), updateAvatar);
router.get("/me", authenticateToken, getMe);

export default router;
