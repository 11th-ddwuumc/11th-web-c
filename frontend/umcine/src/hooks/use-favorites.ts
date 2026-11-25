import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../api/favorites/add-favorite";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { getFavorites } from "../api/favorites/get-favorites";
import type { Favorite, FavoriteStatus } from "../api/favorites/models";
import { removeFavorite } from "../api/favorites/remove-favorite";
import { useAuthStore } from "../stores/auth-store";

export const favoriteKeys = {
  all: ["favorites"] as const,
  list: () => ["favorites", "list"] as const,
  status: (movieId: number) => ["favorites", "status", movieId] as const,
};

// 마이페이지, 영화 목록: 내 즐겨찾기 목록
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
}

// 영화 상세: 이 영화가 내 즐겨찾기인지
export function useFavoriteStatusQuery(movieId: number, enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteKeys.status(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && enabled,
  });
}

// 성공 응답(또는 요청한 movieId)으로 목록과 여부 캐시를 직접 바꿔서 다시 조회하지 않는다.
export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: (response, movieId) => {
      queryClient.setQueryData<FavoriteStatus>(favoriteKeys.status(movieId), {
        isFavorite: true,
      });
      queryClient.setQueryData<Favorite[]>(favoriteKeys.list(), (prev) =>
        prev
          ? [response.result, ...prev.filter((favorite) => favorite.movieId !== movieId)]
          : prev,
      );
    },
    onError: () => {
      alert("즐겨찾기 추가에 실패했어요. 다시 시도해 주세요.");
      // 이미 즐겨찾기한 경우(409) 등 서버와 어긋났을 수 있으니 다시 조회한다.
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: (_response, movieId) => {
      queryClient.setQueryData<FavoriteStatus>(favoriteKeys.status(movieId), {
        isFavorite: false,
      });
      queryClient.setQueryData<Favorite[]>(favoriteKeys.list(), (prev) =>
        prev?.filter((favorite) => favorite.movieId !== movieId),
      );
    },
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}
