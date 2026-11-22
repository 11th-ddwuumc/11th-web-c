import "server-only";

function required(name: "API_BASE_URL" | "TMDB_API_BASE_URL" | "TMDB_ACCESS_TOKEN") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요해요.`);
  return value;
}

export const serverEnv = {
  get apiBaseUrl() { return required("API_BASE_URL"); },
  get tmdbApiBaseUrl() { return required("TMDB_API_BASE_URL"); },
  get tmdbAccessToken() { return required("TMDB_ACCESS_TOKEN"); },
};
