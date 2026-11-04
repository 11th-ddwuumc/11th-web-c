import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SortOrder = "latest" | "oldest";

interface UiStore {
  sortOrder: SortOrder;
  setSortOrder: (sortOrder: SortOrder) => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      sortOrder: "latest",

      setSortOrder: (sortOrder) =>
        set({
          sortOrder,
        }),
    }),
    {
      name: "umcine-ui-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
