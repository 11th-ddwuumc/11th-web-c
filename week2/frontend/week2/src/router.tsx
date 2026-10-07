/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { movies as initialMovies } from './data/movies';
import type { Movie } from './types/movie';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import MovieDetailPage from './components/MovieDetailPage';

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const HomeRoute: React.FC = () => {
  const [movieList, setMovieList] = useState<Movie[]>(initialMovies);
  const toggleBookmark = (id: number) =>
    setMovieList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isBookmarked: !m.isBookmarked } : m))
    );
  return <HomePage movieList={movieList} onToggleBookmark={toggleBookmark} />;
};

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeRoute,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  validateSearch: (search: Record<string, unknown>): { query: string } => ({
    query: typeof search.query === 'string' ? search.query : '',
  }),
  component: SearchPage,
});

const movieDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movies/$movieId',
  component: MovieDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, searchRoute, movieDetailRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}