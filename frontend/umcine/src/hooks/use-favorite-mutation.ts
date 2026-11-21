import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFavorite } from "../api/favorites/remove-favorite.ts";
import { addFavorite } from "../api/favorites/add-favorite.ts";
import type { FavoriteResponse } from "../api/favorites/get-favorite.ts";

export function useFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
                         movieId,
                         wasFavorite,
                       }: {
      movieId: number;
      wasFavorite: boolean;
      memberEmail: string;
    }) => {
      if (wasFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite({ movieId });
      }
    },

    onSuccess: async (_data, variables) => {
      const { memberEmail, movieId, wasFavorite } = variables;

      const favoriteKey = [
        "favorites",
        "member",
        memberEmail,
        "movie",
        movieId,
      ] as const;

      // 이전 조회 응답이 직접 갱신한 값을 덮어쓰지 않도록 취소
      await queryClient.cancelQueries({
        queryKey: favoriteKey,
        exact: true,
      });

      // 영화 상세 페이지에서는 캐시 값 직접 변경
      queryClient.setQueryData<FavoriteResponse>(
        favoriteKey,
        (previous) =>
          previous
            ? {
              ...previous,
              result: {
                isFavorite: !wasFavorite,
              },
            }
            : undefined,
      );

      // 즐겨찾기 영화 목록(마이페이지용)은 invalidate
      await queryClient.invalidateQueries({
        queryKey: [ "favorites", "member", memberEmail, "list" ],
      });
    },

    onError: () => {
      alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
    },
  });
}