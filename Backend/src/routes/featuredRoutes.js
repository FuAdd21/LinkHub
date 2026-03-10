import express from "express";
import { getFeaturedUsers } from "../controllers/featuredController.js";

const router = express.Router();

router.get("/users/featured", getFeaturedUsers);

export default router;

