import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onToggleBookmark }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col group cursor-pointer"
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 shadow-sm">
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(movie.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors text-white"
          aria-label="bookmark"
        >
          {movie.isBookmarked ? (
            <svg className="w-4 h-4 fill-blue-500 text-blue-500" viewBox="0 0 24 24">
              <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z" />
            </svg>
          )}
        </button>
      </div>
      <div className="mt-2 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{movie.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{movie.releaseDate}</p>
      </div>
    </div>
  );
};