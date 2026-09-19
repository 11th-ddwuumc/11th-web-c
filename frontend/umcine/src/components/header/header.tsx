import "./header.css";

export default function Header() {
  return (
    <header className="topbar">
      <div className="brandRow">
        <a className="brand" href="">
          <div className="logo">
            <img src="/icons/movie.svg" alt="Search"/>
          </div>
          <span className="logoText">UMCine</span>
        </a>

        <nav className="menu">
          <a className="selected" href="">영화</a>
          <a href="">검색</a>
          <a href="">내 정보</a>
        </nav>
      </div>

      <div className="topActions">
        <button className="searchButton" type="button">
          <svg width="24" height="24" viewBox="80 80 24 24" aria-hidden="true">
            <path
              d="M95.5 94H94.71L94.43 93.73C95.41 92.59 96 91.11 96 89.5C96 85.91 93.09 83 89.5 83C85.91 83 83 85.91 83 89.5C83 93.09 85.91 96 89.5 96C91.11 96 92.59 95.41 93.73 94.43L94 94.71V95.5L99 100.49L100.49 99L95.5 94ZM89.5 94C87.01 94 85 91.99 85 89.5C85 87.01 87.01 85 89.5 85C91.99 85 94 87.01 94 89.5C94 91.99 91.99 94 89.5 94Z"
              fill="currentColor"/>
          </svg>
        </button>

        <button className="loginButton" type="button">
          로그인
        </button>
      </div>
    </header>
  );
}