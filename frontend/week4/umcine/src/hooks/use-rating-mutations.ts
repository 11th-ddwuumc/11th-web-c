import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating, updateRating, deleteRating } from "../api/ratings";

export function useRatingMutations(memberId: number | undefined) {
  const client = useQueryClient();
  const refresh = () => {
    if (memberId !== undefined) {
      void client.invalidateQueries({ queryKey: ["members", memberId, "ratings"] });
    }
  };
  const create = useMutation({ mutationFn: createRating, onSuccess: refresh });
  const update = useMutation({ mutationFn: updateRating, onSuccess: refresh });
  const remove = useMutation({ mutationFn: deleteRating, onSuccess: refresh });
  return { create, update, remove };
}
