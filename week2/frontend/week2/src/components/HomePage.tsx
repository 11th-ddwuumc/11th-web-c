import React from 'react';
import type { Movie } from '../types/movie';
import { Header } from '../components/header';
import { MovieGrid } from '../components/movie-grid';
import { Pagination } from '../components/pagination';

interface HomePageProps {
  movieList: Movie[];
  onToggleBookmark: (id: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ movieList, onToggleBookmark }) => {
  return (
    <div className="min-h-screen bg-[#141414] flex flex-col justify-between font-sans">
      <div>
        <Header />
        <main className="max-w-7xl mx-auto px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[750px] flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">영화 목록</h2>
              <MovieGrid movies={movieList} onToggleBookmark={onToggleBookmark} />
            </div>
            <Pagination />
          </div>
        </main>
      </div>

      <footer className="py-4 text-center text-xs text-gray-400">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
};

export default HomePage;