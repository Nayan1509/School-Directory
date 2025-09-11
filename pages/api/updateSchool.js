import multer from "multer";
import { getPool } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

export const config = { api: { bodyParser: false } };

const storage = multer.memoryStorage();
const upload = multer({ storage });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "PUT")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    await runMiddleware(req, res, upload.single("image"));
    const { id, name, address, city, state, contact, email_id } = req.body;

    if (!id) return res.status(400).json({ error: "ID is required" });

    const pool = getPool();

    let imageUrl = null;
    if (req.file) {
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "schools" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = uploadRes.secure_url;
    }

    const query = `
      UPDATE schools 
      SET name=?, address=?, city=?, state=?, contact=?, email_id=?${
        imageUrl ? ", image=?" : ""
      }
      WHERE id=?`;

    const params = imageUrl
      ? [name, address, city, state, contact, email_id, imageUrl, id]
      : [name, address, city, state, contact, email_id, id];

    await pool.execute(query, params);

    return res.status(200).json({ message: "School updated successfully" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ error: "Failed to update school" });
  }
}
