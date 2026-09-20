import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { Movie } from './types/movie';
import { movies as initialMovies } from './data/movies';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import MovieDetailPage from './components/MovieDetailPage';

export function App() {
  const [movieList, setMovieList] = useState<Movie[]>(initialMovies);

  const handleToggleBookmark = (id: number) => {
    setMovieList((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie
      )
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage movieList={movieList} onToggleBookmark={handleToggleBookmark} />}
      />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
    </Routes>
  );
}

export default App;