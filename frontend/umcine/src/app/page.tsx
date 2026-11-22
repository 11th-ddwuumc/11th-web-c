import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import MovieListPage from "@/views/movies/movie-list-page";
import { getServerMovies, parsePage } from "@/server/tmdb";

export default async function Page({ searchParams }: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const page = parsePage((await searchParams).page);
  const client = new QueryClient();
  await client.query({
    queryKey: [ "movies", "list", { page } ],
    queryFn: () => getServerMovies(page),
  });
  return <HydrationBoundary state={ dehydrate(client) }><MovieListPage page={ page }/></HydrationBoundary>;
}
