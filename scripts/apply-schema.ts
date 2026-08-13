import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pool } from "../lib/db";

async function main() {
  const schemaPath = resolve(process.cwd(), "database/schema.sql");
  const schema = await readFile(schemaPath, "utf8");
  const statements = schema
    .split(/;\s*$/m)
    .map((statement) => statement.trim())
    .filter(Boolean);

  const connection = await pool.getConnection();
  try {
    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (error) {
        if ((error as { code?: string }).code !== "ER_DUP_FIELDNAME") {
          throw error;
        }
      }
    }
    console.log(`Applied ${statements.length} schema statements.`);
  } finally {
    connection.release();
    await pool.end();
  }
}

main().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
