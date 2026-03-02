import express from "express";
const router = express.Router();
import { getFeaturedUsers } from "../controllers/featuredController.js";

router.get("/featured-users", getFeaturedUsers);

export default router;
