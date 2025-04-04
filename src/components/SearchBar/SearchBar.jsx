// src/components/SearchBar/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch, getAutocomplete, value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  
  // Handle input change and fetch suggestions
  const handleInputChange = async (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.length >= 3) {
      try {
        const autocompleteResults = await getAutocomplete(newValue);
        if (!autocompleteResults.error && Array.isArray(autocompleteResults)) {
          setSuggestions(autocompleteResults);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Autocomplete error:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value && value.trim()) {
      onSearch(value);
      setShowSuggestions(false);
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.name);
    onSearch(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="Search breweries..."
          className="search-bar"
        />
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li 
              key={suggestion.id} 
              onClick={() => handleSuggestionClick(suggestion)}
              className="suggestion-item"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;