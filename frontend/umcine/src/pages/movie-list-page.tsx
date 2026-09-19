import {movies} from "../data/movies.ts";
import MovieCard from "../components/movie-card/movie-card.tsx";
import "./movie-list-page.css"

function MovieListPage() {
  return (
    <main className="container">
      <h1 className="page-title">영화 목록</h1>
      <ul className="movie-grid">
        {movies.map((movie) => (
          <li key={movie.id}>
            <MovieCard movie={movie}/>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default MovieListPage;