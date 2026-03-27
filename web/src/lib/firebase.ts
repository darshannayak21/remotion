import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTLlJNZ8l2_vUXIRi5ROt0dN_3PvUBndM",
  authDomain: "remotion9920.firebaseapp.com",
  projectId: "remotion9920",
  storageBucket: "remotion9920.firebasestorage.app",
  messagingSenderId: "433078054828",
  appId: "1:433078054828:web:89ba0270f8b695f5911409",
  measurementId: "G-Y16RYBMBF1",
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
