// ============================================================
//  FIREBASE CONFIGURATION
//  Replace the values below with your Firebase project config.
//
//  HOW TO GET YOUR CONFIG:
//  1. Go to https://console.firebase.google.com
//  2. Create a project (e.g. "fti-admin")
//  3. Click the </> Web icon → Register app
//  4. Copy the firebaseConfig values shown and paste them here
//  5. In the Firebase Console: Build → Firestore Database → Create database
//     (Start in TEST mode, choose a region near you)
// ============================================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
