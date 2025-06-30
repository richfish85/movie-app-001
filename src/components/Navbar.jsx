import React from 'react';
import Search from './Search.jsx';

const movieGenres = [
  'Action',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci-Fi',
];

const tvGenres = [
  'Drama',
  'Comedy',
  'Documentary',
  'Reality',
  'Sci-Fi',
  'Kids',
];

const Navbar = ({
  searchTerm,
  setSearchTerm,
  searchType,
  setSearchType,
  country,
  setCountry,
  movieGenre,
  setMovieGenre,
  tvGenre,
  setTvGenre,
}) => (
  <nav className="bg-dark-100 text-gray-200 py-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      <img src="/reel_logo.png" alt="logo" className="w-6 h-6" />
      <span className="text-white font-bold text-xl">The Reel Deal</span>
    </div>
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchType={searchType}
        setSearchType={setSearchType}
      />
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2"
      >
        <option value="">Country</option>
        <option value="US">USA</option>
        <option value="GB">UK</option>
        <option value="AU">Australia</option>
        <option value="KR">South Korea</option>
        <option value="JP">Japan</option>
        <option value="CN">China</option>
        <option value="HK">HongKong</option>
        <option value="TH">Thailand</option>
        <option value="ID">Indonesia</option>
      </select>
      <select
        className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2"
        onChange={() => setSearchType('person')}
      >
        <option>People</option>
        <option>Actors</option>
        <option>Actresses</option>
        <option>Producers</option>
        <option>Directors</option>
        <option>Writers</option>
      </select>
      <select
        value={movieGenre}
        onChange={(e) => setMovieGenre(e.target.value)}
        className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2"
      >
        <option value="">Movies</option>
        {movieGenres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <select
        value={tvGenre}
        onChange={(e) => setTvGenre(e.target.value)}
        className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2"
      >
        <option value="">TV Shows</option>
        {tvGenres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  </nav>
);

export default Navbar;
