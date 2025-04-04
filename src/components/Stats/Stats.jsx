// src/components/Stats/Stats.jsx
import React from "react";
import "./Stats.css"; // We'll need to create this

function Stats({ data }) {
  if (!data || data.length === 0) return null;
  
  // Count breweries by type
  const typeCount = data.reduce((acc, brewery) => {
    acc[brewery.brewery_type] = (acc[brewery.brewery_type] || 0) + 1;
    return acc;
  }, {});
  
  // Get top 3 types
  const topTypes = Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  // Count unique states/provinces
  const uniqueStates = new Set(data.map(brewery => brewery.state_province)).size;
  
  // Calculate percentage of breweries with websites
  const breweriesWithWebsites = data.filter(brewery => brewery.website_url).length;
  const websitePercentage = Math.round((breweriesWithWebsites / data.length) * 100);
  
  // Find most common state
  const stateCount = data.reduce((acc, brewery) => {
    if (brewery.state_province) {
      acc[brewery.state_province] = (acc[brewery.state_province] || 0) + 1;
    }
    return acc;
  }, {});
  
  const mostCommonState = Object.entries(stateCount)
    .sort((a, b) => b[1] - a[1])[0] || ["Unknown", 0];
  
  return (
    <div className="stats-container">
      <h2 className="stats-header">Brewery Statistics</h2>
      <div className="stats">
        {/* Total count */}
        <div className="stats-item">
          <span className="stats-value">{data.length}</span>
          <span className="stats-label">Total Breweries</span>
        </div>
        
        {/* Geographic distribution */}
        <div className="stats-item">
          <span className="stats-value">{uniqueStates}</span>
          <span className="stats-label">States/Provinces</span>
        </div>
        
        {/* Most common state */}
        <div className="stats-item">
          <span className="stats-value">{mostCommonState[1]}</span>
          <span className="stats-label">Breweries in {mostCommonState[0]}</span>
        </div>
        
        {/* Website percentage */}
        <div className="stats-item">
          <span className="stats-value">{websitePercentage}%</span>
          <span className="stats-label">Have Websites</span>
        </div>
        
        {/* Top brewery types */}
        <div className="stats-section">
          <h3 className="stats-subheader">Top Brewery Types</h3>
          <div className="type-stats">
            {topTypes.map(([type, count]) => (
              <div key={type} className="type-stat-item">
                <span className={`type-badge ${type}`}>{type}</span>
                <span className="type-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;