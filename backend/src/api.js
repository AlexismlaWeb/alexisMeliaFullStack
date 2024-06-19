const API_URL = 'http://localhost:3001';

// Exemple de requête GET
export const getExampleData = async () => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Exemple de requête POST
export const postExampleData = async (data) => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};
