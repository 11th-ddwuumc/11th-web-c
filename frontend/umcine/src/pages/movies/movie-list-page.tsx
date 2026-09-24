import {movies} from "../../data/movies.ts";
import MovieCard from "../../components/movies/movie-card.tsx";
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
    <main className={cn("w-full bg-(--color-bg-page)")}>
      <div className={cn(
        "flex w-full flex-col gap-[20px] px-[80px] py-[24px]",
        "max-[750px]:p-[24px]",
        "max-[480px]:px-[16px] max-[480px]:py-[24px]",
      )}>
        <h1 className={cn(
          "m-0 self-start",
          "text-[38px] leading-[44px] font-[700] tracking-[-1.71px]",
          "text-(--color-text-primary)",
        )}>영화 목록</h1>
        <ul className={cn(
          "m-0 grid w-full list-none grid-cols-5 p-0",
          "gap-x-[20px] gap-y-[24px]",
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
      <Footer/>
    </main>
  );
}