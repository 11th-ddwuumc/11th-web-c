import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Rating } from "@/api/ratings/models";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useMyMemberId,
  useMyRatingsQuery,
  useUpdateRatingMutation,
} from "@/hooks/use-ratings";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/auth-store";

const MAX_COMMENT_LENGTH = 500;
const SCORES = [1, 2, 3, 4, 5];

const sectionClass = "flex w-full flex-col gap-4 border-t border-border-default px-20 py-6";
const titleClass = "text-[17px] font-bold text-text-primary";
const primaryButtonClass =
  "flex h-10.5 items-center justify-center rounded-8 bg-action-primary px-4 text-[14px] font-extrabold text-bg-surface hover:bg-action-hover disabled:bg-action-disabled";
const secondaryButtonClass =
  "flex h-10.5 items-center justify-center rounded-8 border border-border-default bg-bg-surface px-4 text-[14px] font-bold text-text-primary disabled:text-text-tertiary";

interface MovieRatingSectionProps {
  movieId: number;
}

export function MovieRatingSection({ movieId }: MovieRatingSectionProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = useMyMemberId();
  const ratingsQuery = useMyRatingsQuery();

  if (!accessToken) {
    return (
      <section className={sectionClass}>
        <h2 className={titleClass}>내 평점</h2>
        <p className="text-[14px] text-text-secondary">
          <Link to="/login" className="font-extrabold text-action-primary">
            로그인
          </Link>
          하면 평점을 남길 수 있어요.
        </p>
      </section>
    );
  }

  if (memberId === null) {
    return (
      <section className={sectionClass}>
        <h2 className={titleClass}>내 평점</h2>
        <p className="text-[14px] text-danger-default">회원 정보를 확인하지 못했어요. 다시 로그인해 주세요.</p>
      </section>
    );
  }

  return (
    <section className={sectionClass}>
      <h2 className={titleClass}>내 평점</h2>
      {ratingsQuery.isPending ? (
        <p className="text-[14px] text-text-secondary">평점을 불러오는 중이에요.</p>
      ) : ratingsQuery.isError ? (
        <p className="text-[14px] text-danger-default">평점을 불러오지 못했어요.</p>
      ) : (
        <MyRating
          // 평점이 생기거나 지워지면 폼 상태를 새로 시작한다.
          key={ratingsQuery.data.find((rating) => rating.movieId === movieId)?.ratingId ?? "new"}
          movieId={movieId}
          rating={ratingsQuery.data.find((rating) => rating.movieId === movieId)}
        />
      )}
    </section>
  );
}

interface MyRatingProps {
  movieId: number;
  rating: Rating | undefined;
}

function MyRating({ movieId, rating }: MyRatingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");

  const createRatingMutation = useCreateRatingMutation();
  const updateRatingMutation = useUpdateRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();

  const isSaving = createRatingMutation.isPending || updateRatingMutation.isPending;
  const trimmedComment = comment.trim();
  const canSubmit = score >= 1 && score <= 5 && comment.length <= MAX_COMMENT_LENGTH && !isSaving;

  const handleStartEdit = () => {
    setScore(rating?.score ?? 0);
    setComment(rating?.comment ?? "");
    setIsEditing(true);
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    // 후기를 비우면 보내지 않는다. 수정에서는 기존 후기가 null로 바뀐다.
    const body = { score, ...(trimmedComment ? { comment: trimmedComment } : {}) };

    if (rating) {
      updateRatingMutation.mutate(
        { ratingId: rating.ratingId, ...body },
        { onSuccess: () => setIsEditing(false) },
      );
    } else {
      createRatingMutation.mutate({ movieId, ...body });
    }
  };

  const handleDelete = () => {
    if (!rating || deleteRatingMutation.isPending) return;
    if (!confirm("평점을 삭제할까요?")) return;
    deleteRatingMutation.mutate(rating.ratingId);
  };

  if (rating && !isEditing) {
    return (
      <div className="flex flex-col gap-3">
        <ScoreStars score={rating.score} />
        <p className="text-[14px] leading-[24px] text-text-secondary">
          {rating.comment || "작성한 후기가 없어요."}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={handleStartEdit} className={secondaryButtonClass}>
            수정
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteRatingMutation.isPending}
            className={cn(secondaryButtonClass, "border-danger-default text-danger-default")}
          >
            {deleteRatingMutation.isPending ? "삭제 중" : "삭제"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-[640px] flex-col gap-3">
      <ScoreStars score={score} onChange={isSaving ? undefined : setScore} />
      <div className="flex flex-col gap-1">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="후기를 남겨 주세요 (선택)"
          rows={3}
          disabled={isSaving}
          className="w-full resize-none rounded-8 border border-border-default bg-bg-surface px-3.5 py-3 text-[14px] text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-primary"
        />
        <p
          className={cn(
            "self-end text-[12px]",
            comment.length > MAX_COMMENT_LENGTH ? "text-danger-default" : "text-text-tertiary",
          )}
        >
          {comment.length} / {MAX_COMMENT_LENGTH}
        </p>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
          {isSaving ? "저장 중" : rating ? "수정 저장" : "평점 등록"}
        </button>
        {rating && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
            className={secondaryButtonClass}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}

interface ScoreStarsProps {
  score: number;
  onChange?: (score: number) => void;
}

function ScoreStars({ score, onChange }: ScoreStarsProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`별점 ${score}점`}>
      {SCORES.map((value) => {
        const star = (
          <span className={cn("text-[24px]", value <= score ? "text-action-primary" : "text-border-default")}>
            ★
          </span>
        );
        return onChange ? (
          <button
            key={value}
            type="button"
            aria-label={`${value}점`}
            aria-pressed={value === score}
            onClick={() => onChange(value)}
          >
            {star}
          </button>
        ) : (
          <span key={value}>{star}</span>
        );
      })}
      <span className="ml-1 text-[14px] font-bold text-text-primary">{score > 0 ? `${score}점` : "별점 선택"}</span>
    </div>
  );
}
