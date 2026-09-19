import {movies} from "../data/movies.ts";
import MovieCard from "../components/movie-card/movie-card.tsx";
import "./movie-list-page.css"
import {useState} from "react";

function MovieListPage() {
  const [movieList, setMovieList] = useState(movies);

  const toggleBookmark = (id: number) => {
    setMovieList((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === id ? {...movie, isBookmarked: !movie.isBookmarked} : movie
      )
    );
  }

  return (
    <main className="container">
      <h1 className="page-title">영화 목록</h1>
      <ul className="movie-grid">
        {movieList.map((movie) => (
          <li key={movie.id}>
            <MovieCard movie={movie} onToggleBookmark={toggleBookmark}/>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default MovieListPage;