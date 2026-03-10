import express from "express";
const router = express.Router();
import {
  register,
  login,
  getAllClients,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

router.post("/newclients", register);
router.post("/register", register);
router.post("/login", login);
router.get("/clients", authenticateToken, getAllClients);

export default router;
