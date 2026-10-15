import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function connectFirebase() {
  const requiredConfig = [
    firebaseConfig.apiKey,
    firebaseConfig.databaseURL,
    firebaseConfig.projectId,
    firebaseConfig.appId,
  ];

  if (requiredConfig.some((value) => !value)) {
    return {
      connected: false,
      message: "Firebase pendiente: completa los valores VITE_FIREBASE_ en .env.local.",
    };
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const database = getDatabase(app);

  return {
    connected: true,
    database,
    message: "Conectando a Firebase Realtime Database…",
  };
}
