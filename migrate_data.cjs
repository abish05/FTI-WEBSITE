const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, setDoc, doc } = require('firebase/firestore');

// OLD APP
const oldApp = initializeApp({
  apiKey: "AIzaSyCYCAyz6rrxbIBefJ4cX1eSa1QzcIzpZaw",
  authDomain: "fti-admin.firebaseapp.com",
  databaseURL: "https://fti-admin-default-rtdb.firebaseio.com",
  projectId: "fti-admin",
  storageBucket: "fti-admin.firebasestorage.app",
  messagingSenderId: "949078967834",
  appId: "1:949078967834:web:25254e07ac22038b9c33a3",
}, "oldApp");

const oldDb = getFirestore(oldApp);

// NEW APP
const newApp = initializeApp({
  apiKey: "AIzaSyDQnmXpQR9pDgXMDIvHrMnLGU30oX8IQ6Y",
  authDomain: "fti-admin-3db6b.firebaseapp.com",
  databaseURL: "https://fti-admin-3db6b-default-rtdb.firebaseio.com",
  projectId: "fti-admin-3db6b",
  storageBucket: "fti-admin-3db6b.firebasestorage.app",
  messagingSenderId: "269900784570",
  appId: "1:269900784570:web:cf48c32c4ab58375fa7383",
}, "newApp");

const newDb = getFirestore(newApp);

async function migrateCollection(collName) {
  console.log(`Migrating ${collName}...`);
  try {
    const snap = await getDocs(collection(oldDb, collName));
    console.log(`Found ${snap.size} documents in ${collName}.`);
    for (const d of snap.docs) {
      await setDoc(doc(newDb, collName, d.id), d.data());
    }
    console.log(`Migrated ${collName} successfully.`);
  } catch (err) {
    console.error(`Error migrating ${collName}:`, err.message);
  }
}

async function run() {
  await migrateCollection('enrollments');
  await migrateCollection('messages');
  await migrateCollection('demoBookings');
  await migrateCollection('admins');
  console.log('Migration complete.');
  process.exit(0);
}

run();
