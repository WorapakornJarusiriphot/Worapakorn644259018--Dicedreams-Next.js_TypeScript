// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQuWpiVDuNgcOqUAgp7SQjhs9RciRjqjE",
  authDomain: "dicedreams-69b21.firebaseapp.com",
  projectId: "dicedreams-69b21",
  storageBucket: "dicedreams-69b21.appspot.com",
  messagingSenderId: "822846315667",
  appId: "1:822846315667:web:c95fd1b001de4452570166",
  measurementId: "G-RBJRZTDHXP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };