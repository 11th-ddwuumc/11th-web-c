import "server-only";
import { serverEnv } from "@/config/env";
import type { TmdbMovieDetail, TmdbMovieListResponse } from "@/api/movies/models";
import { readJson } from "./http";

async function tmdbJson<T>(path: string, params: Record<string, string>) {
  const url = new URL(path, `${serverEnv.tmdbApiBaseUrl.replace(/\/$/, "")}/`);
  url.search = new URLSearchParams({ language: "ko-KR", ...params }).toString();
  return readJson<T>(await fetch(url, {
    headers: { Authorization: `Bearer ${serverEnv.tmdbAccessToken}` },
    next: { revalidate: 60 },
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  }));
}

export function parsePage(value: string | string[] | undefined) {
  const page = Number(typeof value === "string" ? value : 1);
  return Number.isInteger(page) && page >= 1 && page <= 500 ? page : 1;
}

export function getServerMovies(page = 1) {
  return tmdbJson<TmdbMovieListResponse>("movie/popular", { page: String(page) });
}

export function getServerMovieDetail(movieId: number) {
  return tmdbJson<TmdbMovieDetail>(`movie/${movieId}`, {});
}

export function searchServerMovies(query: string, page = 1) {
  return tmdbJson<TmdbMovieListResponse>("search/movie", {
    query, page: String(page), include_adult: "false",
  });
}
