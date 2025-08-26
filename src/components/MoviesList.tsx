import { useEffect, useCallback } from 'react';
import { useMoviesInfinite } from './useMoviesInfinite';
import { getOptimizedImageUrl } from '../utils/imageOptimization';
import { IMAGE_CONSTANTS, API_CONSTANTS } from '../constants';
import type { Movie } from '../types/movie';

const MoviesList = () => {
  const {
    movies,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useMoviesInfinite();

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight -
          API_CONSTANTS.SCROLL_THRESHOLD &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (status === 'pending') return <div>Loading movies...</div>;

  return (
    <>
      {error && <div className='error-message'>Error: {error.message}</div>}
      <ul className='movie-list'>
        {movies.map((movie: Movie, idx: number) => (
          <li key={`${movie.title}-${idx}`} className='movie-list-item'>
            <div className='movie-item-content'>
              <img
                src={getOptimizedImageUrl(
                  movie.thumbnail,
                  IMAGE_CONSTANTS.DEFAULT_THUMBNAIL_WIDTH
                )}
                alt={`${movie.title} poster`}
                className='movie-thumbnail'
                loading='lazy'
                decoding='async'
                width={IMAGE_CONSTANTS.DEFAULT_THUMBNAIL_WIDTH}
                height={IMAGE_CONSTANTS.DEFAULT_THUMBNAIL_HEIGHT}
              />
              <div className='movie-details'>
                <strong className='movie-title'>{movie.title}</strong>{' '}
                <span className='movie-year'>({movie.year})</span>
                <br />
                {movie.genres && movie.genres.length > 0 && (
                  <>
                    <span className='movie-genres'>
                      Genres: {movie.genres.join(', ')}
                    </span>
                    <br />
                  </>
                )}
                {movie.cast && movie.cast.length > 0 && (
                  <>
                    <span className='movie-cast'>
                      Cast: {movie.cast.join(', ')}
                    </span>
                    <br />
                  </>
                )}
                <span className='movie-extract'>{movie.extract}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {isFetchingNextPage && (
        <div className='loading-message'>Loading more...</div>
      )}
      {!hasNextPage && movies.length > 0 && (
        <div className='end-message'>No more movies to load.</div>
      )}
    </>
  );
};

export default MoviesList;
