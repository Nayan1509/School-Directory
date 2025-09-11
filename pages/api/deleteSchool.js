import { getPool } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing ID" });

  try {
    const pool = getPool();
    await pool.execute("DELETE FROM schools WHERE id = ?", [id]);
    res.json({ message: "School deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

export default requireAuth(handler);
