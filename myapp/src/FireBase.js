import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyc8o5blCt0FJ9kzuRNPs4siBPQcPYuGQ",
  authDomain: "kubstore-fa5d8.firebaseapp.com",
  projectId: "kubstore-fa5d8",
  storageBucket: "kubstore-fa5d8.firebasestorage.app",
  messagingSenderId: "264202928256",
  appId: "1:264202928256:web:f6435636659c5df7332665",
  measurementId: "G-9V1QZP8JGN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
