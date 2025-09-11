// lib/auth.js
import jwt from "jsonwebtoken";
import cookie from "cookie";

export function getTokenFromReq(req) {
  const cookies = cookie.parse(req.headers.cookie || "");
  return cookies.token || null;
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// middleware for API routes
export function requireAuth(handler) {
  return async (req, res) => {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = verifyToken(token);
    if (!payload)
      return res.status(401).json({ error: "Invalid or expired token" });

    // attach user (email) to req for handlers
    req.user = payload;
    return handler(req, res);
  };
}
