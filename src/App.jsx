// src/App.jsx
import React from "react";
import "./App.css";
import Dashboard from "./components/DashBoard/Dashboard";
import { useBreweries } from "./hooks/useBreweries";

function App() {
  const { data, error, loading } = useBreweries();

  if (loading) {
    return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;
  }

  return (
    <div className="app">
      <Dashboard data={data} />
    </div>
  );
}

export default App;