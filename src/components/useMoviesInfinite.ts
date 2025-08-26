import { useInfiniteQuery } from '@tanstack/react-query';
import { API_CONSTANTS, CACHE_CONSTANTS } from '../constants';
import type { Movie, MovieResponse, PaginationParams } from '../types/movie';

export function useMoviesInfinite() {
  const fetchMovies = async ({
    pageParam = 0,
  }: PaginationParams): Promise<MovieResponse> => {
    const res = await fetch(
      `/api/large-data?offset=${pageParam}&limit=${API_CONSTANTS.PAGINATION_LIMIT}`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch movie data: ${res.status}`);
    }
    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    getNextPageParam: (lastPage: MovieResponse) => {
      return lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined;
    },
    initialPageParam: 0,
    staleTime: CACHE_CONSTANTS.STALE_TIME,
    gcTime: CACHE_CONSTANTS.GC_TIME,
  });

  return {
    movies: data ? data.pages.flatMap((page) => page.data) : ([] as Movie[]),
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}
