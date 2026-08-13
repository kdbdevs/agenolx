import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pool } from "../lib/db";
import { PAYMENT_PROVIDERS, paymentMethodToProviderType } from "../lib/payment-providers";

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
    await seedPaymentProviders(connection);
    console.log(`Applied ${statements.length} schema statements.`);
  } finally {
    connection.release();
    await pool.end();
  }
}

async function seedPaymentProviders(connection: Awaited<ReturnType<typeof pool.getConnection>>) {
  await connection.query(`
    create table if not exists schema_seeds (
      seed_key varchar(120) not null primary key,
      applied_at timestamp not null default current_timestamp
    )
  `);

  const seedKey = "payment_providers_from_html_2026_08_14";
  const [rows] = await connection.query("select seed_key from schema_seeds where seed_key = ? limit 1", [seedKey]);
  if ((rows as unknown[]).length > 0) return;

  for (const provider of PAYMENT_PROVIDERS) {
    await connection.query(
      `insert ignore into banks (code, name, type, is_active)
       values (?, ?, ?, true)`,
      [provider.code, provider.name, paymentMethodToProviderType(provider.method)]
    );
  }

  await connection.query("insert into schema_seeds (seed_key) values (?)", [seedKey]);
}

main().catch(async (error) => {
  console.error(error);
  await pool.end().catch(() => undefined);
  process.exit(1);
});
