import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { pool } from "@/lib/db";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username minimal 3 karakter")
  .max(50, "Username maksimal 50 karakter")
  .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore");

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") ?? "";
  const parsed = usernameSchema.safeParse(username);

  if (!parsed.success) {
    return NextResponse.json({
      valid: false,
      available: false,
      message: parsed.error.issues[0]?.message ?? "Username tidak valid"
    });
  }

  const [rows] = await pool.execute("select id from users where username = ? limit 1", [parsed.data]);
  const exists = Boolean((rows as Array<{ id: number }>)[0]);

  return NextResponse.json({
    valid: true,
    available: !exists,
    message: exists
      ? "Username sudah digunakan. Silahkan gunakan username lain."
      : "Username bisa digunakan."
  });
}
