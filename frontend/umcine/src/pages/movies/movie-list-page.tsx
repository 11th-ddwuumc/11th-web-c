import {movies} from "../../data/movies.ts";
import {MovieCard} from "../../components/movies/movie-card.tsx";
import Footer from "../../components/movies/footer.tsx";
import {useState} from "react";
import {cn} from "../../utils/cn.ts";

export default function MovieListPage() {
  const [movieList, setMovieList] = useState(movies);

  const toggleBookmark = (id: number) => {
    setMovieList((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === id ? {...movie, isBookmarked: !movie.isBookmarked} : movie
      )
    );
  }

  return (
    <main className={cn(
      "min-h-[calc(100vh-90px)] w-full bg-(--color-bg-page) pb-14.25",
    )}>
      <div className={cn(
        "flex w-full flex-col gap-5 px-20 py-6",
        "max-[750px]:p-6",
        "max-[480px]:px-4 max-[480px]:py-6",
      )}>
        <h1 className={cn(
          "m-0 self-start",
          "text-[38px] leading-11 font-bold tracking-[-1.71px]",
          "text-(--color-text-primary)",
        )}>영화 목록</h1>
        <ul className={cn(
          "m-0 grid w-full list-none grid-cols-5 p-0",
          "gap-x-5 gap-y-6",
          "max-[1100px]:grid-cols-3",
          "max-[750px]:grid-cols-2",
          "max-[480px]:grid-cols-1",
        )}>
          {movieList.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} onToggleBookmark={toggleBookmark}/>
            </li>
          ))}
        </ul>
      </div>
      <div className="fixed bottom-0 left-0 z-20 w-full">
        <Footer/>
      </div>
    </main>
  );
}
