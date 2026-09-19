import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import featuredRoutes from "./routes/featuredRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import { handleLinkRedirect } from "./controllers/redirectController.js";

const app = express();

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
app.use("/uploads", express.static(join(__dirname, "..", "uploads")));


// Routes
app.use("/", authRoutes);
app.use("/api", linkRoutes);
app.use("/api/users", userRoutes);
app.use("/api", featuredRoutes);
app.use("/api/socials", socialRoutes);
app.use("/api", profileRoutes);
app.use("/api", analyticsRoutes);
app.use("/api/integrations", integrationRoutes);

// Server-side redirect & click tracker
app.get("/r/:linkId", handleLinkRedirect);

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

export { app };
