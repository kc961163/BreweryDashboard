// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import BreweryDetail from "./components/BreweryDetail/BreweryDetail";
import { useBreweries } from "./hooks/useBreweries";

function App() {
  const { 
    data, 
    error, 
    loading,
    currentQuery,
    currentFilters,
    updateFilters,
    searchData, 
    fetchDefaultData,
    fetchRandom,
    getAutocomplete,
    fetchMeta,
    getBreweryById
  } = useBreweries();

  if (loading) {
    return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <h1>Brewery Explorer</h1>
        <Routes>
          <Route path="/" element={
            <Dashboard 
              data={data} 
              searchData={searchData}
              fetchDefaultData={fetchDefaultData}
              fetchRandom={fetchRandom}
              getAutocomplete={getAutocomplete}
              fetchMeta={fetchMeta}
              currentQuery={currentQuery}
              currentFilters={currentFilters} 
              updateFilters={updateFilters}
            />
          } />
          
          {/* Removed fetchMeta from props passed to BreweryDetail */}
          <Route path="/brewery/:id" element={
            <BreweryDetail 
              getBreweryById={getBreweryById}
              searchData={searchData}
              fetchDefaultData={fetchDefaultData}
              fetchRandom={fetchRandom}
              getAutocomplete={getAutocomplete}
              currentQuery={currentQuery}
              currentFilters={currentFilters}
              updateFilters={updateFilters}
            />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;