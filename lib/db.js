// lib/db.js
import mysql from "mysql2/promise";

let pool;

export function getPool() {
  if (!pool) {
    const conn = process.env.DATABASE_URL;
    if (!conn) throw new Error("Missing DATABASE_URL");

    // parse connection string to object
    const url = new URL(conn);
    const database =
      url.pathname.replace(/^\//, "") || url.searchParams.get("database");

    pool = mysql.createPool({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database,
      port: url.port ? Number(url.port) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      // Accept Railway TLS certs
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}
