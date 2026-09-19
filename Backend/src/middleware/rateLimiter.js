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
    error: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return !config.isProd && isLocalRequest(req);
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 authentication attempts per IP per window
  message: {
    message: "Too many authentication attempts. Please try again later.",
    code: "RATE_LIMITED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return !config.isProd && isLocalRequest(req);
  },
});

export const analyticsRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Max 60 analytics events per IP per minute
  message: {
    message: "Too many tracking events. Please slow down.",
    code: "RATE_LIMITED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return !config.isProd && isLocalRequest(req);
  },
});

