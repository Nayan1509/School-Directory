import { getPool } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT id, name, address, city, image FROM schools ORDER BY id DESC"
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch schools" });
  }
}
