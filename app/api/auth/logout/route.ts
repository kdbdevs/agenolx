import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { redirectRelative } from "@/lib/redirect";

const AUTH_COOKIE_NAMES = [AUTH_COOKIE_NAME, "session", "auth_token", "token"];

function clearAuthCookies(response: NextResponse) {
  for (const name of AUTH_COOKIE_NAMES) {
    response.cookies.set(name, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "lax"
    });
  }
}

function logout() {
  const response = redirectRelative("/");
  clearAuthCookies(response);
  return response;
}

export function GET() {
  return logout();
}

export function POST() {
  return logout();
}
