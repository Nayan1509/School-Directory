import { getPool } from "@/lib/db";

export default async function handler(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.status(200).json({ time: rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
}
