import { useEffect } from 'react';
import { useMoviesInfinite } from './useMoviesInfinite';
import { getOptimizedImageUrl } from '../utils/imageOptimization';

const MoviesList = () => {
  const {
    movies,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useMoviesInfinite();

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') return <div>Loading movies...</div>;

  return (
    <>
      {error && <div>Error: {error.message}</div>}
      <ul className='movie-list'>
        {movies.map((movie: any, idx: number) => (
          <li key={idx} className='movie-list-item'>
            <div className='movie-item-content'>
              <img
                src={getOptimizedImageUrl(movie.thumbnail, 100)}
                alt={movie.title}
                className='movie-thumbnail'
                loading='lazy'
                decoding='async'
                width='100'
                height='140'
              />
              <div className='movie-details'>
                <strong className='movie-title'>{movie.title}</strong>{' '}
                <span className='movie-year'>({movie.year})</span>
                <br />
                <span className='movie-genres'>
                  Genres: {movie.genres && movie.genres.join(', ')}
                </span>
                <br />
                <span className='movie-cast'>
                  Cast: {movie.cast && movie.cast.join(', ')}
                </span>
                <br />
                <span className='movie-extract'>{movie.extract}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {isFetchingNextPage && <div>Loading more...</div>}
      {!hasNextPage && movies.length > 0 && <div>No more movies to load.</div>}
    </>
  );
};

export default MoviesList;
