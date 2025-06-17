import { useState, useEffect } from 'react';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';


// API
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY      = import.meta.env.VITE_TMDB_API_KEY;
const POPULAR_URL  = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization : `Bearer ${API_KEY}`,
  },
};

// App Component
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

      try {
        const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.Response === 'False') {
          setErrorMessage(data.Error || 'Failed to fetch movies');
          setMovieList([]);
          return;
        }
        setMovieList(data.results || []);
      } catch (errorMessage) {
        console.error(`Error fetching movies: ${errorMessage}`);
        setErrorMessage('Failed to fetch movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  return (
      <main>
        <div className='bg_cover' />
        <div className='wrapper'>
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>Find <span className="text-gradient">Movies</span> You LOVE!</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          </header>
          <h1 className="text-white">{searchTerm}</h1>
          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>

            { isLoading ? (
              // <p className="text-white">Loading...</p>
              <Spinner />
            ) : errorMessage ? ( 
               <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                  {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
  )
}

export default App;