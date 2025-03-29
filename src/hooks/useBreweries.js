// src/hooks/useBreweries.js
import { useState, useEffect } from "react";

// Define a threshold for rate limit warnings
const RATE_LIMIT_THRESHOLD = 1;

// Helper function to check rate limit header
async function checkRateLimit(response) {
  const rateRemaining = response.headers.get("X-RateLimit-Remaining");
  if (rateRemaining && parseInt(rateRemaining) < RATE_LIMIT_THRESHOLD) {
    alert("Warning: API rate limit is nearly exceeded. Please try again later.");
    return false;
  }
  return true;
}

// Function to fetch a single brewery by ID
export async function getBreweryById(id) {
  try {
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`);
    if (!(await checkRateLimit(response))) {
      return { error: "Rate limit nearly exceeded" };
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

// Function to fetch a list of breweries with optional parameters
export async function getBreweries(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?${queryString}`);
    if (!(await checkRateLimit(response))) {
      return { error: "Rate limit nearly exceeded" };
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

// Function to fetch a random brewery
export async function getRandomBrewery() {
  try {
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/random`);
    if (!(await checkRateLimit(response))) {
      return { error: "Rate limit nearly exceeded" };
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

// Function to search breweries by query
export async function searchBreweries(query) {
  try {
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/search?query=${encodeURIComponent(query)}`);
    if (!(await checkRateLimit(response))) {
      return { error: "Rate limit nearly exceeded" };
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

// Function to get autocomplete suggestions
export async function autocompleteBreweries(query) {
  try {
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/autocomplete?query=${encodeURIComponent(query)}`);
    if (!(await checkRateLimit(response))) {
      return { error: "Rate limit nearly exceeded" };
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

// Function to get metadata about breweries with optional filters
export async function getBreweryMeta(filters = {}) {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/meta?${queryString}`);
    if (!(await checkRateLimit(response))) {
      return { error: "Rate limit nearly exceeded" };
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

// Optional: Create a custom hook to manage brewery data in your app
export function useBreweries() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Example: Fetch a list of breweries on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const breweries = await getBreweries({ per_page: 10 });
      if (breweries.error) {
        setError(breweries.error);
      } else {
        setData(breweries);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return { data, error, loading };
}