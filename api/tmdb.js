export default async function handler(req, res) {
  const { endpoint } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing TMDB endpoint' });

  const TMDB_API_KEY = process.env.TMDB_API_KEY;   // <- make sure this exists
  if (!TMDB_API_KEY) return res.status(500).json({ error: 'Server misconfigured: missing API key' });

  const tmdbUrl = new URL(`https://api.themoviedb.org/3/${endpoint}`);

  // copy every query-string pair except 'endpoint'
  Object.entries(req.query).forEach(([key, value]) => {
    if (key !== 'endpoint') tmdbUrl.searchParams.set(key, value);
  });

  try {
    const tmdbRes = await fetch(tmdbUrl.toString(), {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });
    const data = await tmdbRes.json();
    res.status(tmdbRes.status).json(data);
  } catch (err) {
    console.error('TMDB fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch TMDB data' });
  }
}

export const tmdb = async (endpoint, params = {}) => {
  const url = new URL(`/api/tmdb`, window.location.origin);
  url.searchParams.set('endpoint', endpoint);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.status_message);
  return data;
};
