// ============================================================
//  FIRESTORE DATABASE ENGINE
//  All data is stored in Firebase Firestore — a real-time
//  cloud database. Data entered on any page (Admission,
//  Contact) is immediately visible in the Admin dashboard
//  from any browser or device.
// ============================================================

import { db } from '../firebase';
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    query,
    orderBy,
    serverTimestamp,
    onSnapshot,
    updateDoc
} from 'firebase/firestore';

// ---- LOCAL CACHE (for instant UI, while Firestore loads) ----
const getLocalCache = () => {
    try {
        const stored = localStorage.getItem('fti_cache');
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { enrollments: [], messages: [], admins: [] };
};

const saveLocalCache = (data) => {
    try {
        localStorage.setItem('fti_cache', JSON.stringify(data));
    } catch (e) {}
};

// ---- FETCH ALL DATA FROM FIRESTORE ----
export const fetchDB = async () => {
    try {
        const [enrollSnap, msgSnap, adminSnap] = await Promise.all([
            getDocs(query(collection(db, 'enrollments'), orderBy('createdAt', 'desc'))),
            getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc'))),
            getDocs(collection(db, 'admins'))
        ]);

        const enrollments = enrollSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const messages = msgSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const admins = adminSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const data = { enrollments, messages, admins };
        saveLocalCache(data);
        return data;
    } catch (err) {
        console.error('Firestore fetchDB error:', err);
        // Return local cache as fallback if offline
        return getLocalCache();
    }
};

// ---- SUBSCRIBE TO REAL-TIME UPDATES (Admin dashboard) ----
// Returns an unsubscribe function. Call it on component unmount.
export const subscribeToEnrollments = (callback) => {
    const q = query(collection(db, 'enrollments'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        const enrollments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(enrollments);
    }, (err) => {
        console.error('Enrollment subscription error:', err);
    });
};

export const subscribeToMessages = (callback) => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(messages);
    }, (err) => {
        console.error('Message subscription error:', err);
    });
};

export const subscribeToAdmins = (callback) => {
    // Sort admins by creation date descending
    const q = query(collection(db, 'admins'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        const admins = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(admins);
    }, (err) => {
        console.error('Admin subscription error:', err);
    });
};

// ---- ADD ENROLLMENT (from Admission page) ----
export const addEnrollment = async (formData) => {
    try {
        const docRef = await addDoc(collection(db, 'enrollments'), {
            ...formData,
            createdAt: serverTimestamp(),
            date: new Date().toLocaleString('en-IN')
        });
        return { success: true, id: docRef.id };
    } catch (err) {
        console.error('addEnrollment error:', err);
        return { success: false, error: err.message };
    }
};

// ---- ADD MESSAGE (from Contact page) ----
export const addMessage = async (formData) => {
    try {
        const docRef = await addDoc(collection(db, 'messages'), {
            ...formData,
            createdAt: serverTimestamp(),
            date: new Date().toLocaleDateString('en-IN')
        });
        return { success: true, id: docRef.id };
    } catch (err) {
        console.error('addMessage error:', err);
        return { success: false, error: err.message };
    }
};

// ---- DELETE ENROLLMENT (from Admin page) ----
export const deleteEnrollment = async (id) => {
    try {
        await deleteDoc(doc(db, 'enrollments', id));
        return true;
    } catch (err) {
        console.error('deleteEnrollment error:', err);
        return false;
    }
};

// ---- DELETE MESSAGE ----
export const deleteMessage = async (id) => {
    try {
        await deleteDoc(doc(db, 'messages', id));
        return true;
    } catch (err) {
        console.error('deleteMessage error:', err);
        return false;
    }
};

// ---- ADD ADMIN ----
export const addAdmin = async (adminData) => {
    try {
        const docRef = await addDoc(collection(db, 'admins'), {
            ...adminData,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (err) {
        console.error('addAdmin error:', err);
        return { success: false, error: err.message };
    }
};

// ---- DELETE ADMIN ----
export const deleteAdmin = async (id) => {
    try {
        await deleteDoc(doc(db, 'admins', id));
        return true;
    } catch (err) {
        console.error('deleteAdmin error:', err);
        return false;
    }
};

// ---- UPDATE ADMIN ----
export const updateAdmin = async (id, adminData) => {
    try {
        await updateDoc(doc(db, 'admins', id), adminData);
        return true;
    } catch (err) {
        console.error('updateAdmin error:', err);
        return false;
    }
};

// ---- UPDATE ADMIN STATUS ----
export const updateAdminStatus = async (id, isOnline) => {
    try {
        await updateDoc(doc(db, 'admins', id), { isOnline });
        return true;
    } catch (err) {
        console.error('updateAdminStatus error:', err);
        return false;
    }
};

// ---- LEGACY COMPATIBILITY (updateDB is no longer needed) ----
export const updateDB = async () => true;

// ============================================================
//  SITE POPUP CONFIG
//  Stored in Firestore as a single document: siteConfig/popup
// ============================================================

export const getPopupConfig = async () => {
    try {
        const ref = doc(db, 'siteConfig', 'popup');
        const snap = await getDoc(ref);
        if (snap.exists()) return snap.data();
        return { enabled: false, title: '', message: '', buttonText: 'Book a Demo', buttonLink: '' };
    } catch (err) {
        console.error('getPopupConfig error:', err);
        return { enabled: false, title: '', message: '', buttonText: 'Book a Demo', buttonLink: '' };
    }
};

export const savePopupConfig = async (config) => {
    try {
        const ref = doc(db, 'siteConfig', 'popup');
        await setDoc(ref, { ...config, updatedAt: serverTimestamp() });
        return true;
    } catch (err) {
        console.error('savePopupConfig error:', err);
        return false;
    }
};

export const subscribeToPopupConfig = (callback) => {
    const ref = doc(db, 'siteConfig', 'popup');
    return onSnapshot(ref, (snap) => {
        if (snap.exists()) callback(snap.data());
        else callback({ enabled: false });
    }, (err) => {
        console.error('Popup config subscription error:', err);
    });
};

// ============================================================
//  DEMO BOOKINGS
//  Stored in Firestore collection: demoBookings
// ============================================================
export const addDemoBooking = async (formData) => {
    try {
        const docRef = await addDoc(collection(db, 'demoBookings'), {
            ...formData,
            status: 'pending',
            createdAt: serverTimestamp(),
            date: new Date().toLocaleString('en-IN')
        });
        return { success: true, id: docRef.id };
    } catch (err) {
        console.error('addDemoBooking error:', err);
        return { success: false, error: err.message };
    }
};

export const subscribeToDemoBookings = (callback) => {
    const q = query(collection(db, 'demoBookings'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        const bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(bookings);
    }, (err) => {
        console.error('Demo bookings subscription error:', err);
    });
};

const EMAIL_WORKER_URL = 'https://email-worker.ftitraining.workers.dev';

export const updateDemoBookingStatus = async (id, status) => {
    try {
        // 1. Update status in Firestore
        const bookingRef = doc(db, 'demoBookings', id);
        await updateDoc(bookingRef, { status });

        // 2. If confirmed → fetch booking data and email the student
        if (status === 'confirmed') {
            try {
                const snap = await getDoc(bookingRef);
                if (snap.exists()) {
                    const b = snap.data();
                    await fetch(EMAIL_WORKER_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'demo_confirmation',
                            fullName: b.fullName,
                            email:    b.email,
                            phone:    b.phone,
                            course:   b.course,
                            location: b.location || '',
                            pincode:  b.pincode  || '',
                        }),
                    });
                }
            } catch (emailErr) {
                // Non-blocking — status was already updated
                console.warn('Confirmation email failed (non-critical):', emailErr.message);
            }
        }

        return true;
    } catch (err) {
        console.error('updateDemoBookingStatus error:', err);
        return false;
    }
};

export const deleteDemoBooking = async (id) => {
    try {
        await deleteDoc(doc(db, 'demoBookings', id));
        return true;
    } catch (err) {
        console.error('deleteDemoBooking error:', err);
        return false;
    }
};
