import express from "express";
const router = express.Router();
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  toggleVisibility,
} from "../controllers/linkController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

// Reorder must come BEFORE the :linkId routes to avoid param catch
router.put("/mylinks/order", authenticateToken, reorderLinks);

router.get("/mylinks", authenticateToken, getLinks);
router.post("/mylinks", authenticateToken, createLink);
router.put("/mylinks/:linkId", authenticateToken, updateLink);
router.put("/mylinks/:linkId/visibility", authenticateToken, toggleVisibility);
router.delete("/mylinks/:linkId", authenticateToken, deleteLink);

export default router;
