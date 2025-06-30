// app/config/firebase.ts
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these with your actual Firebase project config

const firebaseConfig = {
  apiKey: "AIzaSyCdK3jeEOtwHqLWuFHlPL-GqJrYs4sRtDg",
  authDomain: "expense-tracker-expo-b2084.firebaseapp.com",
  projectId: "expense-tracker-expo-b2084",
  storageBucket: "expense-tracker-expo-b2084.firebasestorage.app",
  messagingSenderId: "498363540236",
  appId: "1:498363540236:web:84a89ab44898baa96bdf29"
};


// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with persistence
let firebaseAuth: any;
try {
  firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  // If auth is already initialized, get the existing instance
  firebaseAuth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { firebaseAuth as auth, db };
