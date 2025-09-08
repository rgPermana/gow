import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});

// Icon untuk marker baru (temporary)
let TempIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    className: 'temp-marker'
});

// Icon untuk marker yang dipilih
let SelectedIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [15, 49],
    iconSize: [30, 49],
    className: 'selected-marker'
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component untuk handle click events pada peta
const MapClickHandler = ({ onMapClick, isAddMode }) => {
    useMapEvents({
        click: (e) => {
            if (isAddMode && onMapClick) {
                onMapClick(e.latlng);
            }
        }
    });
    return null;
};

// Component untuk mengontrol view peta
const MapController = ({ selectedData }) => {
    const map = useMap();
    
    React.useEffect(() => {
        if (selectedData && selectedData.location) {
            map.setView([selectedData.location.lat, selectedData.location.lng], 15, {
                animate: true,
                duration: 1
            });
        }
    }, [map, selectedData]);
    
    return null;
};

const Map = ({ data, onEdit, onDelete, onAddFromMap, isAddMode = false, selectedData = null }) => {
    const [tempMarker, setTempMarker] = useState(null);

    const handleEdit = (item) => {
        if (onEdit) {
            onEdit(item);
        }
    };

    const handleDelete = (item) => {
        if (onDelete) {
            onDelete(item);
        }
    };

    const handleMapClick = (latlng) => {
        if (isAddMode) {
            setTempMarker(latlng);
            if (onAddFromMap) {
                onAddFromMap(latlng);
            }
        }
    };

    const clearTempMarker = () => {
        setTempMarker(null);
    };

    return (
        <div className="map-container">
            {isAddMode && (
                <div className="map-instructions">
                    <p>🎯 Click on the map to add a new location</p>
                    <button onClick={clearTempMarker} className="btn-clear-temp">
                        Clear Temporary Marker
                    </button>
                </div>
            )}
            
            <MapContainer 
                center={[-6.2088, 106.8451]} 
                zoom={6} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                
                <MapClickHandler 
                    onMapClick={handleMapClick} 
                    isAddMode={isAddMode}
                />

                <MapController selectedData={selectedData} />

                {/* Existing markers */}
                {data && data.length > 0 && data.map((item, index) => (
                    <Marker 
                        key={`existing-${item.id}`} 
                        position={[item.location.lat, item.location.lng]}
                        icon={selectedData?.id === item.id ? SelectedIcon : DefaultIcon}
                    >
                        <Popup>
                            <div className="popup-content">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p><strong>Coordinates:</strong> {item.location.lat.toFixed(6)}, {item.location.lng.toFixed(6)}</p>
                                <p><strong>Created:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
                                <div className="popup-buttons">
                                    <button 
                                        onClick={() => handleEdit(item)}
                                        className="btn-edit-popup"
                                        title="Edit this location"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="btn-delete-popup"
                                        title="Delete this location"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Temporary marker for new location */}
                {tempMarker && (
                    <Marker 
                        position={[tempMarker.lat, tempMarker.lng]}
                        icon={TempIcon}
                    >
                        <Popup>
                            <div className="popup-content temp-popup">
                                <h3>🆕 New Location</h3>
                                <p><strong>Coordinates:</strong> {tempMarker.lat.toFixed(6)}, {tempMarker.lng.toFixed(6)}</p>
                                <p><em>Fill the form to save this location</em></p>
                                <button 
                                    onClick={clearTempMarker}
                                    className="btn-clear-temp-popup"
                                >
                                    ❌ Remove
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default Map;
