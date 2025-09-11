import { getPool } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "School ID is required" });

    const pool = getPool();
    const [result] = await pool.execute("DELETE FROM schools WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "School not found" });
    }

    return res.status(200).json({ message: "School deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ error: "Failed to delete school" });
  }
}
