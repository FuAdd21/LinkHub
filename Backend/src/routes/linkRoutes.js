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
import { validateRequest } from "../middleware/validate.js";
import {
  createLinkSchema,
  updateLinkSchema,
  reorderLinksSchema,
} from "../validators/linkSchemas.js";

// Reorder must come BEFORE the :linkId routes to avoid param catch
router.put(
  "/mylinks/order",
  authenticateToken,
  validateRequest({ body: reorderLinksSchema }),
  reorderLinks
);

router.get("/mylinks", authenticateToken, getLinks);
router.post(
  "/mylinks",
  authenticateToken,
  validateRequest({ body: createLinkSchema }),
  createLink
);
router.put(
  "/mylinks/:linkId",
  authenticateToken,
  validateRequest({ body: updateLinkSchema }),
  updateLink
);
router.put("/mylinks/:linkId/visibility", authenticateToken, toggleVisibility);
router.put("/mylinks/:linkId/display-mode", authenticateToken, updateDisplayMode);
router.delete("/mylinks/:linkId", authenticateToken, deleteLink);

export default router;
