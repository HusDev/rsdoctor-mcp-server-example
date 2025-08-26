import { useInfiniteQuery } from '@tanstack/react-query';

const LIMIT = 10;

export function useMoviesInfinite() {
  const fetchMovies = async ({ pageParam = 0 }) => {
    const res = await fetch(
      `/api/large-data?offset=${pageParam}&limit=${LIMIT}`
    );
    if (!res.ok) throw new Error('Failed to fetch movie data');
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
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * LIMIT;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    initialPageParam: 0,
  });

  return {
    movies: data ? data.pages.flatMap((page) => page.data) : [],
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}
