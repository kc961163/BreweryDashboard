// src/App.jsx
import React from "react";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import { useBreweries } from "./hooks/useBreweries";

function App() {
  const { 
    data, 
    error, 
    loading,
    currentQuery,          // Get the current query state
    searchData, 
    searchWithoutLoading,  // Get the new function
    fetchDefaultData,
    fetchRandom,
    getAutocomplete,
    fetchMeta
  } = useBreweries();

  if (loading) {
    return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;
  }

  return (
    <div className="app">
      <h1>Brewery Explorer</h1>
      <Dashboard 
        data={data} 
        searchData={searchData}
        searchWithoutLoading={searchWithoutLoading}
        fetchDefaultData={fetchDefaultData}
        fetchRandom={fetchRandom}
        getAutocomplete={getAutocomplete}
        fetchMeta={fetchMeta}
        currentQuery={currentQuery}
      />
    </div>
  );
}

export default App;