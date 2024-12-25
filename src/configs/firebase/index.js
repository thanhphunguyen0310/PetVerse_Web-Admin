import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "petverse-chatting.firebaseapp.com",
  projectId: "petverse-chatting",
  storageBucket: "petverse-chatting.appspot.com",
  messagingSenderId: "943355249739",
  appId: "1:943355249739:web:aaba9402eb06080c36f9ce",
  measurementId: "G-5T2MLV0JC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);