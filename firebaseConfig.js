
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhlbpJ5sZwgyPO8kHzGe8QZ158OWl4zZQ",
  authDomain: "forestfire-47ced.firebaseapp.com",
  projectId: "forestfire-47ced",
  storageBucket: "forestfire-47ced.firebasestorage.app",
  messagingSenderId: "376286415602",
  appId: "1:376286415602:web:39de9e16ffe6b6e4095e6b",
  measurementId: "G-XY94E21T9Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);