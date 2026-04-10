import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_ENV_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_ENV_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_ENV_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_ENV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_ENV_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ENV_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_ENV_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(
  app,
  process.env.REACT_APP_FUNCTIONS_REGION || 'us-central1'
);

export const analyticsPromise = analyticsSupported()
  .then((ok) => (ok ? getAnalytics(app) : null))
  .catch(() => null);
