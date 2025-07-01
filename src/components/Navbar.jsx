import React from 'react';
import Search from './Search';

// ---- Static filter options ----------------------------------------------
const movieGenres = [
  'Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi',
];

const tvGenres = [
  'Drama', 'Comedy', 'Documentary', 'Reality', 'Sci-Fi', 'Kids',
];

const personRoles = [
  'Actor', 'Actress', 'Producer', 'Director', 'Writer',
];

// ---- Component ----------------------------------------------------------
const Navbar = ({
  /* SEARCH BAR */
  searchTerm,
  setSearchTerm,

  /* PRIMARY FILTERS */
  country,
  setCountry,
  searchType,        // 'movie' | 'tv' | 'person' | ''
  setSearchType,

  /* SECONDARY FILTERS */
  movieGenre,
  setMovieGenre,
  tvGenre,
  setTvGenre,
  personRole,
  setPersonRole,
}) => {
  /* --- Conditional renderer for the sub-filter --- */
  const renderSubFilter = () => {
    if (!country || !searchType) return null;

    if (searchType === 'movie') {
      return (
        <select
          value={movieGenre}
          onChange={(e) => setMovieGenre(e.target.value)}
          className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2"
        >
          <option value="">Movies • Any genre</option>
          {movieGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      );
    }

    if (searchType === 'tv') {
      return (
        <select
          value={tvGenre}
          onChange={(e) => setTvGenre(e.target.value)}
          className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2"
        >
          <option value="">TV • Any genre</option>
          {tvGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      );
    }

    if (searchType === 'person') {
      return (
        <select
          value={personRole}
          onChange={(e) => setPersonRole(e.target.value)}
          className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2"
        >
          <option value="">People • Any role</option>
          {personRoles.map((role) => (
            <option key={role} value={role.toLowerCase()}>{role}</option>
          ))}
        </select>
      );
    }

    return null;
  };

  return (
    <nav className="bg-dark-100 text-gray-200 py-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      {/* -- Logo ----------------------------------------------------------- */}
      <div className="flex items-center gap-2">
        <img src="/reel_logo.png" alt="logo" className="w-6 h-6" />
        <span className="text-white font-bold text-xl">The Reel Deal</span>
      </div>

      {/* -- Search + Filters ---------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">

        {/* SEARCH BAR */}
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchType={searchType}
          country={country}
        />

        {/* COUNTRY (always enabled) */}
        <select
          value={country}
          onChange={(e) => {
            // Reset dependent filters whenever country changes
            setCountry(e.target.value);
            setSearchType('');
            setMovieGenre('');
            setTvGenre('');
            setPersonRole('');
          }}
          className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2"
        >
          <option value="">Country</option>
          <option value="US">USA</option>
          <option value="GB">UK</option>
          <option value="AU">Australia</option>
          <option value="KR">South Korea</option>
          <option value="JP">Japan</option>
          <option value="CN">China</option>
          <option value="HK">Hong Kong</option>
          <option value="TH">Thailand</option>
          <option value="ID">Indonesia</option>
        </select>

        {/* CONTENT TYPE (disabled until country) */}
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
            // clear sub-filters when switching type
            setMovieGenre('');
            setTvGenre('');
            setPersonRole('');
          }}
          disabled={!country}
          className="bg-dark-100 border border-gray-100 rounded-md py-2 px-2 disabled:opacity-50"
        >
          <option value="">Type</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
          <option value="person">People</option>
        </select>

        {/* SUB-FILTER: genre or role (conditionally rendered) */}
        {renderSubFilter()}
      </div>
    </nav>
  );
};

export default Navbar;
