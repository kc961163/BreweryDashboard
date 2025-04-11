// src/components/BreweryDetail/BreweryDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BreweryDetail.css";
import SearchBar from "../SearchBar/SearchBar";
import CategoryFilter from "../CategoryFilter/CategoryFilter";

function BreweryDetail({ 
  getBreweryById,
  searchData,
  fetchDefaultData,
  fetchRandom,
  getAutocomplete,
  currentQuery,
  currentFilters,
  updateFilters
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Local state for search and filters (synced with global state)
  const [searchQuery, setSearchQuery] = useState(currentQuery || "");
  const [appliedFilters, setAppliedFilters] = useState(currentFilters);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch brewery data when component loads
  useEffect(() => {
    async function fetchBreweryData() {
      setLoading(true);
      const breweryData = await getBreweryById(id);
      
      if (breweryData.error) {
        setError(breweryData.error);
      } else {
        setBrewery(breweryData);
      }
      
      setLoading(false);
    }
    
    fetchBreweryData();
  }, [id, getBreweryById]);

  // Keep local state in sync with global state
  useEffect(() => {
    if (currentQuery !== searchQuery) {
      setSearchQuery(currentQuery);
    }
  }, [currentQuery, searchQuery]);

  useEffect(() => {
    setAppliedFilters(currentFilters);
  }, [currentFilters]);

  // Handler for search with navigation
  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchQuery(query);
    
    await searchData(query);
    
    // Navigate back to dashboard to see results
    navigate('/');
    
    setIsSearching(false);
  };
  
  // Handler for filter changes with navigation
  const handleCategoryFilter = async (query, filters = {}) => {
    setIsSearching(true);
    
    setAppliedFilters(filters);
    updateFilters(filters);
    
    if (query) {
      setSearchQuery(query);
      await searchData(query);
    } else {
      await fetchDefaultData(filters);
      setSearchQuery("");
    }
    
    // Navigate back to dashboard to see results
    navigate('/');
    
    setIsSearching(false);
  };
  
  // Handler for random brewery with navigation
  const handleRandomBrewery = async () => {
    setIsSearching(true);
    
    const emptyFilters = {};
    setAppliedFilters(emptyFilters);
    updateFilters(emptyFilters);
    setSearchQuery("random");
    
    await fetchRandom();
    
    // Navigate back to dashboard
    navigate('/');
    
    setIsSearching(false);
  };
  
  // Handler for reset with navigation
  const handleReset = () => {
    const defaultFilters = { per_page: 10 };
    setAppliedFilters(defaultFilters);
    updateFilters(defaultFilters);
    setSearchQuery("");
    fetchDefaultData(defaultFilters);
    
    // Navigate back to dashboard
    navigate('/');
  };

  // Format phone number if available
  const formatPhone = (phone) => {
    if (!phone) return "Not available";
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <div className="card">
          <button 
            onClick={() => navigate('/')} 
            className="action-button back-button"
          >
            ← Back to Dashboard
          </button>
          
          {/* Search bar */}
          <SearchBar 
            onSearch={handleSearch}
            getAutocomplete={getAutocomplete}
            value={searchQuery}
            onChange={setSearchQuery}
          />
          
          {/* Category filter */}
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
        
        <p className="status-message">Loading brewery details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <div className="card">
          <button 
            onClick={() => navigate('/')} 
            className="action-button back-button"
          >
            ← Back to Dashboard
          </button>
          
          {/* Search bar */}
          <SearchBar 
            onSearch={handleSearch}
            getAutocomplete={getAutocomplete}
            value={searchQuery}
            onChange={setSearchQuery}
          />
          
          {/* Category filter */}
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
        
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  // If no brewery data
  if (!brewery) {
    return (
      <div>
        <div className="card">
          <button 
            onClick={() => navigate('/')} 
            className="action-button back-button"
          >
            ← Back to Dashboard
          </button>
          
          {/* Search bar */}
          <SearchBar 
            onSearch={handleSearch}
            getAutocomplete={getAutocomplete}
            value={searchQuery}
            onChange={setSearchQuery}
          />
          
          {/* Category filter */}
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
        
        <p className="empty-message">No brewery found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <button 
          onClick={() => navigate('/')} 
          className="action-button back-button"
        >
          ← Back to Dashboard
        </button>
        
        {/* Search bar */}
        <SearchBar 
          onSearch={handleSearch}
          getAutocomplete={getAutocomplete}
          value={searchQuery}
          onChange={setSearchQuery}
        />
        
        {/* Category filter */}
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
      
      {/* Brewery Detail Content */}
      <div className="detail-content">
        <div className="detail-header">
          <h2 className="detail-name">{brewery.name}</h2>
          <span className={`type-badge ${brewery.brewery_type}`}>
            {brewery.brewery_type}
          </span>
        </div>
        
        <div className="detail-card">
          <h3>Location Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Street:</span>
              <span className="detail-value">{brewery.street || brewery.address_1 || "Not available"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">City:</span>
              <span className="detail-value">{brewery.city}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">State/Province:</span>
              <span className="detail-value">{brewery.state_province || brewery.state}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Postal Code:</span>
              <span className="detail-value">{brewery.postal_code || "Not available"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Country:</span>
              <span className="detail-value">{brewery.country}</span>
            </div>
            {(brewery.latitude && brewery.longitude) && (
              <div className="detail-item full-width">
                <span className="detail-label">Coordinates:</span>
                <span className="detail-value">{brewery.latitude}, {brewery.longitude}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="detail-card">
          <h3>Contact Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{formatPhone(brewery.phone)}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Website:</span>
              <span className="detail-value">
                {brewery.website_url ? (
                  <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">
                    {brewery.website_url}
                  </a>
                ) : "Not available"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="detail-card">
          <h3>Additional Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Brewery ID:</span>
              <span className="detail-value">{brewery.id}</span>
            </div>
            {brewery.address_2 && (
              <div className="detail-item full-width">
                <span className="detail-label">Address Line 2:</span>
                <span className="detail-value">{brewery.address_2}</span>
              </div>
            )}
            {brewery.address_3 && (
              <div className="detail-item full-width">
                <span className="detail-label">Address Line 3:</span>
                <span className="detail-value">{brewery.address_3}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreweryDetail;