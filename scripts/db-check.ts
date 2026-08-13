import { checkDatabaseConnection, pool } from "../lib/db";

async function main() {
  const result = await checkDatabaseConnection();
  console.log(JSON.stringify(result, null, 2));
  await pool.end();
}

main().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
