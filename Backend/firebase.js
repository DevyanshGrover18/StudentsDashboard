// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvjD-eaIiD5B9AnPElIVlJ6kn4gfzvMkw",
  authDomain: "studentslist-c1355.firebaseapp.com",
  projectId: "studentslist-c1355",
  storageBucket: "studentslist-c1355.firebasestorage.app",
  messagingSenderId: "1009138639420",
  appId: "1:1009138639420:web:d0c314ea5e67e55c7c9939",
  measurementId: "G-B34W9BF205"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
