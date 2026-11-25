import { useRef, useState, type ComponentProps } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useSignupMutation } from "../../hooks/use-signup-mutation";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  isNicknameValid,
} from "../../utils/auth-validation";
import "../../styles/auth.css";

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type Field = keyof typeof DEFAULT_FORM;
type DuplicateField = "email" | "nickname";

type CheckState = {
  isChecking: boolean;
  isAvailable: boolean;
  message: string;
};

const EMPTY_CHECK: CheckState = {
  isChecking: false,
  isAvailable: false,
  message: "",
};

export function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [checks, setChecks] = useState({
    email: EMPTY_CHECK,
    nickname: EMPTY_CHECK,
  });
  const [submitMessage, setSubmitMessage] = useState("");

  // mutation 상태가 화면에 반영되기 전의 연속 클릭도 막습니다.
  const locks = useRef({
    email: false,
    nickname: false,
    submit: false,
  });

  const valid = {
    email: EMAIL_REGEX.test(form.email.trim()),
    nickname: isNicknameValid(form.nickname),
    password: PASSWORD_REGEX.test(form.password),
    passwordConfirm:
      form.passwordConfirm.length > 0 && form.password === form.passwordConfirm,
  };

  const canSubmit =
    Object.values(valid).every(Boolean) &&
    checks.email.isAvailable &&
    checks.nickname.isAvailable &&
    !checks.email.isChecking &&
    !checks.nickname.isChecking;

  function handleChangeField(key: Field, value: string) {
    if (locks.current.submit) return;

    if (key === "email" || key === "nickname") {
      if (locks.current[key]) return;
      setChecks((prev) => ({ ...prev, [key]: { ...EMPTY_CHECK } }));
    }

    setSubmitMessage("");
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateField) {
    if (!valid[key] || locks.current[key] || locks.current.submit) return;

    locks.current[key] = true;

    const label = key === "email" ? "이메일" : "닉네임";
    const value = form[key].trim();

    setChecks((prev) => ({
      ...prev,
      [key]: { ...EMPTY_CHECK, isChecking: true },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(value)
          : await checkNicknameDuplicate(value);

      if (typeof response.available !== "boolean") {
        throw new Error("응답 형식 오류");
      }

      setChecks((prev) => ({
        ...prev,
        [key]: {
          isChecking: false,
          isAvailable: response.available,
          message: response.available
            ? `사용할 수 있는 ${label}이에요.`
            : `이미 사용 중인 ${label}이에요.`,
        },
      }));
    } catch {
      setChecks((prev) => ({
        ...prev,
        [key]: {
          ...EMPTY_CHECK,
          message:
            "중복 확인에 실패했어요. 서버 상태를 확인하고 다시 시도해 주세요.",
        },
      }));
    } finally {
      locks.current[key] = false;
    }
  }

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = (
    event,
  ) => {
    event.preventDefault();

    if (!canSubmit || signupMutation.isPending || locks.current.submit) {
      return;
    }

    locks.current.submit = true;
    setSubmitMessage("");

    signupMutation.mutate(
      {
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      },
      {
        onSuccess: async (response) => {
          // HTTP 요청은 성공했어도 서버의 회원가입 처리 결과는 실패일 수 있습니다.
          if (!response.isSuccess) {
            setSubmitMessage(response.message || "회원가입에 실패했어요.");
            setChecks({
              email: { ...EMPTY_CHECK },
              nickname: { ...EMPTY_CHECK },
            });
            return;
          }

          window.alert(response.message || "회원가입이 완료됐어요.");
          await navigate({ to: "/login" });
        },
        onError: () => {
          setSubmitMessage(
            "회원가입에 실패했어요. 입력값과 서버 상태를 확인해 주세요.",
          );
          setChecks({
            email: { ...EMPTY_CHECK },
            nickname: { ...EMPTY_CHECK },
          });
        },
        onSettled: () => {
          locks.current.submit = false;
        },
      },
    );
  };

  return (
    <main className="w7-page">
      <section className="w7-card">
        <h1>회원가입</h1>
        <p>정보를 입력하고 이메일과 닉네임 중복을 확인해 주세요.</p>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset disabled={signupMutation.isPending}>
            <label htmlFor="signup-email">이메일</label>
            <div className="w7-row">
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={form.email}
                disabled={checks.email.isChecking}
                aria-describedby="email-message"
                aria-invalid={form.email.length > 0 && !valid.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
              />
              <button
                type="button"
                disabled={!valid.email || checks.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
              >
                {checks.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            <p
              id="email-message"
              className={checks.email.isAvailable ? "w7-success" : "w7-error"}
              aria-live="polite"
            >
              {form.email.length > 0 && !valid.email
                ? "올바른 이메일 형식을 입력해 주세요."
                : checks.email.message}
            </p>

            <label htmlFor="signup-nickname">닉네임</label>
            <div className="w7-row">
              <input
                id="signup-nickname"
                autoComplete="nickname"
                value={form.nickname}
                disabled={checks.nickname.isChecking}
                aria-describedby="nickname-message"
                aria-invalid={form.nickname.length > 0 && !valid.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
              />
              <button
                type="button"
                disabled={!valid.nickname || checks.nickname.isChecking}
                onClick={() => handleCheckDuplicate("nickname")}
              >
                {checks.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            <p
              id="nickname-message"
              className={
                checks.nickname.isAvailable ? "w7-success" : "w7-error"
              }
              aria-live="polite"
            >
              {form.nickname.length > 0 && !valid.nickname
                ? "닉네임은 2~12자로 입력해 주세요."
                : checks.nickname.message}
            </p>

            <label htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              aria-describedby="password-message"
              aria-invalid={form.password.length > 0 && !valid.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
            />
            <p
              id="password-message"
              className={
                form.password.length > 0 && !valid.password
                  ? "w7-error"
                  : "w7-help"
              }
            >
              영문 대문자·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자
              이상 입력해 주세요. 다른 문자는 사용할 수 없어요.
            </p>

            <label htmlFor="signup-confirm">비밀번호 확인</label>
            <input
              id="signup-confirm"
              type="password"
              autoComplete="new-password"
              value={form.passwordConfirm}
              aria-describedby="confirm-message"
              aria-invalid={
                form.passwordConfirm.length > 0 && !valid.passwordConfirm
              }
              onChange={(e) =>
                handleChangeField("passwordConfirm", e.target.value)
              }
            />
            <p id="confirm-message" className="w7-error">
              {form.passwordConfirm.length > 0 && !valid.passwordConfirm
                ? "비밀번호가 일치하지 않아요."
                : ""}
            </p>

            <p role="status" className="w7-error">
              {submitMessage}
            </p>

            <button
              className="w7-primary"
              type="submit"
              disabled={!canSubmit || signupMutation.isPending}
            >
              {signupMutation.isPending ? "가입 중" : "가입하기"}
            </button>
          </fieldset>
        </form>

        <p>
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </section>
    </main>
  );
}
