import "server-only";
import { NextResponse } from "next/server";

export class UpstreamError extends Error {
  constructor(public readonly status: number) {
    super("API 요청을 처리하지 못했어요.");
  }
}

export async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new UpstreamError(response.status);
  return response.json() as Promise<T>;
}

export function apiError(error: unknown) {
  const status = error instanceof UpstreamError ? error.status : 502;
  return NextResponse.json({ message: "요청을 처리하지 못했어요. 다시 시도해 주세요." }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function isSameOrigin(request: Request) {
  try {
    const origin = new URL(request.headers.get("origin") ?? "");
    const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim()
      ?? new URL(request.url).protocol.replace(":", "");
    return origin.host === request.headers.get("host") && origin.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}
