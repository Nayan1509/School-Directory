import { getPool } from "@/lib/db";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;
  if (!token) return res.status(200).json({ user: null });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally fetch user row
    return res.json({ user: { email: payload.email } });
  } catch (err) {
    return res.status(200).json({ user: null });
  }
}
