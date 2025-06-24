import React from 'react';

const Search = ({ searchTerm, setSearchTerm, searchType, setSearchType }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search through thousands of movies..."
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="ml-2 bg-dark-100 border border-gray-100 rounded-md text-gray-200 py-2 px-2"
        >
          <option value="movie">Movie</option>
          <option value="tv">TV</option>
        </select>
      </div>
    </div>
  );
};

export default Search;
