import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL ?? "mysql://root:root@127.0.0.1:3306/agenolx";

export const pool = mysql.createPool({
  uri: databaseUrl,
  connectionLimit: 10,
  waitForConnections: true
});

export const db = drizzle(pool);

export async function checkDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query("select database() as database_name, version() as version");
    return rows;
  } finally {
    connection.release();
  }
}
