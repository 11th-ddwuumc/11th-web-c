import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { movies } from './data/movies';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import MovieDetailPage from './components/MovieDetailPage';

const rootRoute = createRootRoute({ component: Outlet });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <HomePage movieList={movies} />,
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