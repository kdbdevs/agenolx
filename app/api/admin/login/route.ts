import type { NextRequest } from "next/server";
import { z } from "zod";
import { authenticateAdmin, createAdminToken, setAdminCookie } from "@/lib/admin-auth";
import { redirectRelative, withSearchParam } from "@/lib/redirect";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi")
});

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = loginSchema.safeParse({
    username: field(formData, "username"),
    password: field(formData, "password")
  });

  if (!parsed.success) {
    return redirectRelative(withSearchParam("/admin/login", "error", parsed.error.issues[0]?.message ?? "Login tidak valid"));
  }

  const admin = await authenticateAdmin(parsed.data.username, parsed.data.password);
  if (!admin) {
    return redirectRelative(withSearchParam("/admin/login", "error", "Username atau password admin salah"));
  }

  const response = redirectRelative("/admin");
  setAdminCookie(response, await createAdminToken(admin));
  return response;
}

export function GET() {
  return redirectRelative("/admin/login");
}
