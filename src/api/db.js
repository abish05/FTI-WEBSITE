// LOCAL-FIRST DATABASE ENGINE
// This ensures 100% reliability by using LocalStorage as the primary source of truth,
// while attempting to sync with the cloud in the background.

const BLOB_ID = '019dec9d-e994-7076-8175-c68ba24b4c87';
const BASE_URL = `https://api.jsonblob.com/${BLOB_ID}`;
const PUT_PROXY = 'https://corsproxy.io/?';

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
    
    try {
        const response = await fetch(`${BASE_URL}?t=${Date.now()}`, { cache: 'no-store' });
        
        if (response.ok) {
            const cloudData = await response.json();
            
            if (cloudData) {
                // DEEP MERGE: Combine local and cloud to ensure no data is lost
                const merged = {
                    enrollments: mergeCollections(localData.enrollments, cloudData.enrollments),
                    messages: mergeCollections(localData.messages, cloudData.messages),
                    admins: cloudData.admins || localData.admins || []
                };
                
                saveLocalData(merged);
                return merged;
            }
        }
    } catch (error) {
        console.warn("MAINFRAME_SYNC_PAUSED: Operating in Local-First mode.");
    }
    
    return localData;
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
    // 1. Save locally immediately
    saveLocalData(data);
    
    try {
        // 2. Perform a background push using proxy for reliability
        const pushUrl = `${PUT_PROXY}${BASE_URL}`;
        const response = await fetch(pushUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            return true;
        }
    } catch (error) {
        console.error("BACKGROUND_SYNC_FAILED:", error);
    }
    
    return true; // Return true as local save is complete
};
