// ====================================================================
// FIREBASE CONFIGURATION & INITIALIZATION
// EMBEDX INTERACTIVE - Mentimeter-Inspired Live Engagement Platform
// SRM TRP Engineering College - Department of EEE
// ====================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBgfDANmUAa7VVu9Dmwpi4c3wu202RZ9Fs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "embedx-session-site.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "embedx-session-site",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "embedx-session-site.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "58219762584",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:58219762584:web:56796ca78f14fc089691ed",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-EHD67H84NR"
};

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics (supported in browser environments)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('🔥 Firebase Analytics Initialized: G-EHD67H84NR');
    }
  }).catch(() => {});
}

console.log('🔥 Firebase Initialized for Project:', firebaseConfig.projectId);
