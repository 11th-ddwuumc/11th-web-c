import { useState } from 'react'
import Header from './components/header'
import MovieGrid from './components/movie-grid'
import Pagination from './components/pagination'
import { movies as initialMovies } from './data/movies'
import type { Movie } from './types/movie'
import './App.css'

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)

  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    )
  }

  return (
    <div className="app">
      <Header />
      <main className="main-container">
        <h1 className="page-title">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination currentPage={1} totalPages={5} />
      </main>
    </div>
  )
}

export default App
