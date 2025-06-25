import { useState, useEffect } from 'react';
import { useDebounceValue }   from 'usehooks-ts';

import Search      from '../components/Search.jsx';
import Spinner     from '../components/Spinner.jsx';
import MovieCard   from '../components/MovieCard.jsx';

import TrendingStrip from '../features/TrendingStrip';
import TopActors      from '../features/TopActors';
import PopularTv      from '../features/PopularTV';

import { updateSearchCount } from '../appwrite.js';

const Home = () => {
  /* ——— search-related state only ——— */
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [movieList,  setMovieList]  = useState([]);
  const [isLoading,  setIsLoading]  = useState(false);
  const [errorMsg,   setErrorMsg]   = useState('');
  const withTimeout = (p, ms = 3000) =>
  Promise.race([
    p,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);

  const [debouncedTerm] = useDebounceValue(searchTerm, 1000);

  /* ——— fetch search results ——— */
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setErrorMsg('');

      const endpoint = debouncedTerm
        ? `/api/tmdb?endpoint=search/${searchType}&query=${encodeURIComponent(
            debouncedTerm
          )}&sort_by=popularity.desc`
        : `/api/tmdb?endpoint=discover/${searchType}&sort_by=popularity.desc`;

      try {
        const res  = await fetch(endpoint);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.status_message || 'Fetch failed');
        }

        setMovieList(data.results || []);

        /* optional analytics */
        if (
          searchType === 'movie' &&
          debouncedTerm &&
          data.results?.length > 0
        ) {
          updateSearchCount(debouncedTerm, data.results[0]).catch(console.error);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to fetch movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedTerm, searchType]);

  /* ——— render ——— */
  return (
    <main>
        {/* hero + search */}

      <header className="relative isolate flex min-h-[60vh] w-full flex-col items-center justify-center px-4 text-center">
        {/* full-bleed background image */}
        <img
          src="./hero.webp"
          alt="Film festival red carpet"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
       />
        {/* subtle dark overlay for readability */}
       <div className="absolute inset-0 -z-10 bg-black/40" />

        {/* <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
         Find&nbsp;
          <span className="text-gradient">TV shows&nbsp;&&nbsp;Movies</span>
          &nbsp;you&nbsp;LOVE&nbsp;!
        </h1> */}

        </header>
      <div className="wrapper">
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchType={searchType}
            setSearchType={setSearchType}
          />
        {/* marquee */}
        <TrendingStrip className="my-8 text-white" />

        {/* three-column grid */}
        <div className="mt-10 grid md:grid-cols-12 gap-6">
          <TopActors  className="sidebar md:col-span-3 lg:col-span-2" />

          <section className="md:col-span-6 lg:col-span-8 all-movies">
            <h2 className="mb-6">
              All {searchType === 'movie' ? 'Movies' : 'TV Shows'}
            </h2>

            {isLoading ? (
              <Spinner />
            ) : errorMsg ? (
              <p className="text-red-500">{errorMsg}</p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {movieList.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
                
              </ul>
            )}
          </section>

          <PopularTv className="sidebar md:col-span-3 lg:col-span-2" />
        </div>
      </div>
    </main>
  );
};

export default Home;
