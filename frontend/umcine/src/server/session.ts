import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";
import type { MemberInfo } from "@/api/members/me";
import type { Session } from "@/types/session";
import { getMemberId } from "@/utils/get-member-id";
import { backendJson } from "./backend";
import { UpstreamError } from "./http";

export const SESSION_COOKIE = "umcine-session";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function getToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function sessionFromToken(token: string): Promise<Session> {
  const response = await backendJson<{ result: MemberInfo }>("members/me", token);
  return { member: response.result, memberId: getMemberId(token) };
}

export const getSession = cache(async () => {
  const token = await getToken();
  if (!token) return null;
  try {
    return await sessionFromToken(token);
  } catch (error) {
    if (error instanceof UpstreamError && (error.status === 401 || error.status === 403)) return null;
    throw error;
  }
});

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export function setSessionCookie(response: NextResponse, token: string) {
  // Keep the browser cookie within the upstream JWT expiry when it is provided.
  let expires: Date | undefined;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString()) as { exp?: number };
    if (typeof payload.exp === "number" && Number.isFinite(payload.exp)) expires = new Date(payload.exp * 1000);
  } catch {
    // The upstream API remains responsible for validating its token format.
  }
  response.cookies.set(SESSION_COOKIE, token, { ...cookieOptions, ...(expires ? { expires } : {}) });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
