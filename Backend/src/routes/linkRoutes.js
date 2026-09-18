import express from "express";
const router = express.Router();
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  toggleVisibility,
  updateDisplayMode,
} from "../controllers/linkController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validator.js";

const linkRules = {
  title: { required: true, minLength: 1, maxLength: 255, label: "Title" },
  url: { required: true, type: "url", label: "URL" },
};

// Reorder must come BEFORE the :linkId routes to avoid param catch
router.put("/mylinks/order", authenticateToken, reorderLinks);

router.get("/mylinks", authenticateToken, getLinks);
router.post("/mylinks", authenticateToken, validate(linkRules), createLink);
router.put("/mylinks/:linkId", authenticateToken, validate(linkRules), updateLink);
router.put("/mylinks/:linkId/visibility", authenticateToken, toggleVisibility);
router.put("/mylinks/:linkId/display-mode", authenticateToken, updateDisplayMode);
router.delete("/mylinks/:linkId", authenticateToken, deleteLink);

export default router;
