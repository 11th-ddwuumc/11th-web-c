import type { Movie } from '../types/movie'
import MovieCard from './movie-card'
import './movie-grid.css'

interface MovieGridProps {
  movies: Movie[]
  onToggleBookmark: (id: number) => void
}

function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <ul className="movie-grid">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} onToggleBookmark={onToggleBookmark} />
        </li>
      ))}
    </ul>
  )
}

export default MovieGrid
