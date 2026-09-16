import jwt from "jsonwebtoken";
import "dotenv/config";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader?.split(" ") ?? [];

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT configuration is missing" });
  }

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "No token provided", code: "NO_TOKEN" });
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
