
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4HVgg92nNrk0nM2sneT0ojFb0HFmOVT4",
  authDomain: "thehairlocs-94374.firebaseapp.com",
  projectId: "thehairlocs-94374",
  storageBucket: "thehairlocs-94374.firebasestorage.app",
  messagingSenderId: "358707840743",
  appId: "1:358707840743:web:fe0a61952debef020c8442",
  measurementId: "G-23H15FBP4S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
