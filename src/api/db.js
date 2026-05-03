const BLOB_ID = '019dec7f-10e0-7e34-b5f0-1d7102ab6be1';
const BASE_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

// DEEP FIX: Use AllOrigins for GET (Most reliable) and CORSProxy for PUT
const GET_PROXY = 'https://api.allorigins.win/raw?url=';
const PUT_PROXY = 'https://corsproxy.io/?';

export const fetchDB = async () => {
    try {
        // We use AllOrigins for GET as it is extremely reliable globally
        const url = `${GET_PROXY}${encodeURIComponent(BASE_URL)}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("CRITICAL_FETCH_ERROR:", error);
        // Secondary fallback to direct link
        try {
            const fallback = await fetch(BASE_URL);
            return await fallback.json();
        } catch (e) {
            return { enrollments: [], messages: [], admins: [] };
        }
    }
};

export const updateDB = async (newData) => {
    try {
        const url = `${PUT_PROXY}${BASE_URL}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newData)
        });
        return response.ok;
    } catch (error) {
        console.error("CRITICAL_UPDATE_ERROR:", error);
        return false;
    }
};
