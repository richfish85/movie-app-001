import { useEffect, useState } from 'react';

/**
 * Sidebar widget that shows 10 popular actors + their three
 * most-known movies.  Runs a couple of TMDB calls in parallel,
 * then renders a bulleted list.
 */
export default function TopActors({ className = '', country }) {
  const [actors, setActors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // 1️⃣ Grab popular actors
        const pRes = await fetch(`/api/tmdb?endpoint=person/popular${country ? `&region=${country}` : ''}`);
        const pData = await pRes.json();
        const top10 = pData.results.slice(0, 10);

        // 2️⃣ Fetch each actor’s movie credits in parallel
        const creditPromises = top10.map((actor) =>
          fetch(`/api/tmdb?endpoint=person/${actor.id}/movie_credits`)
            .then((r) => r.json())
            .then((credits) => {
              const topMovies = credits.cast
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 3)
                .map((m) => m.title);

              return { ...actor, topMovies };
            })
            .catch(() => ({ ...actor, topMovies: [] }))
        );

        const actorArr = await Promise.all(creditPromises);
        setActors(actorArr);
      } catch (err) {
        console.error('Top-actor fetch failed:', err);
      }
    })();
  }, [country]);

  if (!actors.length) return null;

  return (
    <aside className={`sidebar ${className}`}>
      <h3 className="font-bold mb-4">Top Actors</h3>
      <ul>
        {actors.map((actor) => (
          <li key={actor.id} className="flex items-start space-x-3 mb-5">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w185/${actor.profile_path}`
                  : '/no-movie.png'
              }
              alt={actor.name}
              className="w-[50px] rounded"
            />
            <div>
              <span>{actor.name}</span>
              {actor.topMovies.length > 0 && (
                <ul className="ml-4 list-disc list-inside text-xs text-gray-100">
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
  );
}
