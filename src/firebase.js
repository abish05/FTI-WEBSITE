import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQnmXpQR9pDgXMDIvHrMnLGU30oX8IQ6Y",
  authDomain: "fti-admin-3db6b.firebaseapp.com",
  databaseURL: "https://fti-admin-3db6b-default-rtdb.firebaseio.com",
  projectId: "fti-admin-3db6b",
  storageBucket: "fti-admin-3db6b.firebasestorage.app",
  messagingSenderId: "269900784570",
  appId: "1:269900784570:web:cf48c32c4ab58375fa7383",
  measurementId: "G-QWSWQ8PE7D"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
