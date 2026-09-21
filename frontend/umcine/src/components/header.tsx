import './header.css'

const menuItems = [
  { label: '영화', isActive: true },
  { label: '검색', isActive: false },
  { label: '내 정보', isActive: false },
]

function Header() {
  return (
    <header className="topbar">
      <div className="brand-row">
        <a className="brand" href="/">
          <span className="brand-mark">
            <img src="/icons/movie.svg" alt="" width={24} height={24} />
          </span>
          <span className="brand-name">UMCine</span>
        </a>
        <nav aria-label="주요 메뉴">
          <ul className="main-menu">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className={item.isActive ? 'menu-link is-active' : 'menu-link'}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="top-actions">
        <button type="button" className="search-button" aria-label="영화 검색">
          <img src="/icons/search.svg" alt="" width={24} height={24} />
        </button>
        <button type="button" className="login-button">
          로그인
        </button>
      </div>
    </header>
  )
}

export default Header
