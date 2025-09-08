import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import DataList from '../components/DataList';
import DataForm from '../components/DataForm';
import { fetchSpatialData, deleteSpatialData } from '../services/api';

const Home = () => {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('map');
    const [loading, setLoading] = useState(true);
    const [isAddMode, setIsAddMode] = useState(false);
    const [clickedCoordinates, setClickedCoordinates] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await fetchSpatialData();
            setData(result);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddNew = () => {
        setSelectedData(null);
        setIsEditing(false);
        setClickedCoordinates(null);
        setShowForm(true);
        setIsAddMode(false);
    };

    const handleAddFromMap = () => {
        setIsAddMode(true);
        setSelectedData(null);
        setIsEditing(false);
        setClickedCoordinates(null);
        if (activeTab !== 'map') {
            setActiveTab('map');
        }
    };

    const handleMapClick = (latlng) => {
        if (isAddMode) {
            setClickedCoordinates(latlng);
            setSelectedData({
                location: {
                    lat: latlng.lat,
                    lng: latlng.lng
                }
            });
            setIsEditing(false);
            setShowForm(true);
            setIsAddMode(false);
        }
    };

    const handleEdit = (item) => {
        setSelectedData(item);
        setIsEditing(true);
        setShowForm(true);
        setIsAddMode(false);
    };

    const handleDelete = async (item) => {
        if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
            try {
                await deleteSpatialData(item.id);
                loadData(); // Refresh data
            } catch (error) {
                alert('Error deleting data: ' + error.message);
            }
        }
    };

    const handleFormSave = () => {
        setShowForm(false);
        setSelectedData(null);
        setClickedCoordinates(null);
        setIsAddMode(false);
        loadData(); // Refresh data
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setSelectedData(null);
        setClickedCoordinates(null);
        setIsAddMode(false);
    };

    const cancelAddMode = () => {
        setIsAddMode(false);
        setClickedCoordinates(null);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="home-container">
            <header className="app-header">
                <h1>🗺️ GIS Application - Spatial Data Management</h1>
                <div className="header-controls">
                    <div className="add-buttons">
                        <button 
                            onClick={handleAddNew}
                            className="btn-add"
                            title="Add new location using form"
                        >
                            📝 Add New (Form)
                        </button>
                        <button 
                            onClick={handleAddFromMap}
                            className={`btn-add-map ${isAddMode ? 'active' : ''}`}
                            title="Click on map to add new location"
                        >
                            🎯 Add on Map
                        </button>
                        {isAddMode && (
                            <button 
                                onClick={cancelAddMode}
                                className="btn-cancel-add"
                                title="Cancel add mode"
                            >
                                ❌ Cancel
                            </button>
                        )}
                    </div>
                    <div className="tab-buttons">
                        <button 
                            onClick={() => setActiveTab('map')}
                            className={activeTab === 'map' ? 'active' : ''}
                        >
                            🗺️ Map View
                        </button>
                        <button 
                            onClick={() => setActiveTab('list')}
                            className={activeTab === 'list' ? 'active' : ''}
                        >
                            📋 List View
                        </button>
                    </div>
                </div>
            </header>

            <main className="app-main">
                {activeTab === 'map' ? (
                    <Map 
                        data={data} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddFromMap={handleMapClick}
                        isAddMode={isAddMode}
                    />
                ) : (
                    <DataList 
                        data={data}
                        onEdit={handleEdit}
                        onRefresh={loadData}
                    />
                )}
            </main>

            {showForm && (
                <DataForm
                    selectedData={selectedData}
                    onSave={handleFormSave}
                    onCancel={handleFormCancel}
                    isEditing={isEditing}
                    fromMapClick={!!clickedCoordinates}
                />
            )}
        </div>
    );
};

export default Home;
