const API_URL = 'http://localhost:8000/api/spatial-data/';

// READ - Get all data
export const fetchSpatialData = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Error fetching spatial data:', error);
        return [];
    }
};

// READ - Get single data by ID
export const fetchSpatialDataById = async (id) => {
    try {
        const response = await fetch(`${API_URL}${id}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching spatial data by ID:', error);
        throw error;
    }
};

// CREATE - Add new data
export const createSpatialData = async (data) => {
    try {
        const response = await fetch(`${API_URL}create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating spatial data:', error);
        throw error;
    }
};

// UPDATE - Edit existing data
export const updateSpatialData = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating spatial data:', error);
        throw error;
    }
};

// DELETE - Remove data
export const deleteSpatialData = async (id) => {
    try {
        const response = await fetch(`${API_URL}${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting spatial data:', error);
        throw error;
    }
};
