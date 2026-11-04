import React, { useState } from 'react';
import { Link, getRouteApi } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Header } from './header';
import { searchMovies } from '../api/movies/search-movies';
import { useBookmarkStore } from '../store/useBookmarkStore';

const routeApi = getRouteApi('/search');
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';

export const SearchPage: React.FC = () => {
  const { query } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const trimmed = query.trim();

  const [keyword, setKeyword] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setKeyword(query);
  }

  const bookmarkedIds = useBookmarkStore((state) => state.bookmarkedIds);

  const { data, isPending, isError } = useQuery({
    queryKey: ['movies', 'search', { query: trimmed }],
    queryFn: () => searchMovies({ query: trimmed }),
    enabled: !!trimmed,
    staleTime: 1000 * 60 * 5,
  });

  const results = data?.results ?? [];
  const totalResults = data?.total_results ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: { query: keyword.trim() } });
  };

  const handleReset = () => {
    setKeyword('');
    navigate({ search: { query: '' } });
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      <Header />

      <main className="max-w-6xl w-full mx-auto px-8 py-10 flex-1">
        <h1 className="text-2xl font-bold text-white mb-6">영화 검색</h1>

        <form
          onSubmit={handleSearch}
          className="w-full bg-white rounded-xl shadow-md p-2 pl-5 flex items-center gap-3"
        >
          <img src="/icons/search.svg" alt="search" className="w-5 h-5 shrink-0 opacity-60" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 스파이더맨"
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-base focus:outline-none py-2"
          />
          {keyword && (
            <button type="button" onClick={handleReset} className="shrink-0" aria-label="clear">
              <img src="/icons/close.svg" alt="clear" className="w-4 h-4 opacity-50 hover:opacity-80" />
            </button>
          )}
          <button
            type="submit"
            className="bg-[#111827] hover:bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shrink-0"
          >
            다시 검색
          </button>
        </form>

        {!trimmed ? (
          <p className="text-gray-400 text-center py-16">검색어를 입력해 주세요.</p>
        ) : (
          <div className="mt-8">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-6">
              <h2 className="text-white font-semibold">'{trimmed}' 검색 결과</h2>
              {!isPending && !isError && (
                <span className="text-gray-400 text-sm">
                  영화 {totalResults}편 · 1페이지
                </span>
              )}
            </div>

            {isPending ? (
              <p className="text-gray-400 text-center py-16">검색 중...</p>
            ) : isError ? (
              <p className="text-red-400 text-center py-16">검색 결과를 불러오지 못했어요.</p>
            ) : results.length === 0 ? (
              <p className="text-gray-400 text-center py-16">검색 결과가 없어요.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {results.map((movie) => {
                  const isBookmarked = bookmarkedIds.includes(movie.id);
                  return (
                    <div key={movie.id} className="flex gap-4 border-b border-gray-800 pb-6">
                      <div className="relative w-28 h-40 shrink-0">
                        {movie.poster_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                            alt={movie.title}
                            className="w-28 h-40 object-cover rounded-lg bg-gray-700"
                          />
                        ) : (
                          <div className="w-28 h-40 rounded-lg bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                            이미지 없음
                          </div>
                        )}
                        <img
                          src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
                          alt="bookmark"
                          className="absolute top-2 right-2 w-5 h-5"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-white font-bold text-lg">{movie.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {movie.original_title} · {movie.release_date}
                        </p>
                        <p className="text-gray-300 text-sm line-clamp-3">{movie.overview}</p>
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium mt-3"
                        >
                          상세 보기
                          <img src="/icons/arrow-right.svg" alt="" className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-4 text-center text-xs text-gray-400">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
};

export default SearchPage;