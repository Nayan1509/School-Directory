export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  res.setHeader(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );
  res.json({ message: "Logged out" });
}
