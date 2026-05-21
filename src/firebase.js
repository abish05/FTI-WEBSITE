import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYCAyz6rrxbIBefJ4cX1eSa1QzcIzpZaw",
  authDomain: "fti-admin.firebaseapp.com",
  databaseURL: "https://fti-admin-default-rtdb.firebaseio.com",
  projectId: "fti-admin",
  storageBucket: "fti-admin.firebasestorage.app",
  messagingSenderId: "949078967834",
  appId: "1:949078967834:web:25254e07ac22038b9c33a3",
  measurementId: "G-56KBLCB1HC"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
