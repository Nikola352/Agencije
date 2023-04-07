// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAu_1oLHsGTKG2sg0v406Hzu9O3h8UC-g",
  authDomain: "agencije-wd-2023.firebaseapp.com",
  databaseURL: "https://agencije-wd-2023-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "agencije-wd-2023",
  storageBucket: "agencije-wd-2023.appspot.com",
  messagingSenderId: "898004202101",
  appId: "1:898004202101:web:f8d846ac096b9513147e3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);