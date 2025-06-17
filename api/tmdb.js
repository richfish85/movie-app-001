/* eslint-env node */
export default async function handler(req, res) {
  const { endpoint, query } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing TMDB endpoint' });
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: missing API key' });
  }

  const tmdbUrl = new URL(`https://api.themoviedb.org/3/${endpoint}`);
  tmdbUrl.searchParams.set('api_key', TMDB_API_KEY);

  // Append extra query params from frontend
  if (query) {
    const extraParams = new URLSearchParams(query);
    for (const [key, value] of extraParams.entries()) {
      tmdbUrl.searchParams.set(key, value);
    }
  }

  try {
    const response = await fetch(tmdbUrl.toString());
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('TMDB fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch TMDB data' });
  }
}
