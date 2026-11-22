import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import MyInfoPage from "@/views/members/myinfo-page";
import { requireSession, getToken } from "@/server/session";
import { backendJson } from "@/server/backend";
import { getServerMovieDetail } from "@/server/tmdb";
import type { FavoriteMovieInfo } from "@/api/favorites/models";

export default async function Page() {
  const session = await requireSession();
  const token = (await getToken())!;
  const client = new QueryClient();
  const favorites = await client.query({
    queryKey: ["favorites", "member", session.member.email, "list"],
    queryFn: async () => (await backendJson<{ result: FavoriteMovieInfo[] }>("favorites", token)).result,
  });
  await Promise.all(favorites.slice(0, 5).map((favorite) => client.query({
    queryKey: ["movies", "detail", favorite.movieId],
    queryFn: () => getServerMovieDetail(favorite.movieId),
  }).catch(() => undefined)));
  return <HydrationBoundary state={dehydrate(client)}><MyInfoPage /></HydrationBoundary>;
}
