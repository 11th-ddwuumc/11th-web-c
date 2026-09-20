import React, { useState } from 'react';
import { Header } from './header';
import { movies } from '../data/movies';
import type { Movie } from '../types/movie';

export const SearchPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    const filtered = movies.filter(
      (movie) =>
        movie.title.includes(keyword.trim()) ||
        movie.originalTitle.toLowerCase().includes(keyword.trim().toLowerCase())
    );

    setResults(filtered);
    setSubmittedKeyword(keyword.trim());
    setSearched(true);
  };

  const handleReset = () => {
    setKeyword('');
    setSubmittedKeyword('');
    setResults([]);
    setSearched(false);
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
            <button
              type="button"
              onClick={handleReset}
              className="shrink-0"
              aria-label="clear"
            >
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

        {searched && (
          <div className="mt-8">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-6">
              <h2 className="text-white font-semibold">
                '{submittedKeyword}' 검색 결과
              </h2>
              <span className="text-gray-400 text-sm">영화 {results.length}편 · 1페이지</span>
            </div>

            {results.length === 0 ? (
              <p className="text-gray-400 text-center py-16">검색 결과가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {results.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex gap-4 border-b border-gray-800 pb-6"
                  >
                    <div className="relative w-28 h-40 shrink-0">
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="w-28 h-40 object-cover rounded-lg bg-gray-700"
                      />
                      <img
                        src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
                        alt="bookmark"
                        className="absolute top-2 right-2 w-5 h-5"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-white font-bold text-lg">{movie.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {movie.originalTitle} · {movie.releaseDate}
                      </p>
                      <p className="text-gray-300 text-sm line-clamp-3">{movie.overview}</p>
                      <a
                        href={`/movie/${movie.id}`}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium mt-3"
                      >
                        상세 보기
                        <img src="/icons/arrow-right.svg" alt="" className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
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