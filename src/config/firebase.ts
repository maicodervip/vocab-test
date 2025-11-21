// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork } from 'firebase/firestore';

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

// Enable network for Firestore (fix offline issues)
enableNetwork(db).catch((error) => {
  console.warn('Could not enable Firestore network:', error);
});

export default app;
