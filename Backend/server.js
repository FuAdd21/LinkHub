import express, { json } from "express";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { initDatabase } from "./src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import authRoutes from "./src/routes/authRoutes.js";
import linkRoutes from "./src/routes/linkRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import featuredRoutes from "./src/routes/featuredRoutes.js";
import socialRoutes from "./src/routes/socialRoutes.js";

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(json());
app.use("/uploads", express.static(join(__dirname, "uploads")));

// Routes
app.use("/", authRoutes);
app.use("/api", linkRoutes);
app.use("/api/users", userRoutes);
app.use("/api", featuredRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/socials", socialRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();
