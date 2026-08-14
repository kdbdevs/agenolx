import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const ADMIN_COOKIE_NAME = "pemulabet_admin_session";

export type AdminSession = {
  id: number;
  username: string;
  displayName: string;
  role: "owner" | "manager" | "finance";
};

type AdminRow = {
  id: number;
  username: string;
  password_hash: string;
  display_name: string | null;
  role: AdminSession["role"];
  status: "active" | "disabled";
};

function adminSecret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET ?? "pemulabet-admin-local-secret");
}

export async function createAdminToken(admin: AdminSession) {
  return new SignJWT({ username: admin.username, displayName: admin.displayName, role: admin.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(admin.id))
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(adminSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, adminSecret());
    const id = Number(payload.sub);
    if (!Number.isSafeInteger(id) || typeof payload.username !== "string") return null;
    if (id === 0) {
      return {
        id,
        username: payload.username,
        displayName: typeof payload.displayName === "string" ? payload.displayName : "Pemulabet Admin",
        role: payload.role === "manager" || payload.role === "finance" ? payload.role : "owner"
      };
    }

    const [rows] = await pool.execute(
      "select id, username, password_hash, display_name, role, status from admin_users where id = ? limit 1",
      [id]
    );
    const admin = (rows as AdminRow[])[0];
    if (!admin || admin.status !== "active") return null;

    return {
      id: admin.id,
      username: admin.username,
      displayName: admin.display_name ?? admin.username,
      role: admin.role
    };
  } catch {
    return null;
  }
}

export async function authenticateAdmin(username: string, password: string): Promise<AdminSession | null> {
  const [rows] = await pool.execute(
    "select id, username, password_hash, display_name, role, status from admin_users where username = ? limit 1",
    [username]
  );
  const admin = (rows as AdminRow[])[0];

  if (admin && admin.status === "active" && (await bcrypt.compare(password, admin.password_hash))) {
    return {
      id: admin.id,
      username: admin.username,
      displayName: admin.display_name ?? admin.username,
      role: admin.role
    };
  }

  if (
    (rows as AdminRow[]).length === 0 &&
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD &&
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD &&
    process.env.ADMIN_PASSWORD !== "change-this-admin-password"
  ) {
    return { id: 0, username, displayName: "Pemulabet Admin", role: "owner" };
  }

  return null;
}

export function setAdminCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 12,
    path: "/admin",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return admin;
}
