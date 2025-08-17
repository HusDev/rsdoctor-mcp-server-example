import largeImage from './assets/large-image.jpg';
import largeData from './large-data.json'
import _ from 'lodash';
import cloneDeep from 'lodash-es/cloneDeep';
import moment from 'moment';
import './App.css';


function App() {
  // Use lodash and lodash-es cloneDeep
  const clonedDataLodash = _.cloneDeep(largeData);
  const clonedDataLodashEs = cloneDeep(largeData);
  // Use moment to show current date
  const now = moment().format('MMMM Do YYYY, h:mm:ss a');

  return (
    <div className="App">
      <header className="hero">
        <h1 className="hero-title">Movie Explorer</h1>
        <p className="current-date">Current date: {now}</p>
      </header>
      <section className="main-image-section">
        <img src={largeImage} alt="Large" className="main-image" />
      </section>
      <section className="movie-list-section">
        <div className="card movie-list-card">
          <h2 className="list-title">Movie List </h2>
          <ul className="movie-list">
            {clonedDataLodash.map((movie: any, idx: number) => (
              <li key={idx} className="movie-list-item">
                <div className="movie-item-content">
                  <img src={movie.thumbnail} alt={movie.title} className="movie-thumbnail" />
                  <div className="movie-details">
                    <strong className="movie-title">{movie.title}</strong> <span className="movie-year">({movie.year})</span><br />
                    <span className="movie-genres">Genres: {movie.genres && movie.genres.join(', ')}</span><br />
                    <span className="movie-cast">Cast: {movie.cast && movie.cast.join(', ')}</span><br />
                    <span className="movie-extract">{movie.extract}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <footer className="footer">
        <span>© 2025 Movie Explorer. Crafted with React.</span>
      </footer>
    </div>
  );
}

export default App;
