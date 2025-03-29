// src/components/Dashboard/Dashboard.jsx
import React, { useState } from "react";
import "./Dashboard.css";
import Stats from "../Stats/Stats";
import SearchBar from "../SearchBar/SearchBar";
import CategoryFilter from "../CategoryFilter/CategoryFilter";

function Dashboard({ data }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter by search query
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  // Further filter by category if one is selected
  const finalData = selectedCategory
    ? filteredData.filter((item) => item.brewery_type === selectedCategory)
    : filteredData;

  return (
    <div className="dashboard">
      <Stats data={data} />
      <SearchBar query={query} setQuery={setQuery} />
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="list-container">
        {finalData.map((item) => (
          <div key={item.id} className="dashboard-row">
            <p>{item.name}</p>
            <p>{item.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;