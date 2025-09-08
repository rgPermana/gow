import React, { useState, useEffect } from 'react';
import DataForm from '../components/DataForm';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import { getSpatialData, createSpatialData, updateSpatialData, deleteSpatialData } from '../services/api';
import '../components/CRUD.css';
import '../components/Sidebar.css';

const Home = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isAddMode, setIsAddMode] = useState(false);
    const [tempCoordinates, setTempCoordinates] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getSpatialData();
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingData) {
                await updateSpatialData(editingData.id, formData);
                alert('Data updated successfully!');
            } else {
                await createSpatialData(formData);
                alert('Data created successfully!');
            }
            
            setShowForm(false);
            setEditingData(null);
            setIsAddMode(false);
            setTempCoordinates(null);
            fetchData();
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data');
        }
    };

    const handleEdit = (item) => {
        setEditingData(item);
        setSelectedData(item);
        setShowForm(true);
        setIsAddMode(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteSpatialData(id);
                alert('Data deleted successfully!');
                fetchData();
                if (selectedData?.id === id) {
                    setSelectedData(null);
                }
            } catch (error) {
                console.error('Error deleting data:', error);
                alert('Failed to delete data');
            }
        }
    };

    const handleAddNew = () => {
        setEditingData(null);
        setTempCoordinates(null);
        setSelectedData(null);
        setShowForm(true);
        setIsAddMode(false);
    };

    const handleAddFromMap = (coordinates) => {
        setTempCoordinates({
            latitude: coordinates.lat,
            longitude: coordinates.lng
        });
        setEditingData(null);
        setSelectedData(null);
        setShowForm(true);
    };

    const handleStartAddMode = () => {
        setIsAddMode(true);
        setTempCoordinates(null);
        setSelectedData(null);
        setEditingData(null);
        setShowForm(false);
    };

    const handleCancelAddMode = () => {
        setIsAddMode(false);
        setTempCoordinates(null);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingData(null);
        setIsAddMode(false);
        setTempCoordinates(null);
    };

    const handleDataSelect = (item) => {
        setSelectedData(item);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="home-container">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddNew={handleAddNew}
                selectedData={selectedData}
                onDataSelect={handleDataSelect}
            />

            {/* Main Content - Map */}
            <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="map-wrapper">
                    {/* Map Controls */}
                    <div className="map-controls">
                        <div className="add-controls">
                            <button 
                                className="btn-add-map"
                                onClick={handleStartAddMode}
                                disabled={isAddMode}
                            >
                                <i className="fas fa-map-marker-alt"></i>
                                {isAddMode ? 'Click on Map...' : 'Add via Map'}
                            </button>
                            
                            {isAddMode && (
                                <button 
                                    className="btn-cancel-add"
                                    onClick={handleCancelAddMode}
                                >
                                    <i className="fas fa-times"></i>
                                    Cancel
                                </button>
                            )}
                        </div>
                        
                        <div className="map-info">
                            {selectedData && (
                                <div className="selected-info">
                                    <i className="fas fa-eye"></i>
                                    Viewing: {selectedData.name}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map Component */}
                    <Map
                        data={data}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddFromMap={handleAddFromMap}
                        isAddMode={isAddMode}
                        selectedData={selectedData}
                    />
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <DataForm
                    data={editingData}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseForm}
                    tempCoordinates={tempCoordinates}
                />
            )}
        </div>
    );
};

export default Home;
