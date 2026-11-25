import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import { getMemberRatings } from "../api/ratings/get-member-ratings";
import type { Rating } from "../api/ratings/models";
import { updateRating } from "../api/ratings/update-rating";
import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/get-member-id-from-token";

export const ratingKeys = {
  member: (memberId: number | null) => ["members", memberId, "ratings"] as const,
};

export function useMyMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return getMemberIdFromToken(accessToken);
}

// 내가 남긴 평점 목록. 영화 상세에서는 movieId로 골라서 쓴다.
export function useMyRatingsQuery() {
  const memberId = useMyMemberId();

  return useQuery({
    queryKey: ratingKeys.member(memberId),
    queryFn: () => getMemberRatings(memberId as number),
    enabled: memberId !== null,
  });
}

// 등록·수정·삭제 모두 응답(또는 요청 값)으로 목록 캐시를 직접 바꾼다.
export function useCreateRatingMutation() {
  const queryClient = useQueryClient();
  const memberId = useMyMemberId();

  return useMutation({
    mutationFn: createRating,
    onSuccess: (response) => {
      queryClient.setQueryData<Rating[]>(ratingKeys.member(memberId), (prev) =>
        prev ? [response.result, ...prev] : prev,
      );
      alert(response.message);
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
      queryClient.invalidateQueries({ queryKey: ratingKeys.member(memberId) });
    },
  });
}

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();
  const memberId = useMyMemberId();

  return useMutation({
    mutationFn: updateRating,
    onSuccess: (response) => {
      queryClient.setQueryData<Rating[]>(ratingKeys.member(memberId), (prev) =>
        prev?.map((rating) =>
          rating.ratingId === response.result.ratingId ? response.result : rating,
        ),
      );
      alert(response.message);
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
      queryClient.invalidateQueries({ queryKey: ratingKeys.member(memberId) });
    },
  });
}

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();
  const memberId = useMyMemberId();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: (response, ratingId) => {
      queryClient.setQueryData<Rating[]>(ratingKeys.member(memberId), (prev) =>
        prev?.filter((rating) => rating.ratingId !== ratingId),
      );
      alert(response.message);
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
      queryClient.invalidateQueries({ queryKey: ratingKeys.member(memberId) });
    },
  });
}
