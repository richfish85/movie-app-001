import { useState, useEffect } from 'react';
import Search from '../components/Search.jsx';
import Spinner from '../components/Spinner.jsx';
import MovieCard from '../components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import { updateSearchCount } from '../appwrite.js';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 1000, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
    const endpoint = query
      ? `/api/tmdb?endpoint=search/${searchType}&query=${encodeURIComponent(query)}&sort_by=popularity.desc`
      : `/api/tmdb?endpoint=discover/${searchType}&sort_by=popularity.desc`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (!response.ok || data.success === false) {
        setErrorMessage(data.status_message || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      if (searchType === 'movie' && query && data.results && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (errorMessage) {
      console.error(`Error fetching movies: ${errorMessage}`);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopularMovies = async () => {
    try {
      const res = await fetch('/api/tmdb?endpoint=movie/top_rated');
      const data = await res.json();
      if (res.ok) {
        setPopularMovies(data.results.slice(0, 10));

        const actorMap = new Map();
        for (const movie of data.results.slice(0, 20)) {
          const credRes = await fetch(`/api/tmdb?endpoint=movie/${movie.id}/credits`);
          const credData = await credRes.json();
          if (credRes.ok) {
            credData.cast.slice(0, 5).forEach((a) => {
              if (!actorMap.has(a.id)) {
                actorMap.set(a.id, { ...a, topMovies: [] });
              }
            });
          }
        }

        const actorsArr = Array.from(actorMap.values());
        for (const actor of actorsArr) {
          const creditsRes = await fetch(`/api/tmdb?endpoint=person/${actor.id}/movie_credits`);
          const creditsData = await creditsRes.json();
          if (creditsRes.ok) {
            actor.topMovies = creditsData.cast
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 3)
              .map((m) => m.title);
          }
        }

        setActors(actorsArr);
      }
    } catch (err) {
      console.error('Error fetching popular movies:', err);
    }
  };

  const fetchPopularTv = async () => {
    try {
      const res = await fetch('/api/tmdb?endpoint=tv/top_rated');
      const data = await res.json();
      if (res.ok) setPopularTv(data.results.slice(0, 10));
    } catch (err) {
      console.error('Error fetching popular tv shows:', err);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchType]);

  useEffect(() => {
    fetchPopularMovies();
    fetchPopularTv();
  }, []);

  return (
    <main>
      <div className='bg_cover' />
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You LOVE!</h1>
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchType={searchType}
            setSearchType={setSearchType}
          />
        </header>
        <section className="trending">
          <h2 className="mb-5">Popular Movies</h2>
          <ul>
            {popularMovies.map((m) => (
              <li key={m.id}>
                <img
                  src={m.poster_path ? `https://image.tmdb.org/t/p/w185/${m.poster_path}` : '/no-movie.png'}
                  alt={m.title}
                />
                <div className="ml-3">
                  <p>{m.title}</p>
                  <div className="rating">
                    <img src="star.svg" alt="star" />
                    <p>{m.vote_average.toFixed(1)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 grid md:grid-cols-12 gap-6">
          <aside className="sidebar md:col-span-3 lg:col-span-2">
            <h3 className="font-bold">Top Actors</h3>
            <ul>
              {actors.map((actor) => (
                <li key={actor.id} className="items-start">
                  <img
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w185/${actor.profile_path}` : '/no-movie.png'}
                    alt={actor.name}
                  />
                  <div>
                    <span>{actor.name}</span>
                    {actor.topMovies && (
                      <ul className="ml-4 list-disc list-inside text-sm text-gray-100">
                        {actor.topMovies.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          <section className="md:col-span-6 lg:col-span-8 all-movies">
            <h2 className="mt-[40px]">All {searchType === 'movie' ? 'Movies' : 'TV Shows'}</h2>
            {isLoading ? (
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

          <aside className="sidebar md:col-span-3 lg:col-span-2">
            <h3 className="font-bold">Popular TV Shows</h3>
            <ul>
              {popularTv.map((tv) => (
                <li key={tv.id}>
                  <img
                    src={tv.poster_path ? `https://image.tmdb.org/t/p/w185/${tv.poster_path}` : '/no-movie.png'}
                    alt={tv.name}
                  />
                  <span>{tv.name}</span>
                  <div className="rating">
                    <img src="star.svg" alt="star" />
                    <p>{tv.vote_average.toFixed(1)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Home;
