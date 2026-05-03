const BLOB_ID = '019dec7f-10e0-7e34-b5f0-1d7102ab6be1';
const BASE_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

// High-availability proxy list
const PROXIES = [
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest=',
    '' // Try direct as last resort
];

export const fetchDB = async () => {
    let lastError = null;
    
    for (const proxy of PROXIES) {
        try {
            const url = `${proxy}${BASE_URL}`;
            const response = await fetch(url, { 
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (err) {
            lastError = err;
            continue;
        }
    }
    
    console.error("CRITICAL_DATABASE_FAILURE:", lastError);
    return { enrollments: [], messages: [], admins: [] };
};

export const updateDB = async (newData) => {
    let lastError = null;
    
    for (const proxy of PROXIES) {
        try {
            const url = `${proxy}${BASE_URL}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newData)
            });
            if (response.ok) return true;
        } catch (err) {
            lastError = err;
            continue;
        }
    }
    
    console.error("CRITICAL_UPDATE_FAILURE:", lastError);
    return false;
};
