import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>회원가입</h1>

      <div>
        <label htmlFor="email">이메일</label>
        <div>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChangeField("email", e.target.value)}
            placeholder="example@email.com"
          />
          <button
            type="button"
            onClick={() => handleCheckDuplicate("email")}
            disabled={!isEmailValid || duplicateCheck.email.isChecking}
          >
            {duplicateCheck.email.isChecking ? "확인 중..." : "중복 확인"}
          </button>
        </div>
        {showEmailError && <p>올바른 이메일 형식이 아니에요.</p>}
        {duplicateCheck.email.isAvailable && <p>사용 가능한 이메일이에요.</p>}
      </div>

      <div>
        <label htmlFor="nickname">닉네임</label>
        <div>
          <input
            id="nickname"
            type="text"
            value={form.nickname}
            onChange={(e) => handleChangeField("nickname", e.target.value)}
            placeholder="2~12자"
          />
          <button
            type="button"
            onClick={() => handleCheckDuplicate("nickname")}
            disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
          >
            {duplicateCheck.nickname.isChecking ? "확인 중..." : "중복 확인"}
          </button>
        </div>
        {showNicknameError && <p>닉네임은 2~12자로 입력해 주세요.</p>}
        {duplicateCheck.nickname.isAvailable && <p>사용 가능한 닉네임이에요.</p>}
      </div>

      <div>
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => handleChangeField("password", e.target.value)}
          placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상"
        />
        {showPasswordError && (
          <p>영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.</p>
        )}
      </div>

      <div>
        <label htmlFor="passwordConfirm">비밀번호 확인</label>
        <input
          id="passwordConfirm"
          type="password"
          value={form.passwordConfirm}
          onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
          placeholder="비밀번호를 다시 입력해 주세요"
        />
        {showPasswordConfirmError && <p>비밀번호가 일치하지 않아요.</p>}
      </div>

      <button type="submit" disabled={!canSubmit}>
        가입하기
      </button>
    </form>
  );
}