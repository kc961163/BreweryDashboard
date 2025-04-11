// src/components/CategoryFilter/CategoryFilter.jsx
import React, { useState, useEffect } from "react";
import "./CategoryFilter.css";

// Brewery types based on the API documentation
const BREWERY_TYPES = [
  { value: "", label: "All Types" },
  { value: "micro", label: "Micro" },
  { value: "nano", label: "Nano" },
  { value: "regional", label: "Regional" },
  { value: "brewpub", label: "Brewpub" },
  { value: "large", label: "Large" },
  { value: "planning", label: "Planning" },
  { value: "bar", label: "Bar" },
  { value: "contract", label: "Contract" },
  { value: "proprietor", label: "Proprietor" },
  { value: "closed", label: "Closed" }
];

// Sort options
const SORT_OPTIONS = [
  { value: "", label: "Default Sort" },
  { value: "name:asc", label: "Name (A-Z)" },
  { value: "name:desc", label: "Name (Z-A)" },
  { value: "state:asc", label: "State (A-Z)" },
  { value: "state:desc", label: "State (Z-A)" },
  { value: "city:asc", label: "City (A-Z)" },
  { value: "city:desc", label: "City (Z-A)" }
];

// Per page options
const PER_PAGE_OPTIONS = [
  { value: 10, label: "10 per page" },
  { value: 20, label: "20 per page" },
  { value: 30, label: "30 per page" },
  { value: 50, label: "50 per page" }
];

function CategoryFilter({ onSelectCategory, appliedFilters = {} }) {
  // State for selected filters (not yet applied)
  const [selectedFilters, setSelectedFilters] = useState({
    by_type: appliedFilters.by_type || "",
    by_state: appliedFilters.by_state || "",
    by_city: appliedFilters.by_city || "",
    by_postal: appliedFilters.by_postal || "",
    by_name: appliedFilters.by_name || "",
    by_country: appliedFilters.by_country || "",
    per_page: appliedFilters.per_page || 10,
    sort: appliedFilters.sort || ""
  });

  // State for displaying advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Update a selected filter without applying it
  const updateSelectedFilter = (filterName, value) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: value
    });
  };

  // Apply all currently selected filters
  const applyFilters = (e) => {
    if (e) e.preventDefault();
    
    // Build a filter object with only the non-empty values
    const filters = {};
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value !== "") {
        filters[key] = value;
      }
    });
    
    // Ensure per_page is always included
    if (!filters.per_page) {
      filters.per_page = 10;
    }
    
    // Pass filters to parent component
    onSelectCategory("", filters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const emptyFilters = {
      by_type: "",
      by_state: "",
      by_city: "",
      by_postal: "",
      by_name: "",
      by_country: "",
      per_page: 10,
      sort: ""
    };
    
    setSelectedFilters(emptyFilters);
    onSelectCategory("", emptyFilters); // Pass the FULL emptyFilters object
  };

  // Remove a specific filter
  const removeFilter = (filterName) => {
    const newFilters = { 
      ...appliedFilters,
      [filterName]: "" 
    };
    
    // Update selected filters too
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: ""
    });
    
    // Apply the updated filters
    onSelectCategory("", newFilters);
  };

  useEffect(() => {
    setSelectedFilters({
      by_type: appliedFilters.by_type || "",
      by_state: appliedFilters.by_state || "",
      by_city: appliedFilters.by_city || "",
      by_postal: appliedFilters.by_postal || "",
      by_name: appliedFilters.by_name || "",
      by_country: appliedFilters.by_country || "",
      per_page: appliedFilters.per_page || 10,
      sort: appliedFilters.sort || ""
    });
  }, [appliedFilters]);

  return (
    <div className="filters-container">
      {/* Basic Filters */}
      <div className="filter-form">
        <div className="basic-filters">
          <div className="filter-group">
            <label htmlFor="type-filter">Brewery Type</label>
            <select
              id="type-filter"
              className="filter-select"
              value={selectedFilters.by_type}
              onChange={(e) => updateSelectedFilter("by_type", e.target.value)}
            >
              {BREWERY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-option">Sort By</label>
            <select
              id="sort-option"
              className="filter-select"
              value={selectedFilters.sort}
              onChange={(e) => updateSelectedFilter("sort", e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="per-page">Results Per Page</label>
            <select
              id="per-page"
              className="filter-select"
              value={selectedFilters.per_page}
              onChange={(e) => updateSelectedFilter("per_page", parseInt(e.target.value))}
            >
              {PER_PAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            type="button"
            className="toggle-advanced-btn"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
          </button>
        </div>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="advanced-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="state-filter">State</label>
                <input
                  id="state-filter"
                  type="text"
                  className="filter-input"
                  placeholder="e.g. California"
                  value={selectedFilters.by_state}
                  onChange={(e) => updateSelectedFilter("by_state", e.target.value)}
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="city-filter">City</label>
                <input
                  id="city-filter"
                  type="text"
                  className="filter-input"
                  placeholder="e.g. San Diego"
                  value={selectedFilters.by_city}
                  onChange={(e) => updateSelectedFilter("by_city", e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="postal-filter">Postal Code</label>
                <input
                  id="postal-filter"
                  type="text"
                  className="filter-input"
                  placeholder="e.g. 92101"
                  value={selectedFilters.by_postal}
                  onChange={(e) => updateSelectedFilter("by_postal", e.target.value)}
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="name-filter">Brewery Name</label>
                <input
                  id="name-filter"
                  type="text"
                  className="filter-input"
                  placeholder="e.g. Stone Brewing"
                  value={selectedFilters.by_name}
                  onChange={(e) => updateSelectedFilter("by_name", e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="country-filter">Country</label>
                <input
                  id="country-filter"
                  type="text"
                  className="filter-input"
                  placeholder="e.g. United States"
                  value={selectedFilters.by_country}
                  onChange={(e) => updateSelectedFilter("by_country", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Apply Filters Button */}
        <div className="filter-actions">
          <button 
            type="button"
            className="apply-filters-btn"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {Object.values(appliedFilters).some(value => value !== "" && value !== 10) && (
        <div className="active-filters-display">
          <div className="active-filters-header">
            <span>Active Filters:</span>
            <button 
              type="button"
              className="clear-all-btn"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          </div>
          
          <div className="filter-tags">
            {appliedFilters.by_type && (
              <div className="filter-tag">
                <span>Type: {BREWERY_TYPES.find(t => t.value === appliedFilters.by_type)?.label}</span>
                <button 
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => removeFilter("by_type")}
                >×</button>
              </div>
            )}
            
            {appliedFilters.by_state && (
              <div className="filter-tag">
                <span>State: {appliedFilters.by_state}</span>
                <button 
                  type="button" 
                  className="remove-tag-btn"
                  onClick={() => removeFilter("by_state")}
                >×</button>
              </div>
            )}
            
            {appliedFilters.by_city && (
              <div className="filter-tag">
                <span>City: {appliedFilters.by_city}</span>
                <button 
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => removeFilter("by_city")}
                >×</button>
              </div>
            )}
            
            {appliedFilters.by_postal && (
              <div className="filter-tag">
                <span>Postal: {appliedFilters.by_postal}</span>
                <button 
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => removeFilter("by_postal")}
                >×</button>
              </div>
            )}
            
            {appliedFilters.by_name && (
              <div className="filter-tag">
                <span>Name: {appliedFilters.by_name}</span>
                <button 
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => removeFilter("by_name")}
                >×</button>
              </div>
            )}
            
            {appliedFilters.by_country && (
              <div className="filter-tag">
                <span>Country: {appliedFilters.by_country}</span>
                <button 
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => removeFilter("by_country")}
                >×</button>
              </div>
            )}
            
            {appliedFilters.sort && (
              <div className="filter-tag">
                <span>Sort: {SORT_OPTIONS.find(o => o.value === appliedFilters.sort)?.label}</span>
                <button 
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => removeFilter("sort")}
                >×</button>
              </div>
            )}
            
            {appliedFilters.per_page && appliedFilters.per_page !== 10 && (
              <div className="filter-tag">
                <span>Results: {appliedFilters.per_page} per page</span>
                <button 
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => removeFilter("per_page")}
                >×</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryFilter;