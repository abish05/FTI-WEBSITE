const BLOB_ID = '019dd8a2-22c1-745d-8817-5ba7ab32e1d2';
const API_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

export const fetchDB = async () => {
    try {
        const response = await fetch(API_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching database:", error);
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
        if (!response.ok) throw new Error('Network response was not ok');
        return true;
    } catch (error) {
        console.error("Error updating database:", error);
        return false;
    }
};
