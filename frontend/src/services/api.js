const API_URL = 'http://localhost:8000/api/spatial-data/';

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
