import InfiniteScroll from 'react-infinite-scroll-component';
import { useMoviesInfinite } from './useMoviesInfinite';

const MoviesList = () => {
  const {
    movies,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useMoviesInfinite();

  return (
    <>
      {error && <div>Error: {error.message}</div>}
      <InfiniteScroll
        dataLength={movies.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<div>Loading movies...</div>}
        endMessage={<div>No more movies to load.</div>}
      >
        <ul className='movie-list'>
          {movies.map((movie: any, idx: number) => (
            <li key={idx} className='movie-list-item'>
              <div className='movie-item-content'>
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className='movie-thumbnail'
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
      </InfiniteScroll>
      {isFetchingNextPage && <div>Loading more...</div>}
    </>
  );
};

export default MoviesList;
