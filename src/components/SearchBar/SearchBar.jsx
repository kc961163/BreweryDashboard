// src/components/SearchBar/SearchBar.jsx
import React from "react";
import "./SearchBar.css";

function SearchBar({ query, setQuery }) {
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search breweries..."
      className="search-bar"
    />
  );
}

export default SearchBar;