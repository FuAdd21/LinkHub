import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { initDatabase } from "./src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import authRoutes from "./src/routes/authRoutes.js";
import linkRoutes from "./src/routes/linkRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import featuredRoutes from "./src/routes/featuredRoutes.js";
import socialRoutes from "./src/routes/socialRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import integrationRoutes from "./src/routes/integrationRoutes.js";

const app = express();
const PORT = process.env.PORT || 3002;

app.set("trust proxy", 1);

// Security HTTP Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Cookie Parser
app.use(cookieParser());

// CORS with credentials support
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or server-to-server curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);

app.use(json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/uploads", express.static(join(__dirname, "uploads")));


// Routes
app.use("/", authRoutes);
app.use("/api", linkRoutes);
app.use("/api/users", userRoutes);
app.use("/api", featuredRoutes);
app.use("/api/socials", socialRoutes);
app.use("/api", profileRoutes);
app.use("/api", analyticsRoutes);
app.use("/api/integrations", integrationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
const startServer = async () => {
  try {
    await initDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down server...`);
      server.close(() => {
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
