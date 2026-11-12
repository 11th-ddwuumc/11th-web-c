import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

const labelClass = "text-[13px] font-extrabold text-text-primary";
const fieldClass =
  "flex min-h-12 w-full items-center gap-1 rounded-8 border border-border-default bg-bg-surface px-[13px] py-3.5 focus-within:border-text-primary";
const inputClass =
  "min-w-0 flex-1 px-0.5 text-[14px] text-text-primary outline-none placeholder:text-text-tertiary";

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 8주차에서 로그인 API 연결
  };

  return (
    <main className="flex flex-1 items-center justify-center px-20 py-10">
      <form onSubmit={handleSubmit} noValidate className="flex w-[430px] flex-col gap-4">
        <h1 className="text-[34px] font-bold tracking-[-1.53px] text-text-primary">로그인</h1>

        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className={labelClass}>
            이메일
          </label>
          <div className={fieldClass}>
            <img src="/icons/mail-outline.svg" alt="" className="size-4 shrink-0" />
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="login-password" className={labelClass}>
            비밀번호
          </label>
          <div className={fieldClass}>
            <span className="relative size-4 shrink-0">
              <img
                src="/icons/lock-outline.svg"
                alt=""
                className="absolute top-[4.17%] left-[16.67%]"
              />
            </span>
            <input
              id="login-password"
              type="password"
              placeholder="비밀번호"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-8 border border-bg-surface bg-action-primary px-4 text-[14px] font-extrabold text-bg-surface hover:bg-action-hover"
        >
          로그인
        </button>

        <p className="flex items-end justify-center pt-[5px] text-[13px] text-text-secondary">
          처음이신가요?&nbsp;
          <Link to="/signup" className="text-[12px] font-extrabold text-action-primary">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
