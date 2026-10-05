import { useState } from 'react'
import MovieGrid from '../../components/movie-grid'
import Pagination from '../../components/pagination'
import { movies as initialMovies } from '../../data/movies'
import type { Movie } from '../../types/movie'

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)

  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    )
  }

  return (
    <main className="flex flex-col gap-5 px-20 py-6">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 목록
      </h1>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination currentPage={1} totalPages={5} />
    </main>
  )
}
