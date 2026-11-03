import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { TmdbMovieListItem } from '../api/movies/models';
import { useBookmarkStore } from '../store/useBookmarkStore';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked(movie.id));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  return (
    <div
      className="flex flex-col group cursor-pointer"
      onClick={() => navigate({ to: '/movies/$movieId', params: { movieId: String(movie.id) } })}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 shadow-sm">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
            이미지 없음
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(movie.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors text-white"
          aria-label="bookmark"
        >
          {isBookmarked ? (
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
        <p className="text-xs text-gray-500 mt-0.5">{movie.release_date}</p>
      </div>
    </div>
  );
};

export default MovieCard;