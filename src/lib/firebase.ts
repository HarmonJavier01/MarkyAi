import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBemZSIHe78xvC1ADUOB8BlVUxgnU92iNc",
  authDomain: "markyai.firebaseapp.com",
  projectId: "markyai",
  storageBucket: "markyai.firebasestorage.app",
  messagingSenderId: "610498481633",
  appId: "1:610498481633:web:c51607bc18044a674516a0",
  measurementId: "G-BCQB48C2PM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
