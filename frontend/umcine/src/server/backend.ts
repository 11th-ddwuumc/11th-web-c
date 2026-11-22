import "server-only";
import { serverEnv } from "@/config/env";
import { readJson } from "./http";

export function backendRequest(path: string, token?: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(new URL(path, `${serverEnv.apiBaseUrl.replace(/\/$/, "")}/`), {
    ...init,
    headers,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
}

export async function backendJson<T>(path: string, token: string) {
  return readJson<T>(await backendRequest(path, token));
}
