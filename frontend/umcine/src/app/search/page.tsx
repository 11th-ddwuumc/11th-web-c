import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { SearchPage } from "@/views/movies/search-page";
import { searchServerMovies } from "@/server/tmdb";

export default async function Page({ searchParams }: {
  searchParams: Promise<{ query?: string | string[] }>;
}) {
  const value = (await searchParams).query;
  const query = (typeof value === "string" ? value : "").trim();
  const client = new QueryClient();
  if (query) await client.fetchQuery({
    queryKey: ["movies", "search", { query }],
    queryFn: () => searchServerMovies(query),
  });
  return <HydrationBoundary state={dehydrate(client)}><SearchPage query={query} /></HydrationBoundary>;
}
