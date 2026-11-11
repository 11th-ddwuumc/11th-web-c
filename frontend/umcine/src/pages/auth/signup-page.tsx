import {useState} from "react";
import {cn} from "../../utils/cn.ts";

import {checkEmailDuplicate} from "../../api/members/check-email-duplicate.ts";
import {checkNicknameDuplicate} from "../../api/members/check-nickname-duplicate.ts";
import {signup} from "../../api/members/signup.ts";

import {Link, useNavigate} from "@tanstack/react-router";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      // 로그인 페이지 연결 후 주석 해제
      navigate({to: "/login"});
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({...prev, [key]: DEFAULT_DUPLICATE_CHECK}));
    }
    setForm((prev) => ({...prev, [key]: value}));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: {isChecking: true, isAvailable: false},
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {...prev[key], isAvailable},
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {...prev[key], isAvailable: false},
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {...prev[key], isChecking: false},
      }));
    }
  };

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="flex w-full flex-1 justify-center items-center bg-(--color-bg-page)">
      <form onSubmit={handleSubmit} className="flex flex-col w-107.5 gap-4">
        <h1 className={cn(
          "flex w-full flex-col",
          "text-(--color-text-primary) font-bold text-[34px] leading-[100%] tracking-[-1_53]")}
        >
          회원가입
        </h1>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col w-full font-bold text-[13px] tracking-normal px-1">
            이메일
          </div>
          <div className={cn(
            "flex w-full min-h-12 rounded-lg border gap-2.25 pl-3.25 pr-3.25 pb-3.5 pt-3.5",
            "border-(--color-border-default) bg-(--color-bg-surface)"
          )}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              placeholder="name@example.com"
              className={cn(
                "box-border w-full",
                "px-0.5 py-px",
                "text-[14px] font-normal leading-none tracking-normal",
                "placeholder:text-(--color-text-tertiary)"
              )}
            />
            <button
              type="button"
              className="shrink-0 font-bold text-[12px] text-(--color-action-primary) cursor-pointer"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <div className="flex flex-col w-full px-1 font-normal text-[12px] text-(--color-danger-default)">
              이메일 형식을 확인해 주세요.
            </div>
          )}
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col w-full font-bold text-[13px] tracking-normal px-1">
            닉네임
          </div>
          <div className={cn(
            "flex w-full min-h-12 rounded-lg border gap-2.25 pl-3.25 pr-3.25 pb-3.5 pt-3.5",
            "border-(--color-border-default) bg-(--color-bg-surface)"
          )}>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              placeholder="2~12자"
              className={cn(
                "box-border w-full",
                "px-0.5 py-px",
                "text-[14px] font-normal leading-none tracking-normal",
                "placeholder:text-(--color-text-tertiary)"
              )}
            />
            <button
              type="button"
              className="shrink-0 font-bold text-[12px] text-(--color-action-primary) cursor-pointer"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <div className="flex flex-col w-full px-1 font-normal text-[12px] text-(--color-danger-default)">
              닉네임은 2~12자로 입력해 주세요.
            </div>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-col w-full font-bold text-[13px] tracking-normal px-1">
              비밀번호
            </div>
            <div className={cn(
              "flex w-full min-h-12 rounded-lg border gap-2.25 pl-3.25 pr-3.25 pb-3.5 pt-3.5",
              "border-(--color-border-default) bg-(--color-bg-surface)"
            )}>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                placeholder="8자 이상"
                className={cn(
                  "box-border w-full",
                  "px-0.5 py-px",
                  "text-[14px] font-normal leading-none tracking-normal",
                  "placeholder:text-(--color-text-tertiary)"
                )}
              />
            </div>
          </div>
          <div className="flex flex-col w-full px-1 font-normal text-[11px] text-(--color-text-tertiary)">
            영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
          </div>
          {showPasswordError && (
            <div className="flex flex-col w-full px-1 font-normal text-[12px] text-(--color-danger-default)">
              비밀번호를 다시 한번 확인해주세요.
            </div>
          )}
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col w-full font-bold text-[13px] tracking-normal px-1">
            비밀번호 확인
          </div>
          <div className={cn(
            "flex w-full min-h-12 rounded-lg border gap-2.25 pl-3.25 pr-3.25 pb-3.5 pt-3.5",
            "border-(--color-border-default) bg-(--color-bg-surface)"
          )}>
            <input
              type="password"
              value={form.passwordConfirm}
              onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
              placeholder="다시 입력"
              className={cn(
                "box-border w-full",
                "px-0.5 py-px",
                "text-[14px] font-normal leading-none tracking-normal",
                "placeholder:text-(--color-text-tertiary)"
              )}
            />
          </div>
          {showPasswordConfirmError && (
            <div className="flex flex-col w-full px-1 font-normal text-[12px] text-(--color-danger-default)">
              비밀번호가 일치하지 않아요.
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={cn(
            "flex w-full h-12 rounded-lg px-4 justify-center items-center shrink-0",
            "border border-(--color-bg-surface) bg-(--color-action-primary)",
            "font-bold text-(--color-bg-surface) text-[14px] cursor-pointer",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
        <footer className="flex w-full items-center justify-center text-[13px] text-(--color-text-secondary)">
          이미 계정이 있나요? &nbsp;
          <Link
            type="button"
            className="font-extrabold text-(--color-action-primary) text-[12px] cursor-pointer"
            to="/login"
          >
            로그인
          </Link>
        </footer>
      </form>
    </main>
  );
}