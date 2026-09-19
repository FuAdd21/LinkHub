import express from "express";
import {
  getCredentials,
  createCredential,
  updateCredential,
  deleteCredential,
} from "../controllers/credentialController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validation.js";
import {
  createCredentialSchema,
  updateCredentialSchema,
} from "../validators/projectSchemas.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getCredentials);
router.post("/", validateRequest(createCredentialSchema), createCredential);
router.patch("/:id", validateRequest(updateCredentialSchema), updateCredential);
router.delete("/:id", deleteCredential);

export default router;
