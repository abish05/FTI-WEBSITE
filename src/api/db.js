const BLOB_ID = '019dec7f-10e0-7e34-b5f0-1d7102ab6be1';
// Using corsproxy.io as it supports PUT/GET/POST methods
const PROXY = 'https://corsproxy.io/?';
const API_URL = `${PROXY}https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

export const fetchDB = async () => {
    try {
        const response = await fetch(API_URL, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("MAINFRAME_SYNC_ERROR:", error);
        // Return default structure so the app doesn't crash
        return { enrollments: [], messages: [], admins: [] };
    }
};

export const updateDB = async (newData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(newData)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return true;
    } catch (error) {
        console.error("MAINFRAME_UPDATE_ERROR:", error);
        return false;
    }
};
