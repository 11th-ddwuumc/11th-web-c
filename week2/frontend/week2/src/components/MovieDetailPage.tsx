import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './header';
import { movies } from '../data/movies';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((m) => m.id === Number(id));

  const [isBookmarked, setIsBookmarked] = useState(movie?.isBookmarked ?? false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-white">
          영화를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const handleSaveRating = () => {
    console.log('평점:', rating, '후기:', review);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="relative w-full h-[420px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-8 flex items-center gap-1 text-white text-sm font-medium hover:opacity-80"
        >
          <img src="/icons/chevron-left.svg" alt="" className="w-4 h-4" />
          영화 목록
        </button>

        <div className="absolute bottom-8 left-8 text-white max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-2">{movie.title}</h1>
          <p className="text-gray-200 mb-1">{movie.originalTitle}</p>
          <p className="text-sm font-medium">
            {movie.releaseDate} &nbsp;{movie.genres.join(' · ')} &nbsp;{movie.runtime}
          </p>
        </div>
      </div>

      <main className="max-w-6xl w-full mx-auto px-8 py-10 flex gap-12">
        <div className="w-56 shrink-0">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="w-full rounded-xl shadow-md object-cover aspect-[2/3]"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{movie.tagline}</h2>
          <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
            {movie.overview}
          </p>

          <button
            onClick={() => setIsBookmarked((prev) => !prev)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isBookmarked
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <img
              src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
              alt=""
              className="w-4 h-4"
            />
            즐겨찾기
          </button>
        </div>

        <div className="w-80 shrink-0 border-l border-gray-200 pl-10">
          <h3 className="text-lg font-bold text-gray-900 mb-1">내 평점</h3>
          <p className="text-xs text-gray-400 mb-4">별점은 필수, 후기는 선택이에요.</p>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-md"
              >
                <img
                  src={
                    (hoverRating || rating) >= star
                      ? '/icons/star.svg'
                      : '/icons/star-outline.svg'
                  }
                  alt={`${star}점`}
                  className="w-5 h-5"
                />
              </button>
            ))}
          </div>

          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="w-full h-32 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none mb-4"
          />

          <button
            onClick={handleSaveRating}
            disabled={rating === 0}
            className="w-full bg-[#111827] hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition-colors"
          >
            평점 저장
          </button>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-100">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
};

export default MovieDetailPage;