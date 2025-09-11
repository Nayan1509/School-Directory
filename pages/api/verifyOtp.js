// pages/api/verifyOtp.js
import { getPool } from "@/lib/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, code } = req.body || {};
  if (!email || !code)
    return res.status(400).json({ error: "Email and code required" });

  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT * FROM otps WHERE email = ? AND code = ? AND used = FALSE ORDER BY id DESC LIMIT 1",
      [email, code]
    );

    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const otp = rows[0];
    if (new Date(otp.expires_at) < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // mark used
    await pool.execute("UPDATE otps SET used = TRUE WHERE id = ?", [otp.id]);

    // create user if not exists
    await pool.execute("INSERT IGNORE INTO users (email) VALUES (?)", [email]);

    // issue JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set HttpOnly cookie
    const cookieStr = `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;
    res.setHeader("Set-Cookie", cookieStr);

    return res.json({ message: "Logged in" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
}
