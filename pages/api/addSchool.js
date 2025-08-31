import multer from "multer";
import path from "path";
import fs from "fs";
import { getPool } from "@/lib/db";

export const config = {
  api: { bodyParser: false }, // important: disable Next.js body parsing
};

// ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public", "schoolImages");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// multer storage config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, unique);
  },
});
const upload = multer({ storage });

// helper to run multer as middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    // process file upload
    await runMiddleware(req, res, upload.single("image"));

    const { name, address, city, state, contact, email_id } = req.body;
    const image = req.file?.filename;

    if (
      !name ||
      !address ||
      !city ||
      !state ||
      !contact ||
      !email_id ||
      !image
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // insert into DB
    const pool = getPool();
    await pool.execute(
      "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, address, city, state, contact, email_id, image]
    );

    return res
      .status(201)
      .json({ message: "School added successfully", file: image });
  } catch (err) {
    console.error("API ERROR:", err);
    return res
      .status(500)
      .json({ error: "Server crashed", details: err.message });
  }
}
