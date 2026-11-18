import { cn } from "../../utils/cn.ts";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation.ts";
import * as React from "react";
import { useState } from "react";
import { useAuthStore } from "../../stores/auth-store.ts";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me.ts";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate.ts";

export function EditProfilePage() {

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: [ "members", "me" ],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const [ nicknameDraft, setNickname ] = useState<string | null>(null);
  const nickname = nicknameDraft ?? meQuery.data?.nickname ?? "";
  const email = meQuery.data?.email ?? "";

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;

  // 중복 확인을 통과한 닉네임
  const [ checkedNickname, setCheckedNickname ] = useState<string | null>(null);
  const normalizedNickname = nickname.trim();

  const nicknameCheckQuery = useQuery({
    queryKey: [ "members", "nickname-duplicate", normalizedNickname ],
    queryFn: () => checkNicknameDuplicate(normalizedNickname),
    enabled: false,
    retry: false,
  });

  const canSubmit =
    isNicknameValid &&
    !nicknameCheckQuery.isFetching &&
    checkedNickname === normalizedNickname &&
    nicknameCheckQuery.data?.available === true;

  const handleChangeNickname = (value: string) => {
    if (nicknameCheckQuery.isFetching) {
      return;
    }
    // 입력을 바꾸면 이전 확인 결과로 저장할 수 없도록 처리
    setCheckedNickname(null);
    setNickname(value);
  };

  const handleCheckNickname = async () => {
    if (!isNicknameValid || nicknameCheckQuery.isFetching) {
      return;
    }

    setCheckedNickname(null);
    const result = await nicknameCheckQuery.refetch();

    if (result.isError) {
      alert("닉네임 중복 확인에 실패했어요. 다시 시도해 주세요.");
      return;
    }
    if (!result.data) {
      return;
    }
    if (result.data.available) {
      setCheckedNickname(normalizedNickname);
      alert("사용할 수 있는 닉네임입니다.");
    } else {
      alert("이미 사용 중인 닉네임입니다.");
    }
  };

  const updateMeMutation = useUpdateMeMutation();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) {
      return;
    }
    updateMeMutation.mutate({ nickname: nickname.trim() });
  };

  return (
    <main className="flex w-full flex-1 flex-col gap-6 px-20 py-6 bg-(--color-bg-page)">

      <form className="flex flex-col gap-6" onSubmit={ handleSubmit }>
        <div className="flex w-full h-fit justify-between items-center">
          <div className="flex flex-col gap-2.25 h-fit">
            <h1
              className="flex w-full h-fit font-bold text-[31px] text-(--color-text-primary) leading-[100%] tracking-[-1.53px]">
              내 정보 수정
            </h1>
            <p className="flex w-full h-fit m-0 font-normal text-(--color-text-secondary) text-[14px] leading-[22.4px]">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            className={ cn(
              "flex h-10.5 justify-center items-center px-4 cursor-pointer",
              "rounded-lg border border-(--color-bg-surface) bg-(--color-action-primary)",
              "font-bold text-[14px] text-(--color-bg-surface) leading-[100%]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            ) }
            type="submit"
            disabled={ !canSubmit || updateMeMutation.isPending }
          >
            { updateMeMutation.isPending ? "저장 중..." : "변경사항 저장" }
          </button>
        </div>

        <div className="flex w-full h-fit gap-11">
          <div className="flex flex-col w-full h-fit">
            <section className="flex flex-col w-full h-fit gap-4.25">
              <div className="flex w-full h-fit items-center">
                <div className="flex flex-col justify-center items-center w-full h-33.25 gap-1">
                <span
                  className="relative flex flex-col justify-center items-center w-20.5 h-20.5 rounded-[41px] bg-(--color-border-default)"
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_98_1158)">
                    <path
                      d="M24 24C28.42 24 32 20.42 32 16C32 11.58 28.42 8 24 8C19.58 8 16 11.58 16 16C16 20.42 19.58 24 24 24ZM24 28C18.66 28 8 30.68 8 36V40H40V36C40 30.68 29.34 28 24 28Z"
                      fill="#17191E"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_98_1158">
                    <rect width="48" height="48" fill="white"/>
                    </clipPath>
                    </defs>
                  </svg>
                  <span className="absolute right-0 bottom-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="22" height="22" rx="11" stroke="#17191E" strokeWidth="2"/>
                      <g clipPath="url(#clip0_98_1195)">
                        <path
                          d="M6 15.4997V17.9997H8.5L15.8733 10.6264L13.3733 8.12638L6 15.4997ZM17.8067 8.69305C18.0667 8.43305 18.0667 8.01305 17.8067 7.75305L16.2467 6.19305C15.9867 5.93305 15.5667 5.93305 15.3067 6.19305L14.0867 7.41305L16.5867 9.91305L17.8067 8.69305Z"
                          fill="#17191E"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_98_1195">
                          <rect width="16" height="16" fill="white" transform="translate(4 4)"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </span>
                  <div className="flex m-0 font-bold text-[15px] text-(--color-text-primary)">
                    프로필 이미지
                  </div>
                  <div className="flex m-0 font-normal text-[11px] text-(--color-text-tertiary) leading-[100%]">
                    선택 사항 · 최대 5MB
                  </div>
                </div>
                <div className="flex flex-col w-full h-fit gap-4.25">
                  <div className="flex flex-col w-full h-fit gap-2">
                    <label className={ cn(
                      "flex flex-col w-full h-4 px-1",
                      "font-bold text-[13px] text-(--color-text-primary) leading-[100%]",
                    ) }>
                      닉네임
                    </label>
                    <div className={ cn(
                      "flex w-full items-center h-fit min-h-12 rounded-lg px-3.25 py-3.5 gap-2",
                      "bg-(--color-bg-surface) border border-(--color-border-default)",
                    ) }>
                      <input
                        className={ cn(
                          "flex w-full h-fit px-0.5 py-px focus:outline-none",
                          "font-normal text-[14px] text-(--color-text-primary) leading-[100%]",
                        ) }
                        value={ nickname }
                        onChange={ (e) => handleChangeNickname(e.target.value) }
                      />
                      <button
                        type="button"
                        className={ cn("flex shrink-0 font-bold cursor-pointer",
                          "text-[12px] text-(--color-action-primary) leading-[100%]") }
                        disabled={ !isNicknameValid || nicknameCheckQuery.isFetching }
                        onClick={ handleCheckNickname }
                      >
                        { nicknameCheckQuery.isFetching ? "확인 중" : "중복확인" }
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col w-full h-fit gap-2 pt-px">
                    <label className={ cn(
                      "flex flex-col w-full h-4 px-1",
                      "font-bold text-[13px] text-(--color-text-primary) leading-[100%]",
                    ) }>
                      이메일
                    </label>
                    <div className={ cn(
                      "flex w-full h-fit min-h-12 rounded-lg px-3.25 py-3.5 gap-2",
                      "bg-(--color-bg-surface) border border-(--color-border-default)",
                    ) }>
                      <input
                        className={ cn(
                          "flex w-full h-fit px-0.5 py-px focus:outline-none cursor-not-allowed",
                          "font-normal text-[14px] text-(--color-text-primary) leading-[100%]",
                        ) }
                        value={ email }
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </form>

      <section className={ cn(
        "mt-auto flex w-full flex-wrap items-center justify-between gap-4 rounded-[10px] p-5",
        "border border-(--color-danger-default) bg-[#D92D201A] text-(--color-danger-default)",
      ) }>
        <div className="flex flex-col gap-1 w-142.5">
          <h3 className="flex w-full h-fit text-[14px] font-bold leading-[100%]">회원 탈퇴</h3>
          <p className="flex w-full h-fit text-[11px] font-normal leading-[16.5px]">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        <button
          type="button"
          className={ cn(
            "shrink-0 rounded-lg border bg-(--color-bg-surface) px-4 h-10.5",
            "text-[14px] font-bold leading-[100%]",
            "cursor-pointer",
          ) }
        >
          회원 탈퇴
        </button>
      </section>
    </main>

  );
}
