// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBx5km7itkAxBUs2FJ0zpqRqgWL7702EIY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vocab-test-dfcef.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vocab-test-dfcef",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vocab-test-dfcef.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1081022587442",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1081022587442:web:2cd02f8cd40d58b308122b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});

export default app;
