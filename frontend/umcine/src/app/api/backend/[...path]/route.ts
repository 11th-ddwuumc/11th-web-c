import { NextResponse } from "next/server";
import { backendRequest } from "@/server/backend";
import { apiError, isSameOrigin } from "@/server/http";
import { clearSessionCookie, getSession, getToken } from "@/server/session";

type Context = { params: Promise<{ path: string[] }> };

async function handle(request: Request, context: Context) {
  const { path } = await context.params;
  const route = path.join("/");
  const method = request.method;
  const isPublic = (method === "POST" && route === "members") ||
    (method === "GET" && /^members\/(email|nickname)\/[^/]+$/.test(route));
  const allowed = isPublic ||
    (route === "members/me" && ["GET", "PATCH"].includes(method)) ||
    (/^members\/[1-9]\d*\/ratings$/.test(route) && method === "GET") ||
    (route === "favorites" && ["GET", "POST"].includes(method)) ||
    (/^favorites\/[1-9]\d*$/.test(route) && ["GET", "DELETE"].includes(method)) ||
    (/^ratings\/[1-9]\d*$/.test(route) && ["PATCH", "DELETE"].includes(method)) ||
    (route === "ratings" && method === "POST") ||
    (route === "movie-records" && method === "POST");
  if (!allowed || path.some((part) => part === "." || part === ".." || part.includes("/"))) {
    return NextResponse.json({ message: "지원하지 않는 경로예요." }, { status: 404 });
  }
  if (method !== "GET" && !isSameOrigin(request)) {
    return NextResponse.json({ message: "허용되지 않은 요청이에요." }, { status: 403 });
  }
  try {
    const token = isPublic ? undefined : await getToken();
    if (!isPublic && !token) return NextResponse.json({ message: "로그인이 필요해요." }, { status: 401 });
    if (/^members\/[1-9]\d*\/ratings$/.test(route)) {
      const session = await getSession();
      if (!session) {
        const response = NextResponse.json({ message: "로그인이 필요해요." }, { status: 401 });
        clearSessionCookie(response);
        return response;
      }
      if (session.memberId !== Number(path[1])) return NextResponse.json({ message: "권한이 없어요." }, { status: 403 });
    }
    const body = method === "GET" ? undefined : await request.text();
    const upstream = await backendRequest(path.map(encodeURIComponent).join("/"), token, {
      method,
      ...(body ? { body, headers: { "Content-Type": "application/json" } } : {}),
    });
    const response = new NextResponse(upstream.status === 204 ? null : await upstream.text(), {
      status: upstream.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
    if (!isPublic && upstream.status === 401) clearSessionCookie(response);
    return response;
  } catch (error) { return apiError(error); }
}

export { handle as GET, handle as POST, handle as PATCH, handle as DELETE };
