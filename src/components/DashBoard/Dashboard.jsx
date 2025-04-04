// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import SearchBar from "../SearchBar/SearchBar";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import Stats from "../Stats/Stats";
import MetadataDisplay from "../MetadataDisplay/MetadataDisplay";

function Dashboard({ 
  data, 
  searchData,
  searchWithoutLoading,
  fetchDefaultData, 
  fetchRandom,
  getAutocomplete,
  fetchMeta,
  currentQuery  // Use this prop
}) {
  const [isSearching, setIsSearching] = useState(false);
  
  // Track search query separately from filters
  const [searchQuery, setSearchQuery] = useState(currentQuery || "");
  
  // Track applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    per_page: 10
  });
  
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
    
    // Update the applied filters
    setAppliedFilters(filters);
    
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
    setAppliedFilters({});
    setSearchQuery("random");
    
    await fetchRandom();
    setIsSearching(false);
  };
  
  // Reset to default view
  const handleReset = () => {
    setAppliedFilters({ per_page: 10 });
    setSearchQuery("");
    fetchDefaultData();
  };

  useEffect(() => {
    if (currentQuery !== searchQuery) {
      setSearchQuery(currentQuery);
    }
  }, [currentQuery]);

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
          value={searchQuery}        // Pass down searchQuery as value
          onChange={setSearchQuery}  // Pass state setter as onChange
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
        </div>
      </div>
      
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
                  <div className="brewery-info">
                    <h3 className="brewery-name">{brewery.name}</h3>
                    <p className="brewery-address">
                      {brewery.street && `${brewery.street}, `}
                      {brewery.city}, {brewery.state_province} 
                      {brewery.postal_code && ` ${brewery.postal_code}`}
                    </p>
                  </div>
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