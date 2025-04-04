// src/components/MetadataDisplay/MetadataDisplay.jsx
import React, { useState, useEffect } from 'react';
import './MetadataDisplay.css';

function MetadataDisplay({ fetchMeta, currentFilter }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function loadMetadata() {
      setLoading(true);
      try {
        // If there's a current filter, use it (simplified approach)
        let params = {};
        if (currentFilter && currentFilter !== "random") {
          // This is a simplified approach - in a real implementation,
          // we'd determine the appropriate parameter based on the filter type
          params = { by_name: currentFilter };
        }
        
        const result = await fetchMeta(params);
        if (result) {
          setMetadata(result);
        }
      } catch (err) {
        setError('Failed to load metadata');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadMetadata();
  }, [fetchMeta, currentFilter]);

  if (loading) {
    return <div className="metadata-loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="metadata-error">Error: {error}</div>;
  }

  if (!metadata) {
    return null;
  }

  return (
    <div className="metadata-display">
      <div className="metadata-summary">
        <div className="metadata-total">
          <span className="metadata-value">{metadata.total.toLocaleString()}</span>
          <span className="metadata-label">Total Breweries</span>
        </div>
        
        <button 
          className="toggle-details"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {showDetails && (
        <div className="metadata-details">
          <div className="metadata-section">
            <h3>By Type</h3>
            <div className="metadata-type-grid">
              {Object.entries(metadata.by_type)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <div key={type} className="metadata-type-item">
                    <span className={`type-badge ${type}`}>{type}</span>
                    <span className="metadata-count">{count.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="metadata-section">
            <h3>Top 5 States</h3>
            <div className="metadata-state-list">
              {Object.entries(metadata.by_state)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([state, count]) => (
                  <div key={state} className="metadata-state-item">
                    <span className="metadata-state-name">{state}</span>
                    <span className="metadata-count">{count.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetadataDisplay;