import { Link } from "@tanstack/react-router";
import { useMemberDemo } from "./member-demo-context";
import "../../styles/auth.css";

export function MyPage() {
  const { member } = useMemberDemo();
  return (
    <main className="w7-page">
      <section className="w7-card">
        <h1>내 정보</h1>
        <p>화면 실습용 예시 정보예요. 서버에서 조회한 회원 정보가 아니에요.</p>
        <dl className="w7-profile">
          <dt>이메일</dt>
          <dd>{member.email}</dd>
          <dt>닉네임</dt>
          <dd>{member.nickname}</dd>
        </dl>
        <nav className="w7-links">
          <Link to="/mypage/edit">정보 수정</Link>
          <Link to="/login">로그인 화면</Link>
        </nav>
      </section>
    </main>
  );
}
