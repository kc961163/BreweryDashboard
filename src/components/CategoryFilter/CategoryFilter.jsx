// src/components/CategoryFilter/CategoryFilter.jsx
import React from "react";
import "./CategoryFilter.css";

function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  return (
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="category-filter"
    >
      <option value="">All Types</option>
      <option value="micro">Micro</option>
      <option value="regional">Regional</option>
      <option value="brewpub">Brewpub</option>
    </select>
  );
}

export default CategoryFilter;