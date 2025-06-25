import { useEffect, useState } from 'react';

/**
 * Sidebar widget for the ten highest-rated TV shows.
 */
export default function PopularTv({ className = '' }) {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/tmdb?endpoint=tv/top_rated');
        const data = await res.json();
        if (res.ok) setShows(data.results.slice(0, 10));
      } catch (err) {
        console.error('Popular-TV fetch failed:', err);
      }
    })();
  }, []);

  if (!shows.length) return null;

  return (
    <aside className={`sidebar ${className}`}>
      <h3 className="font-bold mb-4">Popular TV Shows</h3>
      <ul>
        {shows.map((tv) => (
          <li key={tv.id} className="flex items-start space-x-3 mb-5">
            <img
              src={
                tv.poster_path
                  ? `https://image.tmdb.org/t/p/w185/${tv.poster_path}`
                  : '/no-movie.png'
              }
              alt={tv.name}
              className="w-[50px] rounded"
            />
            <div>
              <span>{tv.name}</span>
              <div className="rating flex items-center space-x-1 text-xs">
                <img src="star.svg" alt="star" className="w-3" />
                <p>{tv.vote_average.toFixed(1)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
