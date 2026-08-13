import bcrypt from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSessionToken, setAuthCookie } from "@/lib/auth";
import { pool } from "@/lib/db";
import { redirectRelative, withSearchParam } from "@/lib/redirect";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
  remember: z.boolean()
});

type LoginUserRow = {
  id: number;
  username: string;
  password_hash: string;
  status: "active" | "locked" | "suspended";
};

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function redirectWithError(request: NextRequest, message: string) {
  void request;
  return redirectRelative(withSearchParam("/login", "error", message));
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = loginSchema.safeParse({
    username: field(formData, "username"),
    password: field(formData, "password"),
    remember: formData.has("remember")
  });

  if (!parsed.success) {
    return redirectWithError(request, parsed.error.issues[0]?.message ?? "Login tidak valid");
  }

  const [rows] = await pool.execute(
    "select id, username, password_hash, status from users where username = ? limit 1",
    [parsed.data.username]
  );
  const user = (rows as LoginUserRow[])[0];

  if (!user || !(await bcrypt.compare(parsed.data.password, user.password_hash))) {
    return redirectWithError(request, "Username atau password salah");
  }

  if (user.status !== "active") {
    return redirectWithError(request, "Akun tidak aktif");
  }

  const response = redirectRelative("/");
  const token = await createSessionToken({ userId: user.id, username: user.username }, parsed.data.remember);
  setAuthCookie(response, token, parsed.data.remember);
  return response;
}
