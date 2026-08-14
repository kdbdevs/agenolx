import bcrypt from "bcryptjs";
import { pool } from "../lib/db";

function arg(name: string) {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : undefined;
}

async function main() {
  const username = arg("username") ?? process.env.ADMIN_USERNAME;
  const password = arg("password") ?? process.env.ADMIN_PASSWORD;
  const displayName = arg("display-name") ?? "Pemulabet Admin";

  if (!username || !password || password === "change-this-admin-password") {
    throw new Error("Set ADMIN_USERNAME and a strong ADMIN_PASSWORD, or pass --username=... --password=...");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await pool.execute(
    `insert into admin_users (username, password_hash, display_name, role, status)
     values (?, ?, ?, 'owner', 'active')
     on duplicate key update
       password_hash = values(password_hash),
       display_name = values(display_name),
       status = 'active',
       updated_at = current_timestamp`,
    [username, passwordHash, displayName]
  );

  console.log(`Admin user "${username}" is ready.`);
}

main().catch(async (error) => {
  console.error(error);
  await pool.end().catch(() => undefined);
  process.exit(1);
}).finally(async () => {
  await pool.end().catch(() => undefined);
});
