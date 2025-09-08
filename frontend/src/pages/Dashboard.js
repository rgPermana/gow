import React, { useState, useEffect } from 'react';
import '../components/Dashboard.css';

const Dashboard = () => {
  const [spatialData, setSpatialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Statistik dashboard
  const [stats, setStats] = useState({
    totalRecords: 0,
    todayRecords: 0,
    lastWeekRecords: 0
  });

  useEffect(() => {
    fetchSpatialData();
  }, []);

  const fetchSpatialData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/spatial-data/');
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      
      // Ensure data is an array
      const dataArray = Array.isArray(data) ? data : [];
      setSpatialData(dataArray);
      
      // Calculate statistics
      const today = new Date().toDateString();
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const todayCount = dataArray.filter(item => 
        new Date(item.created_at).toDateString() === today
      ).length;
      
      const lastWeekCount = dataArray.filter(item => 
        new Date(item.created_at) >= lastWeek
      ).length;

      setStats({
        totalRecords: dataArray.length,
        todayRecords: todayCount,
        lastWeekRecords: lastWeekCount
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
      setSpatialData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleSave = async (updatedItem) => {
    try {
      const response = await fetch(`http://localhost:8000/api/spatial-data/${updatedItem.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedItem.name,
          description: updatedItem.description,
          location: updatedItem.location
        }),
      });

      if (!response.ok) throw new Error('Failed to update data');

      await fetchSpatialData();
      setIsEditing(false);
      setSelectedItem(null);
    } catch (err) {
      setError('Failed to update item: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/spatial-data/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete data');

      await fetchSpatialData();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      setError('Failed to delete item: ' + err.message);
    }
  };

  // Export data to GeoJSON
  const handleExportGeoJSON = () => {
    try {
      const geojsonData = {
        type: "FeatureCollection",
        features: spatialData.map(item => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.location?.lng || 0, item.location?.lat || 0] // GeoJSON format: [lng, lat]
          },
          properties: {
            id: item.id,
            name: item.name,
            description: item.description,
            created_at: item.created_at
          }
        }))
      };

      const dataStr = JSON.stringify(geojsonData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `gow_spatial_data_${new Date().toISOString().split('T')[0]}.geojson`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Successfully exported ${spatialData.length} features to GeoJSON!`);
    } catch (err) {
      setError('Failed to export GeoJSON: ' + err.message);
    }
  };

  // Import data from GeoJSON
  const handleImportGeoJSON = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      console.log('Starting import process for file:', file.name);
      const fileContent = await file.text();
      console.log('File content length:', fileContent.length);
      
      const geojsonData = JSON.parse(fileContent);
      console.log('Parsed GeoJSON data:', geojsonData);

      // Validate GeoJSON structure
      if (!geojsonData.type) {
        throw new Error('Invalid GeoJSON format: Missing type property');
      }

      if (geojsonData.type !== 'FeatureCollection') {
        throw new Error(`Invalid GeoJSON format: Expected FeatureCollection, got ${geojsonData.type}`);
      }

      if (!geojsonData.features) {
        throw new Error('Invalid GeoJSON format: Missing features property');
      }

      if (!Array.isArray(geojsonData.features)) {
        throw new Error('Invalid GeoJSON format: features must be an array');
      }

      console.log(`Found ${geojsonData.features.length} features to process`);

      if (geojsonData.features.length === 0) {
        throw new Error('No features found in GeoJSON file');
      }

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (let i = 0; i < geojsonData.features.length; i++) {
        const feature = geojsonData.features[i];
        console.log(`Processing feature ${i + 1}:`, feature);

        try {
          // Validate feature structure
          if (!feature.type) {
            errors.push(`Feature ${i + 1}: Missing type property`);
            errorCount++;
            continue;
          }

          if (feature.type !== 'Feature') {
            errors.push(`Feature ${i + 1}: Invalid type '${feature.type}', expected 'Feature'`);
            errorCount++;
            continue;
          }

          if (!feature.geometry) {
            errors.push(`Feature ${i + 1}: Missing geometry`);
            errorCount++;
            continue;
          }

          if (!feature.properties) {
            console.warn(`Feature ${i + 1}: Missing properties, using defaults`);
          }

          if (feature.geometry.type !== 'Point') {
            errors.push(`Feature ${i + 1}: Unsupported geometry type '${feature.geometry.type}', only Point is supported`);
            errorCount++;
            continue;
          }

          const coords = feature.geometry.coordinates;
          if (!Array.isArray(coords) || coords.length < 2) {
            errors.push(`Feature ${i + 1}: Invalid coordinates format`);
            errorCount++;
            continue;
          }

          const lng = parseFloat(coords[0]);
          const lat = parseFloat(coords[1]);

          if (isNaN(lng) || isNaN(lat)) {
            errors.push(`Feature ${i + 1}: Invalid coordinate values`);
            errorCount++;
            continue;
          }

          // Validate coordinate ranges
          if (lat < -90 || lat > 90) {
            errors.push(`Feature ${i + 1}: Latitude ${lat} out of range (-90 to 90)`);
            errorCount++;
            continue;
          }

          if (lng < -180 || lng > 180) {
            errors.push(`Feature ${i + 1}: Longitude ${lng} out of range (-180 to 180)`);
            errorCount++;
            continue;
          }

          // Create new spatial data with better defaults
          const properties = feature.properties || {};
          const newData = {
            name: properties.name || properties.title || properties.label || `Imported Point ${i + 1}`,
            description: properties.description || properties.desc || properties.comment || 'Imported from GeoJSON',
            location: {
              lat: lat,
              lng: lng
            }
          };

          console.log(`Sending data for feature ${i + 1}:`, newData);

          const response = await fetch('http://localhost:8000/api/spatial-data/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
          });

          if (response.ok) {
            successCount++;
            console.log(`✅ Feature ${i + 1} imported successfully`);
          } else {
            const errorText = await response.text();
            errors.push(`Feature ${i + 1}: Server error - ${errorText}`);
            errorCount++;
            console.warn(`❌ Feature ${i + 1} failed:`, errorText);
          }
        } catch (featureErr) {
          errors.push(`Feature ${i + 1}: ${featureErr.message}`);
          errorCount++;
          console.warn(`❌ Error processing feature ${i + 1}:`, featureErr);
        }
      }

      await fetchSpatialData();
      
      // Show detailed results
      if (successCount > 0) {
        let message = `Import completed!\n✅ Successfully imported: ${successCount} features`;
        if (errorCount > 0) {
          message += `\n⚠️ Failed to import: ${errorCount} features`;
          if (errors.length > 0) {
            message += `\n\nErrors:\n${errors.slice(0, 5).join('\n')}`;
            if (errors.length > 5) {
              message += `\n... and ${errors.length - 5} more errors`;
            }
          }
        }
        alert(message);
      } else {
        let errorMessage = 'No valid features could be imported';
        if (errors.length > 0) {
          errorMessage += `\n\nErrors found:\n${errors.slice(0, 10).join('\n')}`;
          if (errors.length > 10) {
            errorMessage += `\n... and ${errors.length - 10} more errors`;
          }
        }
        throw new Error(errorMessage);
      }

    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import GeoJSON: ' + err.message);
    } finally {
      // Reset file input
      event.target.value = '';
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const sortedAndFilteredData = Array.isArray(spatialData) ? spatialData
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'location') {
        aValue = `${a.location?.lat || 0}, ${a.location?.lng || 0}`;
        bValue = `${b.location?.lat || 0}, ${b.location?.lng || 0}`;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }) : [];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1><i className="fas fa-database"></i> Database Management Dashboard</h1>
        <p>Manage your spatial data efficiently</p>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-database"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalRecords}</h3>
            <p>Total Records</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.todayRecords}</h3>
            <p>Added Today</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-week"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.lastWeekRecords}</h3>
            <p>Last 7 Days</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="dashboard-controls">
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="created_at">Sort by Date</option>
            <option value="location">Sort by Location</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
          </button>
        </div>

        <div className="import-export-container">
          <input
            type="file"
            accept=".geojson,.json"
            onChange={handleImportGeoJSON}
            style={{ display: 'none' }}
            id="geojson-import"
          />
          <label htmlFor="geojson-import" className="import-btn">
            <i className="fas fa-upload"></i>
            Import GeoJSON
          </label>
          
          <button onClick={handleExportGeoJSON} className="export-btn">
            <i className="fas fa-download"></i>
            Export GeoJSON
          </button>
        </div>
        
        <button onClick={fetchSpatialData} className="refresh-btn">
          <i className="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      {/* Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Coordinates</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.map((item) => (
              <tr key={item.id} className={selectedItem?.id === item.id ? 'selected' : ''}>
                <td>{item.id}</td>
                <td>
                  <div className="name-cell">
                    <i className="fas fa-map-marker-alt"></i>
                    {item.name}
                  </div>
                </td>
                <td className="description-cell">{item.description}</td>
                <td className="coordinates-cell">
                  {item.location?.lat?.toFixed(6)}, {item.location?.lng?.toFixed(6)}
                </td>
                <td className="date-cell">
                  {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => handleEdit(item)}
                    className="action-btn edit-btn"
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => confirmDelete(item)}
                    className="action-btn delete-btn"
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="action-btn view-btn"
                    title="View Details"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedAndFilteredData.length === 0 && (
          <div className="no-data">
            <i className="fas fa-inbox"></i>
            <p>No data found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && selectedItem && (
        <EditModal
          item={selectedItem}
          onSave={handleSave}
          onCancel={() => {
            setIsEditing(false);
            setSelectedItem(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <DeleteModal
          item={itemToDelete}
          onConfirm={() => handleDelete(itemToDelete.id)}
          onCancel={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
        />
      )}

      {/* Detail Panel */}
      {selectedItem && !isEditing && (
        <DetailPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onEdit={() => handleEdit(selectedItem)}
          onDelete={() => confirmDelete(selectedItem)}
        />
      )}
    </div>
  );
};

// Edit Modal Component
const EditModal = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: item.id,
    name: item.name,
    description: item.description,
    location: item.location || { lat: 0, lng: 0 }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3><i className="fas fa-edit"></i> Edit Spatial Data</h3>
          <button onClick={onCancel} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Latitude:</label>
            <input
              type="number"
              step="any"
              value={formData.location?.lat || 0}
              onChange={(e) => setFormData({
                ...formData, 
                location: {...(formData.location || {}), lat: parseFloat(e.target.value) || 0}
              })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Longitude:</label>
            <input
              type="number"
              step="any"
              value={formData.location?.lng || 0}
              onChange={(e) => setFormData({
                ...formData, 
                location: {...(formData.location || {}), lng: parseFloat(e.target.value) || 0}
              })}
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Modal Component
const DeleteModal = ({ item, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <h3><i className="fas fa-exclamation-triangle"></i> Confirm Delete</h3>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to delete this item?</p>
          <div className="item-preview">
            <strong>{item.name}</strong>
            <br />
            <small>{item.description}</small>
          </div>
          <p className="warning-text">This action cannot be undone!</p>
        </div>
        
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="delete-confirm-btn">
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Detail Panel Component
const DetailPanel = ({ item, onClose, onEdit, onDelete }) => {
  return (
    <div className="detail-panel">
      <div className="detail-header">
        <h3><i className="fas fa-info-circle"></i> Item Details</h3>
        <button onClick={onClose} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="detail-content">
        <div className="detail-item">
          <label>ID:</label>
          <span>{item.id}</span>
        </div>
        
        <div className="detail-item">
          <label>Name:</label>
          <span>{item.name}</span>
        </div>
        
        <div className="detail-item">
          <label>Description:</label>
          <span>{item.description}</span>
        </div>
        
        <div className="detail-item">
          <label>Coordinates:</label>
          <span>{item.location?.lat?.toFixed(6)}, {item.location?.lng?.toFixed(6)}</span>
        </div>
        
        <div className="detail-item">
          <label>Created:</label>
          <span>{new Date(item.created_at).toLocaleString()}</span>
        </div>
      </div>
      
      <div className="detail-actions">
        <button onClick={onEdit} className="edit-btn">
          <i className="fas fa-edit"></i> Edit
        </button>
        <button onClick={onDelete} className="delete-btn">
          <i className="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
