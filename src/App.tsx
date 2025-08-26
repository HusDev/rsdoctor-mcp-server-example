import largeImage from './assets/small-image.webp';
import { Suspense, lazy } from 'react';

import dayjs from 'dayjs';
import './App.css';

const LazyMoviesList = lazy(
  () =>
    import(/* webpackChunkName: "movies-list" */ './componenets/movies-list')
);

const Image = lazy(
  () => import(/* webpackChunkName: "image" */ './componenets/image')
);

function App() {
  const now = dayjs().format('MMMM D YYYY, h:mm:ss a');

  return (
    <div className='App'>
      <header className='hero'>
        <h1 className='hero-title'>Movie Explorer</h1>
        <p className='current-date'>Current date: {now}</p>
      </header>
      <section className='main-image-section'>
        <Suspense fallback={<div>Loading...</div>}>
          <Image src={largeImage} alt='Large' className='main-image' />
        </Suspense>
      </section>
      <section className='movie-list-section'>
        <div className='card movie-list-card'>
          <h2 className='list-title'>Movie List </h2>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyMoviesList />
          </Suspense>
        </div>
      </section>
      <footer className='footer'>
        <span>© 2025 Movie Explorer. Crafted with React.</span>
      </footer>
    </div>
  );
}

export default App;
