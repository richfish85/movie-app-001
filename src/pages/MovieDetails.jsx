import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/tmdb?endpoint=movie/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!movie) {
    return <p>No movie data found.</p>;
  }

  return (
    <div className="wrapper space-y-4">
      <Link to="/" className="text-indigo-500">&larr; Back to search</Link>
      <h2>{movie.title}</h2>
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
        alt={movie.title}
        className="max-w-xs"
      />
      <p>Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
      <p>Release Date: {movie.release_date || 'N/A'}</p>
      <p>{movie.overview}</p>
    </div>
  );
};

export default MovieDetails;
