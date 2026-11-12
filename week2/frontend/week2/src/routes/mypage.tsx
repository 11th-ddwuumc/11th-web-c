import React, { useState } from "react";

const INITIAL_PROFILE = {
  email: "name@example.com",
  nickname: "홍길동",
};

export const MyPage: React.FC = () => {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState(INITIAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);

  const isNicknameValid =
    draft.nickname.trim().length >= 2 && draft.nickname.trim().length <= 12;
  const showNicknameError = draft.nickname.length > 0 && !isNicknameValid;

  const handleEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isNicknameValid) return;
    setProfile({ ...draft, nickname: draft.nickname.trim() });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">내 정보</h1>

        {!isEditing ? (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-gray-900">이메일</p>
              <p className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900">
                {profile.email}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold text-gray-900">닉네임</p>
              <p className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900">
                {profile.nickname}
              </p>
            </div>

            <button
              type="button"
              onClick={handleEdit}
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-medium py-3 rounded-lg text-sm transition-colors mt-2"
            >
              수정하기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-gray-900"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={draft.email}
                disabled
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="nickname"
                className="block text-xs font-bold text-gray-900"
              >
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                value={draft.nickname}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, nickname: e.target.value }))
                }
                placeholder="2~12자"
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {showNicknameError && (
                <p className="text-xs text-red-500">
                  닉네임은 2~12자로 입력해 주세요.
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg text-sm transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!isNicknameValid}
                className="w-full bg-[#2563eb] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg text-sm transition-colors"
              >
                저장
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyPage;