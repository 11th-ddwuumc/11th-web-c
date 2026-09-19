import "./footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <img src="/images/logos/tmdb-logo.svg" alt="tmdb-logo"/>
      <div className="footer-text">
        This product uses the TMDB API but is not endorsed or certified by <a
        href="https://www.themoviedb.org/?language=ko" target="_blank">TMDB</a>.
      </div>
    </footer>
  )
}