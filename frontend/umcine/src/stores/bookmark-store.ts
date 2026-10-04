import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",  // 저장 시 사용하는 키
      storage: createJSONStorage(() => localStorage),  // 사용할 저장소
      partialize: (state) => ({  // 저장할 값
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
    },
  ),
);