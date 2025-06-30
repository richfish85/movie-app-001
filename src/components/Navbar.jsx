import React from 'react';

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

const Navbar = () => (
  <nav className="bg-dark-100 text-gray-200 py-3 px-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <img src="/reel_logo.png" alt="logo" className="w-6 h-6" />
      <span className="text-white font-bold text-xl">The Reel Deal</span>
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <select className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2">
        <option>Country</option>
        <option>USA</option>
        <option>UK</option>
        <option>Australia</option>
        <option>South Korea</option>
        <option>Japan</option>
        <option>China</option>
        <option>HongKong</option>
        <option>Thailand</option>
        <option>Indonesia</option>
      </select>
      <select className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2">
        <option>People</option>
        <option>Actors</option>
        <option>Actresses</option>
        <option>Producers</option>
        <option>Directors</option>
        <option>Writers</option>
      </select>
      <select className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2">
        <option>Movies</option>
        {movieGenres.map((g) => (
          <option key={g}>{g}</option>
        ))}
      </select>
      <select className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2">
        <option>TV Shows</option>
        {tvGenres.map((g) => (
          <option key={g}>{g}</option>
        ))}
      </select>
    </div>
  </nav>
);

export default Navbar;
