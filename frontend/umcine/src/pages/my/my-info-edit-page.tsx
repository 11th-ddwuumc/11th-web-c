import { useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { useProfileStore } from "@/stores/profile-store";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

const labelClass = "text-[13px] font-extrabold text-text-primary";
const fieldClass =
  "flex min-h-12 w-full items-center gap-2 rounded-8 border border-border-default bg-bg-surface px-[13px] py-3.5";
const inputClass = "min-w-0 flex-1 px-0.5 text-[14px] text-text-primary outline-none";

export function MyInfoEditPage() {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState(profile.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(profile.profileImageUrl);
  const [nicknameCheck, setNicknameCheck] = useState({ isChecking: false, isAvailable: false });

  const trimmedNickname = nickname.trim();
  const isNicknameValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== profile.nickname;
  const isImageChanged = profileImageUrl !== profile.profileImageUrl;

  // 닉네임을 바꿨다면 중복 확인을 통과해야 저장할 수 있다.
  const canSave =
    isNicknameValid &&
    (isNicknameChanged || isImageChanged) &&
    (!isNicknameChanged || nicknameCheck.isAvailable) &&
    !nicknameCheck.isChecking;

  const handleChangeNickname = (value: string) => {
    if (nicknameCheck.isChecking) return;
    setNicknameCheck({ isChecking: false, isAvailable: false });
    setNickname(value);
  };

  const handleCheckNickname = async () => {
    if (!isNicknameValid || !isNicknameChanged || nicknameCheck.isChecking) return;

    setNicknameCheck({ isChecking: true, isAvailable: false });
    try {
      const { available } = await checkNicknameDuplicate(trimmedNickname);
      setNicknameCheck({ isChecking: false, isAvailable: available });
      alert(available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setNicknameCheck({ isChecking: false, isAvailable: false });
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 골라도 change 이벤트가 발생하도록 비워 둔다.
    e.target.value = "";
    if (!file) return;

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      alert("프로필 이미지는 최대 5MB까지 올릴 수 있어요.");
      return;
    }
    setProfileImageUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!canSave) return;
    // 8주차에서 내 정보 수정 API 연결
    updateProfile({ nickname: trimmedNickname, profileImageUrl });
    navigate({ to: "/my" });
  };

  return (
    <main className="flex flex-1 flex-col gap-8 px-20 py-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[9px]">
          <h1 className="text-[31px] font-bold tracking-[-1.24px] text-text-primary">내 정보 수정</h1>
          <p className="text-[14px] leading-[22.4px] text-text-secondary">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="submit"
          form="profile-form"
          disabled={!canSave}
          className="flex h-10.5 items-center justify-center rounded-8 border border-bg-surface bg-action-primary px-4 text-[14px] font-extrabold text-bg-surface hover:bg-action-hover disabled:bg-action-disabled"
        >
          변경사항 저장
        </button>
      </div>

      <form
        id="profile-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="flex items-center"
      >
        <div className="flex h-[133px] flex-1 flex-col items-center justify-center gap-1">
          <div className="relative size-[82px]">
            <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-border-default">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="프로필 이미지 미리보기" className="size-full object-cover" />
              ) : (
                <img src="/icons/person-avatar.svg" alt="" width={48} height={48} />
              )}
            </span>
            <button
              type="button"
              aria-label="프로필 이미지 변경"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-0 bottom-0"
            >
              <img src="/icons/edit.svg" alt="" width={24} height={24} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="hidden"
            />
          </div>
          <p className="text-[15px] font-bold text-text-primary">프로필 이미지</p>
          <p className="text-[11px] text-text-tertiary">선택 사항 · 최대 5MB</p>
        </div>

        <div className="flex flex-1 flex-col gap-[17px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="profile-nickname" className={labelClass}>
              닉네임
            </label>
            <div className={`${fieldClass} focus-within:border-text-primary`}>
              <input
                id="profile-nickname"
                type="text"
                value={nickname}
                onChange={(e) => handleChangeNickname(e.target.value)}
                disabled={nicknameCheck.isChecking}
                className={inputClass}
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={!isNicknameValid || !isNicknameChanged || nicknameCheck.isChecking}
                className="shrink-0 text-[12px] font-extrabold text-action-primary disabled:text-text-tertiary"
              >
                {nicknameCheck.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {nickname.length > 0 && !isNicknameValid && (
              <p className="text-[12px] text-danger-default">
                닉네임은 2자 이상 12자 이하로 입력해 주세요.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-px">
            <label htmlFor="profile-email" className={labelClass}>
              이메일
            </label>
            <div className={fieldClass}>
              <input
                id="profile-email"
                type="email"
                value={profile.email}
                readOnly
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </form>

      <section className="mt-auto flex items-center justify-between rounded-10 border border-danger-default bg-danger-default/10 p-5">
        <div className="flex w-[570px] flex-col gap-1">
          <h3 className="text-[14px] font-bold text-danger-default">회원 탈퇴</h3>
          <p className="text-[11px] leading-[16.5px] text-danger-default">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        <button
          type="button"
          className="flex h-10.5 items-center justify-center rounded-8 border border-danger-default bg-bg-surface px-4 text-[14px] font-extrabold text-danger-default"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
