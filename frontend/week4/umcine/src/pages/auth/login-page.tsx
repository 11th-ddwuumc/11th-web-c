import { useState, type ComponentProps } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { EMAIL_REGEX } from "../../utils/auth-validation";
import "../../styles/auth.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();

  const emailValid = EMAIL_REGEX.test(email.trim());
  const canSubmit = emailValid && password.length > 0;

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = (
    event,
  ) => {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <main className="w7-page">
      <section className="w7-card">
        <h1>로그인</h1>
        <p>이메일과 비밀번호를 입력해 주세요.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email">이메일</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            disabled={loginMutation.isPending}
            aria-invalid={email.length > 0 && !emailValid}
            onChange={(event) => {
              setEmail(event.target.value);
              loginMutation.reset();
            }}
          />
          <p className="w7-error">
            {email.length > 0 && !emailValid
              ? "올바른 이메일을 입력해 주세요."
              : ""}
          </p>

          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            disabled={loginMutation.isPending}
            onChange={(event) => {
              setPassword(event.target.value);
              loginMutation.reset();
            }}
          />

          <button
            type="submit"
            className="w7-primary"
            disabled={!canSubmit || loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>

          <p role="status" className="w7-error">
            {loginMutation.isError
              ? "로그인에 실패했어요. 이메일과 비밀번호를 확인해 주세요."
              : ""}
          </p>
        </form>

        <nav className="w7-links">
          <Link to="/signup">회원가입</Link>
          <Link to="/mypage">내 정보 화면 확인</Link>
        </nav>
      </section>
    </main>
  );
}
