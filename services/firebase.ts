import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDwldURmtljNpORmpGRacwXriPmQZjF6j8",
  authDomain: "daisy-n7g20a.firebaseapp.com",
  databaseURL: "https://daisy-n7g20a-default-rtdb.firebaseio.com",
  projectId: "daisy-n7g20a",
  storageBucket: "daisy-n7g20a.appspot.com",
  messagingSenderId: "225362605902",
  appId: "1:225362605902:web:d2551cc389e78c92c3d01f",
  measurementId: "G-KNZFYCREVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
