import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookmarkState {
  bookmarkedIds: number[];
  toggleBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedIds: [],
      toggleBookmark: (id) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.includes(id)
            ? state.bookmarkedIds.filter((bookmarkId) => bookmarkId !== id)
            : [...state.bookmarkedIds, id],
        })),
      isBookmarked: (id) => get().bookmarkedIds.includes(id),
    }),
    { name: 'umcine-bookmark-store' }
  )
);