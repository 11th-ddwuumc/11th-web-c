import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, deleteFavorite, type Favorite } from "../api/favorites";

export const favoriteKeys = {
  list: ["favorites"] as const,
  detail: (movieId: number) => ["favorites", movieId] as const,
};

export function favoriteMutationOptions() {
  return mutationOptions({
    mutationKey: ["favorites", "toggle"],
    mutationFn: async ({ movieId, isFavorite }: { movieId: number; isFavorite: boolean }) => {
      if (isFavorite) await deleteFavorite(movieId);
      else await addFavorite(movieId);
      return { movieId, isFavorite: !isFavorite };
    },
  });
}

export function useFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...favoriteMutationOptions(),
    onSuccess: ({ movieId, isFavorite }) => {
      // 서버가 변환하지 않는 단순한 boolean은 추가 GET 없이 즉시 반영합니다.
      queryClient.setQueryData(favoriteKeys.detail(movieId), isFavorite);
      if (!isFavorite) {
        queryClient.setQueryData<Favorite[]>(favoriteKeys.list, (previous) =>
          previous?.filter((favorite) => favorite.movieId !== movieId),
        );
      } else {
        // 추가 응답에 영화 제목과 포스터가 없으므로 목록만 다시 조회합니다.
        void queryClient.invalidateQueries({ queryKey: favoriteKeys.list, exact: true });
      }
    },
  });
}
