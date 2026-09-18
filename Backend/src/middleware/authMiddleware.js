import jwt from "jsonwebtoken";
import "dotenv/config";

export const authenticateToken = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT configuration is missing" });
  }

  // 1. Extract token from cookie (primary) or Bearer header (fallback)
  const authHeader = req.headers.authorization;
  const [scheme, headerToken] = authHeader?.split(" ") ?? [];

  const cookieToken = req.cookies?.token;
  const token = cookieToken || (scheme === "Bearer" ? headerToken : null);
  const isCookieAuth = Boolean(cookieToken);

  if (!token) {
    return res.status(401).json({ message: "No token provided", code: "NO_TOKEN" });
  }

  // 2. If authenticated via cookie on state-modifying requests, enforce CSRF
  const isStateModifying = ["POST", "PUT", "DELETE", "PATCH"].includes(req.method);
  if (isCookieAuth && isStateModifying) {
    const clientCsrf = req.headers["x-csrf-token"];
    const cookieCsrf = req.cookies?.csrf_token;

    if (!clientCsrf || !cookieCsrf || clientCsrf !== cookieCsrf) {
      return res.status(403).json({
        message: "CSRF token validation failed",
        code: "CSRF_INVALID",
      });
    }
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please log in again.", code: "TOKEN_EXPIRED" });
      }
      return res.status(403).json({ message: "Invalid token. Please log in again.", code: "TOKEN_INVALID" });
    }

    req.user = user;
    next();
  });
};

