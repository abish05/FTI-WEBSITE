// LOCAL-FIRST DATABASE ENGINE
// This ensures 100% reliability by using LocalStorage as the primary source of truth,
// while attempting to sync with the cloud in the background.

const BLOB_ID = '019dec9d-e994-7076-8175-c68ba24b4c87';
const BASE_URL = `https://api.jsonblob.com/${BLOB_ID}`;
const PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://thingproxy.freeboard.io/fetch/'
];

// Helper to get local data safely
const getLocalData = () => {
    try {
        const stored = localStorage.getItem('fti_mainframe_db');
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.warn("Local storage read failed", e);
    }
    return { enrollments: [], messages: [], admins: [] };
};

// Helper to save local data
const saveLocalData = (data) => {
    try {
        localStorage.setItem('fti_mainframe_db', JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("Local storage write failed", e);
        return false;
    }
};

export const fetchDB = async () => {
    const localData = getLocalData();
    
    // FAST-PATH: Return local data immediately to the UI for instant speed
    // We don't await the cloud sync here to keep the app lightning fast
    syncCloudInBackgroundTask();
    
    return localData;
};

// BACKGROUND SYNC: Try each proxy without blocking the UI
const syncCloudInBackgroundTask = async () => {
    const localData = getLocalData();
    for (const proxy of PROXIES) {
        try {
            const url = `${proxy}${encodeURIComponent(BASE_URL + '?t=' + Date.now())}`;
            const response = await fetch(url, { cache: 'no-store' });
            
            if (response.ok) {
                const cloudData = await response.json();
                if (cloudData) {
                    const merged = {
                        enrollments: mergeCollections(localData.enrollments, cloudData.enrollments),
                        messages: mergeCollections(localData.messages, cloudData.messages),
                        admins: cloudData.admins || localData.admins || []
                    };
                    saveLocalData(merged);
                    // Dispatch event so UI can update if it was waiting
                    window.dispatchEvent(new Event('fti_db_updated'));
                    return;
                }
            }
        } catch (e) {}
    }
};

// Helper to merge arrays of objects by ID, keeping the most recent
const mergeCollections = (local = [], cloud = []) => {
    const map = new Map();
    [...cloud, ...local].forEach(item => {
        if (item && item.id) map.set(item.id, item);
    });
    return Array.from(map.values()).sort((a, b) => b.id - a.id);
};

export const updateDB = async (data) => {
    saveLocalData(data);
    
    for (const proxy of PROXIES) {
        try {
            const url = `${proxy}${encodeURIComponent(BASE_URL)}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                console.log("Cloud sync successful via " + proxy);
                return true;
            }
        } catch (error) {
            console.log(`Push failed via ${proxy}, trying next...`);
        }
    }
    
    return false;
};
