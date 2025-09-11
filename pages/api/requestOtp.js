import nodemailer from "nodemailer";
import { getPool } from "@/lib/db";

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const pool = getPool();
    await pool.execute(
      "INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your School Directory OTP",
      text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
    });

    return res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("requestOtp error:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
}
