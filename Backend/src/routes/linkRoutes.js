import express from "express";
const router = express.Router();
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
} from "../controllers/linkController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

router.get("/mylinks", authenticateToken, getLinks);
router.post("/mylinks", authenticateToken, createLink);
router.put("/mylinks/:linkId", authenticateToken, updateLink);
router.delete("/mylinks/:linkId", authenticateToken, deleteLink);
router.put("/mylinks/order", authenticateToken, reorderLinks);

export default router;
