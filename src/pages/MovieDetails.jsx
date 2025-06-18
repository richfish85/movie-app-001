import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

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
    <main>
      <div className="bg_cover" />
      <div className="wrapper space-y-8">
        <Link to="/" className="text-indigo-500">&larr; Back to search</Link>

        <div className="flex flex-col gap-6 md:flex-row">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
            alt={movie.title}
            className="w-full max-w-xs rounded-lg"
          />
          <div className="space-y-3">
            <h2>{movie.title}</h2>
            <div className="rating">
              <img src="star.svg" alt="Star Icon" />
              <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
            </div>
            <p className="text-gray-100">Release Date: {movie.release_date || 'N/A'}</p>
            <p className="text-gray-100">{movie.overview}</p>
          </div>
        </div>

        <section className="bg-dark-100 p-5 rounded-2xl space-y-4">
          <h3 className="text-white font-bold text-xl">Leave a Review</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!comment.trim()) return;
              setReviews([...reviews, { rating, comment }]);
              setComment('');
              setRating('');
            }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <label htmlFor="rating" className="text-gray-100">Rating:</label>
              <select
                id="rating"
                className="bg-primary border border-gray-100 rounded-md p-2 text-white"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Select rating</option>
                {[1,2,3,4,5].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <textarea
              className="w-full bg-primary border border-gray-100 rounded-md p-2 text-white"
              rows="3"
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
            >
              Add Review
            </button>
          </form>

          {reviews.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Comments</h4>
              {reviews.map((rev, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="rating">
                    <img src="star.svg" alt="star" />
                    <p>{rev.rating}/5</p>
                  </div>
                  <p className="text-gray-100">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default MovieDetails;
