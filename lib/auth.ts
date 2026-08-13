import { SignJWT, jwtVerify } from "jose";
import type { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "agenolx_session";

export type SessionPayload = {
  userId: number;
  username: string;
};

function getSessionSecret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET ?? "agenolx-local-dev-session-secret");
}

export async function createSessionToken(payload: SessionPayload, remember = false) {
  return new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(payload.userId))
    .setIssuedAt()
    .setExpirationTime(remember ? "30d" : "1d")
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const userId = Number(payload.sub);
    if (!Number.isSafeInteger(userId) || userId < 1 || typeof payload.username !== "string") {
      return null;
    }
    return { userId, username: payload.username };
  } catch {
    return null;
  }
}

export function setAuthCookie(response: NextResponse, token: string, remember = false) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}
