import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee';

/**
 * Horizontal marquee of the 20 highest-rated movies.
 * - Fetches once on mount.
 * - Pauses automatically on hover (handled by react-fast-marquee).
 *
 * Props
 * ─────
 * className?  — extra Tailwind / CSS classes injected by the parent.
 */
export default function TrendingStrip({ className = '' }) {
  const [movies, setMovies]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/tmdb?endpoint=movie/top_rated');
        const data = await res.json();
        if (res.ok) setMovies(data.results.slice(0, 20));
      } catch (err) {
        console.error('Trending fetch failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !movies.length) return null;  // 👈 skeleton component would go here

  return (
    <div className={`trending-strip my-8 ${className}`}>
      <Marquee pauseOnHover gradient={false} speed={40}>
        {movies.map((m) => (
          <Link
            key={m.id}
            to={`/movies/${m.id}`}
            className="mx-6 flex flex-col items-center w-[120px]"
          >
            <img
              src={
                m.poster_path
                  ? `https://image.tmdb.org/t/p/w185/${m.poster_path}`
                  : '/no-movie.png'
              }
              alt={m.title}
              className="rounded-lg shadow-md"
            />
            <p className="mt-2 text-xs text-center">{m.title}</p>
          </Link>
        ))}
      </Marquee>
    </div>
  );
}
