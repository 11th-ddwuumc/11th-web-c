import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { MovieDetailPage } from "@/views/movies/movie-detail-page";
import { getServerMovieDetail } from "@/server/tmdb";
import { UpstreamError } from "@/server/http";

export default async function Page({ params }: { params: Promise<{ movieId: string }> }) {
  const movieId = Number((await params).movieId);
  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    return <main className="flex flex-1 items-center justify-center"><p role="alert">올바르지 않은 영화 번호예요.</p></main>;
  }
  const client = new QueryClient();
  try {
    await client.query({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getServerMovieDetail(movieId),
    });
  } catch (error) {
    if (error instanceof UpstreamError && error.status === 404) notFound();
    throw error;
  }
  return <HydrationBoundary state={dehydrate(client)}><MovieDetailPage /></HydrationBoundary>;
}
