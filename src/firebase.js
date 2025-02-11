// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, remove } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "fir-project-af1d5.firebaseapp.com",
  databaseURL:
    "https://fir-project-af1d5-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "fir-project-af1d5",
  storageBucket: "fir-project-af1d5.firebasestorage.app",
  messagingSenderId: "589011608357",
  appId: "1:589011608357:web:e8b0d59051a41ad1f570cc",
  measurementId: "G-63C0S5BRV9",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db, ref, set, get, push, remove, analytics };
