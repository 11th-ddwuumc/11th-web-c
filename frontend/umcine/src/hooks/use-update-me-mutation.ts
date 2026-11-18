import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/update-me.ts";
import type { MemberInfo } from "../api/members/me.ts";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: data => {
      // 내 정보 조회와 동일 query key 사용 -> patch 수정을 통해 최신 정보 받음  
      queryClient.setQueryData<MemberInfo>([ "members", "me" ], data.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
