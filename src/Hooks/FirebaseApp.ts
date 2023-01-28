import { Database, getDatabase } from "firebase/database";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "<api key here>",
  authDomain: "trivia-c9a1d.firebaseapp.com",
  databaseURL: "https://trivia-c9a1d-default-rtdb.firebaseio.com",
  projectId: "trivia-c9a1d",
  storageBucket: "trivia-c9a1d.appspot.com",
  messagingSenderId: "259033362478",
  appId: "1:259033362478:web:b616e6a3e1522a10d22fbf",
  measurementId: "G-ZXY8HSMBSL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database: Database = getDatabase(app);
