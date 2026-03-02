import jwt from "jsonwebtoken";
import "dotenv/config";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Auth middleware - token:", token ? "present" : "missing");
  console.log("Auth header:", authHeader);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    console.log("Token verified, user:", user);
    req.user = user;
    next();
  });
};
