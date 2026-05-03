// FRESH VERIFIED DATABASE ID
const BLOB_ID = '019dec9d-e994-7076-8175-c68ba24b4c87';
const BASE_URL = `https://api.jsonblob.com/${BLOB_ID}`;

// We use corsproxy.io as it is the most compatible with api.jsonblob.com
const PROXY = 'https://corsproxy.io/?';
const API_URL = `${PROXY}${BASE_URL}`;

export const fetchDB = async () => {
    try {
        const response = await fetch(API_URL, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("DATABASE_FETCH_ERROR:", error);
        // Direct fallback attempt if proxy fails
        try {
            const fallback = await fetch(BASE_URL);
            if (fallback.ok) return await fallback.json();
        } catch (e) {}
        return { enrollments: [], messages: [], admins: [] };
    }
};

export const updateDB = async (newData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newData)
        });
        return response.ok;
    } catch (error) {
        console.error("DATABASE_UPDATE_ERROR:", error);
        return false;
    }
};
