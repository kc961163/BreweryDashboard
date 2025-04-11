// src/hooks/useBreweries.js
import { useState, useEffect } from "react";

const RATE_LIMIT_THRESHOLD = 1;

/**
 * Checks the API rate limit.
 * @param {Response} response - The fetch response object.
 * @returns {Object} - { valid: boolean, remaining: number | null }
 */
async function checkRateLimit(response) {
  const rateRemainingHeader = response.headers.get("X-RateLimit-Remaining");
  const remaining = rateRemainingHeader ? parseInt(rateRemainingHeader) : null;
  if (remaining !== null && remaining < RATE_LIMIT_THRESHOLD) {
    alert("Warning: API rate limit is nearly exceeded. Please try again later.");
    return { valid: false, remaining };
  }
  return { valid: true, remaining };
}

// Fetch a single brewery by ID
export async function getBreweryById(id) {
  try {
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`);
    const rateCheck = await checkRateLimit(response);
    if (!rateCheck.valid) {
      return { error: "Rate limit nearly exceeded", remaining: rateCheck.remaining };
    }
    if (!response.ok) {
      throw new Error(`Error fetching brewery: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

// Fetch a list of breweries with optional parameters
export async function getBreweries(params = {}) {
  try {
    // Filter out empty string values
    const cleanParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        cleanParams[key] = value;
      }
    });
    
    // Always include per_page parameter
    if (!cleanParams.per_page) {
      cleanParams.per_page = 10;
    }
    
    const queryString = new URLSearchParams(cleanParams).toString();
    console.log(`Making request to: https://api.openbrewerydb.org/v1/breweries?${queryString}`);
    
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?${queryString}`);
    const rateCheck = await checkRateLimit(response);
    if (!rateCheck.valid) {
      return { error: "Rate limit nearly exceeded", remaining: rateCheck.remaining };
    }
    if (!response.ok) {
      throw new Error(`Error fetching breweries: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

// Fetch a random brewery
export async function getRandomBrewery() {
  try {
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/random`);
    const rateCheck = await checkRateLimit(response);
    if (!rateCheck.valid) {
      return { error: "Rate limit nearly exceeded", remaining: rateCheck.remaining };
    }
    if (!response.ok) {
      throw new Error(`Error fetching random brewery: ${response.status}`);
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

// Search breweries by query
export async function searchBreweries(query) {
  try {
    const response = await fetch(
      `https://api.openbrewerydb.org/v1/breweries/search?query=${encodeURIComponent(query)}`
    );
    const rateCheck = await checkRateLimit(response);
    if (!rateCheck.valid) {
      return { error: "Rate limit nearly exceeded", remaining: rateCheck.remaining };
    }
    if (!response.ok) {
      throw new Error(`Error searching breweries: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

// Get autocomplete suggestions
export async function autocompleteBreweries(query) {
  try {
    const response = await fetch(
      `https://api.openbrewerydb.org/v1/breweries/autocomplete?query=${encodeURIComponent(query)}`
    );
    const rateCheck = await checkRateLimit(response);
    if (!rateCheck.valid) {
      return { error: "Rate limit nearly exceeded", remaining: rateCheck.remaining };
    }
    if (!response.ok) {
      throw new Error(`Error fetching autocomplete: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

// Fetch metadata about breweries with optional filters
export async function getBreweryMeta(filters = {}) {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/meta?${queryString}`);
    const rateCheck = await checkRateLimit(response);
    if (!rateCheck.valid) {
      return { error: "Rate limit nearly exceeded", remaining: rateCheck.remaining };
    }
    if (!response.ok) {
      throw new Error(`Error fetching metadata: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

// Custom hook to manage brewery data and expose all API functions
export function useBreweries() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Add state for tracking the current search query
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState({ per_page: 10 });

  // Function to fetch default list of breweries
  async function fetchDefaultData(params = {}) {
    // setLoading(true);
    // Clear the current query when resetting to default
    setCurrentQuery("");

    // Add this line to update the global filter state
    setCurrentFilters(params);
    
    const breweries = await getBreweries(params);
    if (breweries.error) {
      setError(breweries.error);
    } else {
      setData(breweries);
    }
  }


  // Modified function to search for breweries based on a query
  async function searchData(query) {
    if (!query) return;
    
    // Store the search query at the hook level
    setCurrentQuery(query);
    
    const results = await searchBreweries(query);
    if (results.error) {
      setError(results.error);
    } else {
      setData(results);
    }
  }

  // Fetch a random brewery and update data
  async function fetchRandom() {
    
    const randomBrewery = await getRandomBrewery();
    if (randomBrewery.error) {
      setError(randomBrewery.error);
    } else {
      setData([randomBrewery]);
    }
  }

  // Optional: Get autocomplete suggestions
  async function getAutocomplete(query) {
    return await autocompleteBreweries(query);
  }

  // Optional: Fetch metadata
  async function fetchMeta(filters = {}) {
    return await getBreweryMeta(filters);
  }

  function updateFilters(filters) {
    setCurrentFilters(filters);
  }

  useEffect(() => {
    fetchDefaultData();
  }, []);

  return {
    data,
    error,
    loading,
    currentQuery,
    currentFilters,
    updateFilters,     
    searchData,
    fetchDefaultData,
    fetchRandom,
    getBreweryById,
    getAutocomplete,
    fetchMeta,
  };
}