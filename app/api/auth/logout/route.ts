import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

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

function logout(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url), { status: 303 });
  clearAuthCookies(response);
  return response;
}

export function GET(request: NextRequest) {
  return logout(request);
}

export function POST(request: NextRequest) {
  return logout(request);
}
