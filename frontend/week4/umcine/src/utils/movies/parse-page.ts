export const TMDB_MAX_PAGE = 500;

export function parsePage(value: unknown): number {
  const page =
    typeof value === "number" || typeof value === "string"
      ? Number(value)
      : NaN;

  return Number.isInteger(page) && page >= 1 && page <= TMDB_MAX_PAGE
    ? page
    : 1;
}
