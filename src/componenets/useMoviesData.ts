import { useEffect, useState } from 'react';

export function useMoviesData() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/large-data');
        if (!res.ok) throw new Error('Failed to fetch movie data');
        const data = await res.json();
        setMovies(
          data.map((movie: any) => ({
            ...movie,
            href: movie.href === null ? undefined : movie.href,
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { movies, loading, error };
}
