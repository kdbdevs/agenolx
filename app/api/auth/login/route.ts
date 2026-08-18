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

function isAjaxLogin(request: NextRequest) {
  return request.headers.get("x-login-ajax") === "1";
}

function loginErrorResponse(request: NextRequest, message: string, fieldName?: string, status = 400) {
  if (isAjaxLogin(request)) {
    return NextResponse.json({ ok: false, error: message, field: fieldName ?? "" }, { status });
  }

  let target = withSearchParam("/login", "error", message);
  if (fieldName) {
    target = withSearchParam(target, "field", fieldName);
  }
  return redirectRelative(target);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = loginSchema.safeParse({
    username: field(formData, "username"),
    password: field(formData, "password"),
    remember: formData.has("remember")
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return loginErrorResponse(request, issue?.message ?? "Login tidak valid", String(issue?.path[0] ?? ""));
  }

  const [rows] = await pool.execute(
    "select id, username, password_hash, status from users where username = ? limit 1",
    [parsed.data.username]
  );
  const user = (rows as LoginUserRow[])[0];

  if (!user || !(await bcrypt.compare(parsed.data.password, user.password_hash))) {
    return loginErrorResponse(request, "Username atau password salah", undefined, 401);
  }

  if (user.status !== "active") {
    return loginErrorResponse(request, "Akun tidak aktif", "username", 403);
  }

  const response = isAjaxLogin(request) ? NextResponse.json({ ok: true, redirect: "/" }) : redirectRelative("/");
  const token = await createSessionToken({ userId: user.id, username: user.username }, parsed.data.remember);
  setAuthCookie(response, token, parsed.data.remember);
  return response;
}
