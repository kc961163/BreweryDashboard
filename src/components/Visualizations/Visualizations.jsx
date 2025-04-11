// src/components/Visualizations/Visualizations.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import "./Visualizations.css";

// Custom colors for the charts
const COLORS = [
  "#4caf50", // micro
  "#8bc34a", // nano
  "#3f51b5", // regional
  "#ff9800", // brewpub
  "#e91e63", // large
  "#9c27b0", // planning
  "#00bcd4", // contract
  "#757575", // closed
  "#607d8b", // other types
  "#673ab7",
  "#795548",
  "#009688"
];

function Visualizations({ data, isVisible, fetchMeta }) {
  const [typeData, setTypeData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [activeChart, setActiveChart] = useState("type"); // 'type', 'state', or 'website'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isVisible) return;

    // Process data for brewery type chart
    const typeCount = data.reduce((acc, brewery) => {
      acc[brewery.brewery_type] = (acc[brewery.brewery_type] || 0) + 1;
      return acc;
    }, {});

    const formattedTypeData = Object.entries(typeCount).map(([type, count]) => ({
      name: type,
      value: count
    }));

    setTypeData(formattedTypeData);

    // Process data for state/province chart
    const stateCount = data.reduce((acc, brewery) => {
      if (brewery.state_province || brewery.state) {
        const state = brewery.state_province || brewery.state;
        acc[state] = (acc[state] || 0) + 1;
      }
      return acc;
    }, {});

    // Convert to array and sort by count
    let formattedStateData = Object.entries(stateCount)
      .map(([state, count]) => ({
        name: state,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 states

    setStateData(formattedStateData);
    setLoading(false);

    // Fetch metadata if needed and available
    if (fetchMeta) {
      const fetchMetaData = async () => {
        const result = await fetchMeta({});
        if (result && !result.error) {
          setMetadata(result);
        }
      };
      
      fetchMetaData();
    }
  }, [data, isVisible, fetchMeta]);

  if (!isVisible || loading) {
    return null;
  }

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-type">{`${payload[0].name}`}</p>
          <p className="tooltip-count">{`${payload[0].value} breweries`}</p>
          <p className="tooltip-percent">{`${((payload[0].value / data.length) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="visualizations-container">
      <div className="chart-navigation">
        <button 
          className={activeChart === "type" ? "active" : ""} 
          onClick={() => setActiveChart("type")}
        >
          Brewery Types
        </button>
        <button 
          className={activeChart === "state" ? "active" : ""} 
          onClick={() => setActiveChart("state")}
        >
          Top States
        </button>
      </div>

      <div className="chart-explanation">
        {activeChart === "type" ? (
          <p>This chart shows the distribution of brewery types in the current dataset. The most common type is typically "micro" breweries, which are small-scale operations producing less than 15,000 barrels annually.</p>
        ) : (
          <p>This chart shows the top states/provinces with the most breweries in the current dataset. States like California, Colorado, and Michigan often have the highest concentration of craft breweries.</p>
        )}
      </div>

      <div className="chart-container">
        {activeChart === "type" && (
          <>
            <h3 className="chart-title">Brewery Types Distribution</h3>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeChart === "state" && (
          <>
            <h3 className="chart-title">Top 10 States/Provinces by Brewery Count</h3>
            <div className="bar-chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={stateData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} breweries`, "Count"]} />
                  <Bar dataKey="count" fill="#3f51b5" name="Brewery Count">
                    {stateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {metadata && (
        <div className="data-insights">
          <h3>Interesting Facts About U.S. Breweries</h3>
          <ul>
            <li>There are <strong>{metadata.total.toLocaleString()}</strong> breweries in the database.</li>
            <li>The most common brewery type is <strong>{Object.entries(metadata.by_type).sort((a, b) => b[1] - a[1])[0][0]}</strong> with {Object.entries(metadata.by_type).sort((a, b) => b[1] - a[1])[0][1].toLocaleString()} breweries.</li>
            <li>The state with the most breweries is <strong>{Object.entries(metadata.by_state).sort((a, b) => b[1] - a[1])[0][0]}</strong> with {Object.entries(metadata.by_state).sort((a, b) => b[1] - a[1])[0][1].toLocaleString()} breweries.</li>
            <li>Microbreweries and brewpubs make up the majority of craft brewing establishments in the United States.</li>
            <li>The craft brewing industry has seen significant growth in the past decade, with many former "planning" breweries now operational.</li>
          </ul>
          <p className="data-tip">
            <strong>Pro Tip:</strong> Try filtering by "brewpub" type to find breweries that serve food along with their craft beer!
          </p>
        </div>
      )}
    </div>
  );
}

export default Visualizations;