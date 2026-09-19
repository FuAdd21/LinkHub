import rateLimit from "express-rate-limit";
import { config } from "../config/env.js";

function isLocalRequest(req) {
  const ip = req.ip || req.connection?.remoteAddress || "";
  return ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(ip) || ip.includes("127.0.0.1");
}

export const socialRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests. Please try again later.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !config.isProd && isLocalRequest(req),
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 authentication attempts per IP per window
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
    error: {
      code: "RATE_LIMITED",
      message: "Too many authentication attempts. Please try again later.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !config.isProd && isLocalRequest(req),
});

export const clickLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Max 60 click tracking events per IP per minute
  message: {
    success: false,
    message: "Too many click events. Please slow down.",
    error: {
      code: "RATE_LIMITED",
      message: "Too many click events. Please slow down.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !config.isProd && isLocalRequest(req),
});

export const viewLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Max 30 profile view events per IP per minute
  message: {
    success: false,
    message: "Too many view events. Please slow down.",
    error: {
      code: "RATE_LIMITED",
      message: "Too many view events. Please slow down.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !config.isProd && isLocalRequest(req),
});

export const analyticsQueryLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Max 30 analytics dashboard queries per minute
  message: {
    success: false,
    message: "Too many analytics requests. Please slow down.",
    error: {
      code: "RATE_LIMITED",
      message: "Too many analytics requests. Please slow down.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !config.isProd && isLocalRequest(req),
});

// Backward compatibility alias
export const analyticsRateLimiter = clickLimiter;
