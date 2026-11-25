import { useState, type ComponentProps } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";
import "../../styles/auth.css";

interface EditFormProps {
  initialNickname: string;
}

function EditForm({ initialNickname }: EditFormProps) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(initialNickname);
  const updateMeMutation = useUpdateMeMutation();

  const trimmedNickname = nickname.trim();
  const canSubmit = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = (
    event,
  ) => {
    event.preventDefault();

    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      {
        onSuccess: () => {
          void navigate({ to: "/mypage" });
        },
      },
    );
  };

  return (
    <main className="w7-page">
      <section className="w7-card">
        <h1>내 정보 수정</h1>
        <p>변경할 닉네임을 입력해 주세요.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="edit-nickname">닉네임</label>
          <input
            id="edit-nickname"
            value={nickname}
            disabled={updateMeMutation.isPending}
            aria-invalid={nickname.length > 0 && !canSubmit}
            onChange={(event) => {
              setNickname(event.target.value);
              updateMeMutation.reset();
            }}
          />

          <p className="w7-help">닉네임은 2~12자로 입력해 주세요.</p>

          {updateMeMutation.isError && (
            <p className="w7-error" role="alert">
              수정에 실패했어요. 다시 시도해 주세요.
            </p>
          )}

          <button
            className="w7-primary"
            type="submit"
            disabled={!canSubmit || updateMeMutation.isPending}
          >
            {updateMeMutation.isPending ? "저장 중" : "저장"}
          </button>
        </form>

        <nav className="w7-links">
          <Link to="/mypage">취소</Link>
        </nav>
      </section>
    </main>
  );
}

export function MyEditPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (!accessToken) {
    return (
      <main className="w7-page">
        <section className="w7-card">
          <h1>내 정보 수정</h1>
          <p>내 정보를 수정하려면 로그인해 주세요.</p>
          <Link to="/login">로그인</Link>
        </section>
      </main>
    );
  }

  if (meQuery.isLoading) {
    return (
      <main className="w7-page">
        <section className="w7-card">
          <p>내 정보를 불러오는 중이에요.</p>
        </section>
      </main>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <main className="w7-page">
        <section className="w7-card">
          <p role="alert">내 정보를 불러오지 못했어요.</p>
          <button type="button" onClick={() => void meQuery.refetch()}>
            다시 시도
          </button>
        </section>
      </main>
    );
  }

  return <EditForm initialNickname={meQuery.data.nickname} />;
}
