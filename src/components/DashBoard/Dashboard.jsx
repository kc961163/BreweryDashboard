// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import SearchBar from "../SearchBar/SearchBar";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import Stats from "../Stats/Stats";
import MetadataDisplay from "../MetadataDisplay/MetadataDisplay";
import Visualizations from "../Visualizations/Visualizations"; // Import the new component
import { Link } from "react-router-dom";

function Dashboard({ 
  data, 
  searchData,
  searchWithoutLoading,
  fetchDefaultData, 
  fetchRandom,
  getAutocomplete,
  fetchMeta,
  currentQuery,
  currentFilters,   
  updateFilters
}) {
  const [isSearching, setIsSearching] = useState(false);
  
  // Track search query separately from filters
  const [searchQuery, setSearchQuery] = useState(currentQuery || "");
  
  // Track applied filters
  const [appliedFilters, setAppliedFilters] = useState(currentFilters);
  
  // New state for toggling visualizations
  const [showVisualizations, setShowVisualizations] = useState(false);
  
  // Handle search submission from the search bar
  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchQuery(query);
    
    await searchData(query);
    setIsSearching(false);
  };
  
  // Handle filter changes from CategoryFilter
  const handleCategoryFilter = async (query, filters = {}) => {
    setIsSearching(true);
    
    // Update both local and global filter state
    setAppliedFilters(filters);
    updateFilters(filters);  // Add this line to update global state
    
    // If we have a query, use search, otherwise use fetchDefaultData
    if (query) {
      setSearchQuery(query);
      await searchData(query);
    } else {
      // Use the filters with fetchDefaultData
      await fetchDefaultData(filters);
      setSearchQuery("");
    }
    
    setIsSearching(false);
  };
  
  // Handle random brewery fetch
  const handleRandomBrewery = async () => {
    setIsSearching(true);
    
    // Clear filters and search query
    const emptyFilters = {};
    setAppliedFilters(emptyFilters);
    updateFilters(emptyFilters); 
    setSearchQuery("random");
    
    await fetchRandom();
    setIsSearching(false);
  };
  
  // Reset to default view
  const handleReset = () => {
    const defaultFilters = { per_page: 10 };
    setAppliedFilters(defaultFilters);
    updateFilters(defaultFilters);  // Add this line to update global state
    setSearchQuery("");
    fetchDefaultData(defaultFilters); // Pass defaultFilters here too
  };

  // Toggle visualizations
  const toggleVisualizations = () => {
    setShowVisualizations(!showVisualizations);
  };

  useEffect(() => {
    if (currentQuery !== searchQuery) {
      setSearchQuery(currentQuery);
    }
  }, [currentQuery]);

  useEffect(() => {
    setAppliedFilters(currentFilters);
  }, [currentFilters]);

  return (
    <div>
      {/* Metadata display */}
      <MetadataDisplay 
        fetchMeta={fetchMeta} 
        currentFilter={searchQuery ? `Search: ${searchQuery}` : (appliedFilters.by_type ? `Type: ${appliedFilters.by_type}` : "")}
      />
      
      <div className="card">
        {/* Search bar */}
        <SearchBar 
          onSearch={handleSearch}
          getAutocomplete={getAutocomplete}
          value={searchQuery}
          onChange={setSearchQuery}
        />
        
        {/* Category filter - pass applied filters to maintain state */}
        <CategoryFilter 
          onSelectCategory={handleCategoryFilter}
          appliedFilters={appliedFilters}
        />
        
        {/* Action buttons */}
        <div className="control-group">
          <button 
            onClick={handleRandomBrewery} 
            disabled={isSearching}
            className="action-button random-button"
          >
            Random Brewery
          </button>
          <button 
            onClick={handleReset} 
            disabled={isSearching}
            className="action-button reset-button"
          >
            Reset All
          </button>
          <button
            onClick={toggleVisualizations}
            className="action-button visualization-button"
          >
            {showVisualizations ? "Hide Charts" : "Show Charts"}
          </button>
        </div>
      </div>
      
      {/* Visualization Component */}
      <Visualizations 
        data={data}
        isVisible={showVisualizations}
        fetchMeta={fetchMeta}
      />
      
      {/* Results display */}
      {isSearching ? (
        <p className="status-message">Searching breweries...</p>
      ) : (
        <>
          <Stats data={data} />
          <div className="dashboard">
            {data && data.length > 0 ? (
              data.map((brewery) => (
                <div key={brewery.id} className="dashboard-row">
                  {/* Wrap brewery information with Link component */}
                  <Link to={`/brewery/${brewery.id}`} className="brewery-link">
                    <div className="brewery-info">
                      <h3 className="brewery-name">{brewery.name}</h3>
                      <p className="brewery-address">
                        {brewery.street && `${brewery.street}, `}
                        {brewery.city}, {brewery.state_province} 
                        {brewery.postal_code && ` ${brewery.postal_code}`}
                      </p>
                    </div>
                  </Link>
                  <div className="brewery-meta">
                    <span className={`type-badge ${brewery.brewery_type}`}>
                      {brewery.brewery_type}
                    </span>
                    {brewery.website_url && (
                      <a 
                        href={brewery.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="brewery-website"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">No breweries found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;