import { useState, useEffect } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import Spinner from '../components/Spinner.jsx';
import MovieCard   from '../components/MovieCard.jsx';

import TrendingStrip from '../features/TrendingStrip';
import TopActors from '../features/TopActors';
import PopularTv from '../features/PopularTV';

import { updateSearchCount } from '../appwrite.js';

const movieGenreIds = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  Fantasy: 14,
  Horror: 27,
  Romance: 10749,
  'Sci-Fi': 878,
};

const tvGenreIds = {
  Drama: 18,
  Comedy: 35,
  Documentary: 99,
  Reality: 10764,
  'Sci-Fi': 10765,
  Kids: 10762,
};

const Home = ({ searchTerm, searchType, country, movieGenre, tvGenre }) => {
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
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

      const endpoint = (() => {
        if (debouncedTerm) {
          const base = `/api/tmdb?endpoint=search/${searchType}&query=${encodeURIComponent(
            debouncedTerm
          )}`;
          return country ? `${base}&region=${country}` : base;
        }

        if (searchType === 'person') {
          return `/api/tmdb?endpoint=person/popular${country ? `&region=${country}` : ''}`;
        }

        let base = `/api/tmdb?endpoint=discover/${searchType}&sort_by=popularity.desc`;
        if (country) base += `&with_origin_country=${country}`;
        if (searchType === 'movie' && movieGenre) base += `&with_genres=${movieGenreIds[movieGenre]}`;
        if (searchType === 'tv' && tvGenre) base += `&with_genres=${tvGenreIds[tvGenre]}`;
        return base;
      })();

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
  }, [debouncedTerm, searchType, country, movieGenre, tvGenre]);

  /* ——— render ——— */
  return (
    <main>
        {/* hero + search */}

      <header className="relative isolate flex min-h-[60vh] w-full flex-col items-center justify-center px-1 text-center">
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
        {/* marquee */}
        <TrendingStrip className="my-2 text-white" country={country} />

        {/* three-column grid */}
        <div className="mt-5 grid md:grid-cols-12 gap-2">
          <TopActors className="sidebar md:col-span-3 lg:col-span-2" country={country} />

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

          <PopularTv className="sidebar md:col-span-3 lg:col-span-2" country={country} />
        </div>
      </div>
    </main>
  );
};

export default Home;
