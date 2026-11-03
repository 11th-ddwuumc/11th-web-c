import {useBookmarkStore} from "../stores/bookmark-store";
import {cn} from "../utils/cn.ts";

interface BookmarkButtonProps {
  variant: "detail" | "card";
  movieId: number;
}

export function BookmarkButton(props: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(props.movieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  if (props.variant === "detail") {
    return (
      <button
        type="button"
        aria-pressed={isBookmarked}
        aria-label={isBookmarked ? `북마크 해제` : `북마크 추가`}
        className={cn(
          "flex px-4 gap-2 w-fit h-10.5 items-center cursor-pointer",
          "rounded-lg bg-(--color-action-primary) text-(--color-bg-surface)"
        )}
        onClick={() => toggleBookmark(props.movieId)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M11.333 2C11.6866 2 12.0258 2.14048 12.2758 2.39052C12.5259 2.64057 12.6663 2.97971 12.6663 3.33333V13.3333C12.6663 13.4501 12.6356 13.5648 12.5773 13.6659C12.519 13.7671 12.4352 13.8512 12.3342 13.9098C12.2333 13.9683 12.1187 13.9994 12.0019 13.9998C11.8852 14.0002 11.7704 13.9699 11.669 13.912L8.66101 12.1933C8.45959 12.0783 8.23164 12.0178 7.99967 12.0178C7.76771 12.0178 7.53976 12.0783 7.33834 12.1933L4.33034 13.912C4.22897 13.9699 4.11417 14.0002 3.99742 13.9998C3.88068 13.9994 3.76608 13.9683 3.6651 13.9098C3.56412 13.8512 3.4803 13.7671 3.42202 13.6659C3.36374 13.5648 3.33305 13.4501 3.33301 13.3333V3.33333C3.33301 2.97971 3.47348 2.64057 3.72353 2.39052C3.97358 2.14048 4.31272 2 4.66634 2H11.333Z"
            fill={isBookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[14px] font-extrabold">
          즐겨찾기
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "absolute right-2 top-2 z-10",
        "grid size-8.5 place-items-center",
        "rounded-lg p-0",
        "cursor-pointer border text-white",
        "transition-colors",
        isBookmarked
          ? "border-blue-600 bg-blue-600"
          : "border-white bg-(--color-text-primary)",
      )}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? `북마크 해제` : `북마크 추가`}
      onClick={() => toggleBookmark(props.movieId)}
    >
      <svg
        className="size-6 fill-current"
        viewBox={isBookmarked ? "80 32 24 24" : "32 32 24 24"}
      >
        <path
          d={`${isBookmarked
            ? "M97 35H87C85.9 35 85.01 35.9 85.01 37L85 53L92 50L99 53V37C99 35.9 98.1 35 97 35Z"
            : "M49 35H39C37.9 35 37.01 35.9 37.01 37L37 53L44 50L51 53V37C51 35.9 50.1 35 49 35ZM49 50L44 47.82L39 50V37H49V50Z"} `}
        />
      </svg>
    </button>
  );
}