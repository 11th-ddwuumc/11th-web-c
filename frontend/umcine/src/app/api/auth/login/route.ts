import { NextResponse } from "next/server";
import { backendRequest } from "@/server/backend";
import { apiError, isSameOrigin, readJson } from "@/server/http";
import { sessionFromToken, setSessionCookie } from "@/server/session";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ message: "허용되지 않은 요청이에요." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ message: "입력값을 확인해 주세요." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || !("email" in body) || !("password" in body) ||
    typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ message: "입력값을 확인해 주세요." }, { status: 400 });
  }
  try {
    const login = await readJson<{ isSuccess: boolean; code: string; message: string; result: { accessToken: string } }>(
      await backendRequest("auth/login", undefined, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: body.email, password: body.password }),
      }),
    );
    if (!login.isSuccess || !login.result?.accessToken) return NextResponse.json({ message: "로그인에 실패했어요." }, { status: 401 });
    const session = await sessionFromToken(login.result.accessToken);
    const response = NextResponse.json({
      isSuccess: login.isSuccess,
      code: login.code,
      message: login.message,
      result: session,
    }, { headers: { "Cache-Control": "no-store" } });
    setSessionCookie(response, login.result.accessToken);
    return response;
  } catch (error) { return apiError(error); }
}
