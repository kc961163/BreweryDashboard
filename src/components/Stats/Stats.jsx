// src/components/Stats/Stats.jsx
import React from "react";
import "./Stats.css";

function Stats({ data }) {
  const totalItems = data.length;
  // Example: Calculate a mean if each brewery had a rating field (replace with a relevant field)
  // const meanRating = totalItems > 0 ? data.reduce((sum, item) => sum + item.rating, 0) / totalItems : 0;

  // For demo purposes, we show two dummy statistics
  return (
    <div className="stats">
      <p>Total Breweries: {totalItems}</p>
      <p>Other Statistic: {/* Calculate another statistic here */} N/A</p>
      <p>Additional Statistic: {/* Another calculation */} N/A</p>
    </div>
  );
}

export default Stats;