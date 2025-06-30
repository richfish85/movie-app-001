import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [country, setCountry] = useState('');
  const [movieGenre, setMovieGenre] = useState('');
  const [tvGenre, setTvGenre] = useState('');

  return (
    <>
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchType={searchType}
        setSearchType={setSearchType}
        country={country}
        setCountry={setCountry}
        movieGenre={movieGenre}
        setMovieGenre={setMovieGenre}
        tvGenre={tvGenre}
        setTvGenre={setTvGenre}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchTerm={searchTerm}
              searchType={searchType}
              country={country}
              movieGenre={movieGenre}
              tvGenre={tvGenre}
            />
          }
        />
        <Route path="/movies/:id" element={<MovieDetails />} />
      </Routes>
    </>
  );
};

export default App;
