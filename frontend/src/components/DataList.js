import React from 'react';
import { deleteSpatialData } from '../services/api';

const DataList = ({ data, onEdit, onRefresh }) => {
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await deleteSpatialData(id);
                onRefresh();
            } catch (error) {
                alert('Error deleting data: ' + error.message);
            }
        }
    };

    return (
        <div className="data-list">
            <h3>Spatial Data List</h3>
            {data.length === 0 ? (
                <p>No data available.</p>
            ) : (
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.location.lat.toFixed(4)}</td>
                                    <td>{item.location.lng.toFixed(4)}</td>
                                    <td>
                                        <button 
                                            onClick={() => onEdit(item)}
                                            className="btn-edit"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id, item.name)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DataList;
