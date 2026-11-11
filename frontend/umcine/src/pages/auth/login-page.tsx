import {useState} from "react";
import {cn} from "../../utils/cn.ts";
import {login} from "../../api/members/login.ts";
import {Link, useNavigate} from "@tanstack/react-router";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const navigate = useNavigate();

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const canSubmit = isEmailValid && form.password.length > 0;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });
      alert(response.message);
      navigate({to: "/"});
    } catch {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    setForm((prev) => ({...prev, [key]: value}));
  };

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="flex w-full flex-1 justify-center items-center bg-(--color-bg-page)">
      <form onSubmit={handleSubmit} className="flex flex-col w-107.5 gap-4">
        <h1 className={cn(
          "flex w-full flex-col",
          "text-(--color-text-primary) font-bold text-[34px] leading-[100%] tracking-[-1_53]")}
        >
          로그인
        </h1>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col w-full font-bold text-[13px] tracking-normal px-1">
            이메일
          </div>
          <div className={cn(
            "flex w-full min-h-12 rounded-lg border gap-1 pl-3.25 pr-3.25 pb-3.5 pt-3.5",
            "border-(--color-border-default) bg-(--color-bg-surface)"
          )}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_98_765)">
                <path
                  d="M13.333 2.66699H2.66634C1.93301 2.66699 1.33967 3.26699 1.33967 4.00033L1.33301 12.0003C1.33301 12.7337 1.93301 13.3337 2.66634 13.3337H13.333C14.0663 13.3337 14.6663 12.7337 14.6663 12.0003V4.00033C14.6663 3.26699 14.0663 2.66699 13.333 2.66699ZM13.333 12.0003H2.66634V5.33366L7.99967 8.66699L13.333 5.33366V12.0003ZM7.99967 7.33366L2.66634 4.00033H13.333L7.99967 7.33366Z"
                  fill="#606774"/>
              </g>
              <defs>
                <clipPath id="clip0_98_765">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
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
          </div>
          {showEmailError && (
            <div className="flex flex-col w-full px-1 font-normal text-[12px] text-(--color-danger-default)">
              이메일 형식을 확인해 주세요.
            </div>
          )}
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col w-full font-bold text-[13px] tracking-normal px-1">
            비밀번호
          </div>
          <div className={cn(
            "flex w-full min-h-12 rounded-lg border gap-2.25 pl-3.25 pr-3.25 pb-3.5 pt-3.5",
            "border-(--color-border-default) bg-(--color-bg-surface)"
          )}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.00033 11.3337C8.73366 11.3337 9.33366 10.7337 9.33366 10.0003C9.33366 9.26699 8.73366 8.66699 8.00033 8.66699C7.26699 8.66699 6.66699 9.26699 6.66699 10.0003C6.66699 10.7337 7.26699 11.3337 8.00033 11.3337ZM12.0003 5.33366H11.3337V4.00033C11.3337 2.16033 9.84033 0.666992 8.00033 0.666992C6.16033 0.666992 4.66699 2.16033 4.66699 4.00033V5.33366H4.00033C3.26699 5.33366 2.66699 5.93366 2.66699 6.66699V13.3337C2.66699 14.067 3.26699 14.667 4.00033 14.667H12.0003C12.7337 14.667 13.3337 14.067 13.3337 13.3337V6.66699C13.3337 5.93366 12.7337 5.33366 12.0003 5.33366ZM5.93366 4.00033C5.93366 2.86033 6.86033 1.93366 8.00033 1.93366C9.14033 1.93366 10.067 2.86033 10.067 4.00033V5.33366H5.93366V4.00033ZM12.0003 13.3337H4.00033V6.66699H12.0003V13.3337Z"
                fill="#606774"/>
            </svg>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              placeholder="비밀번호"
              className={cn(
                "box-border w-full",
                "px-0.5 py-px",
                "text-[14px] font-normal leading-none tracking-normal",
                "placeholder:text-(--color-text-tertiary)"
              )}
            />
          </div>
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
          {isSubmitting ? "로그인 중" : "로그인"}
        </button>
        <footer className="flex w-full items-center justify-center text-[13px] text-(--color-text-secondary)">
          처음이신가요? &nbsp;
          <Link
            type="button"
            className="font-extrabold text-(--color-action-primary) text-[12px] cursor-pointer"
            to="/signup"
          >
            회원가입
          </Link>
        </footer>
      </form>
    </main>
  );
}