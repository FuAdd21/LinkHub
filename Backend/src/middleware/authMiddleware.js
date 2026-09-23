import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { config, isOriginAllowed } from "../config/env.js";

export const authenticateToken = (req, res, next) => {
  // JWT_SECRET is validated at startup by env.js

  // 1. Extract token from Bearer header (primary) or cookie (fallback)
  const authHeader = req.headers.authorization;
  const [scheme, headerToken] = authHeader?.split(" ") ?? [];

  const cookieToken = req.cookies?.token;
  const isBearerAuth = scheme === "Bearer" && Boolean(headerToken);
  const token = isBearerAuth ? headerToken : cookieToken;
  const isCookieAuth = Boolean(cookieToken) && !isBearerAuth;

  if (!token) {
    return res.status(401).json({ message: "No token provided", code: "NO_TOKEN" });
  }

  // 2. If authenticated via cookie on state-modifying requests, enforce CSRF
  const isStateModifying = ["POST", "PUT", "DELETE", "PATCH"].includes(req.method);
  if (isCookieAuth && isStateModifying) {
    const clientCsrf = req.headers["x-csrf-token"];
    const cookieCsrf = req.cookies?.csrf_token;
    const origin = req.headers.origin;

    if (clientCsrf && cookieCsrf) {
      if (clientCsrf !== cookieCsrf) {
        return res.status(403).json({
          message: "CSRF token validation failed",
          code: "CSRF_INVALID",
        });
      }
    } else if (cookieCsrf && !clientCsrf) {
      // In decoupled cross-origin architecture (Vercel frontend + Render backend),
      // frontend cannot read cross-site cookies via document.cookie.
      // Allow request if origin is verified against allowedOrigins.
      if (!origin || !isOriginAllowed(origin)) {
        return res.status(403).json({
          message: "CSRF token validation failed",
          code: "CSRF_INVALID",
        });
      }
    }
  }

  jwt.verify(token, config.jwt.secret, async (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please log in again.", code: "TOKEN_EXPIRED" });
      }
      return res.status(403).json({ message: "Invalid token. Please log in again.", code: "TOKEN_INVALID" });
    }

    try {
      const [rows] = await db.query(
        "SELECT session_version FROM clients WHERE id = ? LIMIT 1",
        [user.id]
      );
      if (rows.length === 0) {
        return res.status(401).json({ message: "User not found", code: "USER_NOT_FOUND" });
      }
      const currentVersion = rows[0].session_version || 1;
      const tokenVersion = user.sessionVersion || 1;
      if (tokenVersion !== currentVersion) {
        return res.status(401).json({
          message: "Session has been invalidated. Please log in again.",
          code: "SESSION_REVOKED",
        });
      }
      req.user = user;
      next();
    } catch (dbErr) {
      console.error("Auth session verification error:", dbErr);
      return res.status(500).json({ message: "Internal server error during authentication" });
    }
  });
};

