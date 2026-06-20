const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const oldApp = initializeApp({
  apiKey: "AIzaSyCYCAyz6rrxbIBefJ4cX1eSa1QzcIzpZaw",
  authDomain: "fti-admin.firebaseapp.com",
  projectId: "fti-admin",
}, "oldApp");

async function run() {
  try {
    const auth = getAuth(oldApp);
    await signInAnonymously(auth);
    console.log("Anonymous auth successful!");
    
    const oldDb = getFirestore(oldApp);
    const snap = await getDocs(collection(oldDb, 'demoBookings'));
    console.log(`Found ${snap.size} demoBookings!`);
    snap.docs.forEach(d => console.log(d.data()));
  } catch (e) {
    console.error("Failed:", e.message);
  }
  process.exit(0);
}
run();
