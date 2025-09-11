import multer from "multer";
import { getPool } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { requireAuth } from "@/lib/auth";

export const config = {
  api: { bodyParser: false },
};

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

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, upload.single("image"));

    const { name, address, city, state, contact, email_id } = req.body;
    const file = req.file;

    if (
      !name ||
      !address ||
      !city ||
      !state ||
      !contact ||
      !email_id ||
      !file
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // upload to Cloudinary
    const uploadRes = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "schools" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    // insert Cloudinary URL into DB
    const pool = getPool();
    await pool.execute(
      "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, address, city, state, contact, email_id, uploadRes.secure_url]
    );

    return res.status(201).json({
      message: "School added successfully",
      file: uploadRes.secure_url,
    });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({
      error: "Server crashed",
      details: err.message,
    });
  }
}

// 🔒 protect with auth
export default requireAuth(handler);
