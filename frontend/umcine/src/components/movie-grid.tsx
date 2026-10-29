import MovieCard, { type MovieCardData } from './movie-card'

interface MovieGridProps {
  movies: MovieCardData[]
  onToggleBookmark: (id: number) => void
}

function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <ul className="grid w-full grid-cols-5 gap-x-[18px] gap-y-5">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} onToggleBookmark={onToggleBookmark} />
        </li>
      ))}
    </ul>
  )
}

export default MovieGrid
