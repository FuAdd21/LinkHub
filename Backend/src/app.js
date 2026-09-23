import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "./config/env.js";
import { notFoundHandler, errorHandler } from "./errors/errorHandler.js";
import { requestLogger } from "./config/logger.js";

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
import projectRoutes from "./routes/projectRoutes.js";
import credentialRoutes from "./routes/credentialRoutes.js";
import { handleLinkRedirect } from "./controllers/redirectController.js";

const app = express();

app.set("trust proxy", 1);
app.use(requestLogger);

// Security HTTP Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", ...config.cors.allowedOrigins],
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    frameguard: { action: "deny" },
  })
);

// Cookie Parser
app.use(cookieParser());

// CORS with credentials support
const allowedOrigins = config.cors.allowedOrigins;

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.trim().replace(/\/+$/, "");
  if (allowedOrigins.includes(cleanOrigin)) return true;
  // Allow all Vercel deployment and preview URLs
  if (/^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(cleanOrigin)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
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
app.use("/api/projects", projectRoutes);
app.use("/api/credentials", credentialRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "LinkHub API is live and operational",
    version: "1.0.0",
    health: "/health",
  });
});

// Server-side redirect & click tracker
app.get("/r/:linkId", handleLinkRedirect);

// Health check (Liveness)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Readiness check (Database connectivity)
app.get("/health/ready", async (req, res) => {
  try {
    const { db } = await import("./config/db.js");
    await db.query("SELECT 1");
    res.json({
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: "unready",
      database: "disconnected",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
