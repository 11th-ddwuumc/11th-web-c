import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMovieRecord, type CreateMovieRecordRequest } from "../api/movie-records/add-record.ts";
import { addRating, type CreateRatingRequest } from "../api/ratings/add-rating.ts";
import { updateRating, type UpdateRatingRequest } from "../api/ratings/update-rating.ts";
import type { RatingResponse } from "../api/ratings/models.ts";
import { deleteRating } from "../api/ratings/delete-rating.ts";

export type MovieRecordMutationVariables = { memberEmail: string } & (
  | { action: "create-record"; body: CreateMovieRecordRequest }
  | { action: "create-rating"; body: CreateRatingRequest }
  | { action: "update-rating"; ratingId: number; body: UpdateRatingRequest }
  | { action: "delete-rating"; ratingId: number }
);

export function useMovieRecordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: MovieRecordMutationVariables) => {
      switch (variables.action) {
        case "create-record": {
          const response = await addMovieRecord(variables.body);
          return { favoriteAdded: response.result.favorite !== null, rating: response.result.rating };
        }
        case "create-rating": {
          const response = await addRating(variables.body);
          return { favoriteAdded: false, rating: response.result };
        }
        case "update-rating": {
          const response = await updateRating(variables.ratingId, variables.body);
          return { favoriteAdded: false, rating: response.result };
        }
        case "delete-rating":
          await deleteRating(variables.ratingId);
          break;
      }

      return { favoriteAdded: false, rating: null };
    },

    onSuccess: async (result, variables) => {
      const ratingKey = [ "ratings", "member", variables.memberEmail ];
      await queryClient.cancelQueries({ queryKey: ratingKey });
      queryClient.setQueriesData<RatingResponse[]>({ queryKey: ratingKey }, (previous) => {
        if (!previous) {
          return undefined;
        }
        if (result.rating) {
          return [result.rating, ...previous.filter((item) => item.movieId !== result.rating.movieId)];
        }
        if (variables.action === "delete-rating") {
          return previous.filter((item) => item.ratingId !== variables.ratingId);
        }
        return previous;
      });

      const invalidations = [
        queryClient.invalidateQueries({
          queryKey: [ "ratings", "member", variables.memberEmail ],
        }),
      ];

      if (result.favoriteAdded) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: [ "favorites", "member", variables.memberEmail ],
          }),
        );
      }

      await Promise.all(invalidations);
    },

    onError: () => {
      alert("영화 기록 요청에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
