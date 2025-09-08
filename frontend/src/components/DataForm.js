import React, { useState, useEffect } from 'react';
import { createSpatialData, updateSpatialData } from '../services/api';

const DataForm = ({ selectedData, onSave, onCancel, tempCoordinates, isEditing = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        lat: '',
        lng: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedData) {
            setFormData({
                name: selectedData.name || '',
                description: selectedData.description || '',
                lat: selectedData.location?.lat || '',
                lng: selectedData.location?.lng || ''
            });
        } else if (tempCoordinates) {
            setFormData(prev => ({
                ...prev,
                lat: tempCoordinates.latitude || '',
                lng: tempCoordinates.longitude || ''
            }));
        }
    }, [selectedData, tempCoordinates]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert lat/lng to numbers
            const dataToSend = {
                ...formData,
                lat: parseFloat(formData.lat),
                lng: parseFloat(formData.lng)
            };

            if (isEditing && selectedData) {
                // Update existing data
                await updateSpatialData(selectedData.id, dataToSend);
            } else {
                // Create new data
                await createSpatialData(dataToSend);
            }
            onSave();
        } catch (error) {
            alert('Error saving data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="data-form-overlay">
            <div className="data-form">
                <h3>
                    {isEditing ? '✏️ Edit Location' : '🆕 Add New Location'}
                    {tempCoordinates && <span className="map-indicator"> (From Map)</span>}
                </h3>
                
                {tempCoordinates && (
                    <div className="map-click-info">
                        <p>📍 Coordinates from map click:</p>
                        <p><strong>Lat:</strong> {formData.lat}, <strong>Lng:</strong> {formData.lng}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">📍 Location Name: *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Jakarta, Bandung, Office Location"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="description">📝 Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Optional description about this location"
                        />
                    </div>
                    
                    <div className="coordinates-group">
                                                <div className="form-group">
                            <label htmlFor="lat">� Latitude: *</label>
                            <input
                                type="number"
                                step="any"
                                id="lat"
                                name="lat"
                                value={formData.lat}
                                onChange={handleChange}
                                placeholder="-6.2088"
                                required
                                readOnly={!!tempCoordinates}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="lng">🌐 Longitude: *</label>
                            <input
                                type="number"
                                step="any"
                                id="lng"
                                name="lng"
                                value={formData.lng}
                                onChange={handleChange}
                                placeholder="106.8451"
                                required
                                readOnly={!!tempCoordinates}
                            />
                        </div>
                    </div>

                    {tempCoordinates && (
                        <div className="coordinate-note">
                            <small>💡 Coordinates are automatically filled from your map click. You can still edit them if needed.</small>
                        </div>
                    )}
                    
                    <div className="form-buttons">
                        <button type="submit" disabled={loading}>
                            {loading ? '⏳ Saving...' : (isEditing ? '💾 Update' : '➕ Create')}
                        </button>
                        <button type="button" onClick={onCancel}>
                            ❌ Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DataForm;
