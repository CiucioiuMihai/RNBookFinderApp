// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";    
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9OHn9S3MtTUYbsTELvte1wSAb3FO1bSk",
  authDomain: "bookfinderapprn.firebaseapp.com",
  databaseURL: "https://bookfinderapprn-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bookfinderapprn",
  storageBucket: "bookfinderapprn.firebasestorage.app",
  messagingSenderId: "542131814135",
  appId: "1:542131814135:web:ac85803c44aaa3a9bb5df2",
  measurementId: "G-YRQED86ZRG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestoreDB = getFirestore(app);
const realtimeDB = getDatabase(app);
const auth = getAuth(app);

// Export the Firebase services to be used throughout the app
export { app, analytics, firestoreDB, realtimeDB, auth };