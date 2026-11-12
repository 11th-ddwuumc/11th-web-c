import { create } from "zustand";

// 8주차에서 내 정보 조회·수정 API를 연결하기 전까지 쓰는 임시 프로필 상태
interface Profile {
  nickname: string;
  email: string;
  profileImageUrl: string | null;
}

interface ProfileStore {
  profile: Profile;
  updateProfile: (next: Pick<Profile, "nickname" | "profileImageUrl">) => void;
}

export const useProfileStore = create<ProfileStore>()((set) => ({
  profile: {
    nickname: "gs0428",
    email: "gwangsoo@cinemalab.kr",
    profileImageUrl: null,
  },
  updateProfile: (next) =>
    set((state) => ({ profile: { ...state.profile, ...next } })),
}));
