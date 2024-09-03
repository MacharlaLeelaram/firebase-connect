// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFexdtLWavNkljdwoVxKCunu74-tfTS28",
  authDomain: "fir-connect-433c2.firebaseapp.com",
  projectId: "fir-connect-433c2",
  storageBucket: "fir-connect-433c2.appspot.com",
  messagingSenderId: "416462699538",
  appId: "1:416462699538:web:33a60209080a606d0c2ccb",
  measurementId: "G-NC2G0Q94EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
