import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { redirectRelative } from "@/lib/redirect";

function logout() {
  const response = redirectRelative("/admin/login");
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/admin",
    sameSite: "lax"
  });
  return response;
}

export function GET() {
  return logout();
}

export function POST() {
  return logout();
}
