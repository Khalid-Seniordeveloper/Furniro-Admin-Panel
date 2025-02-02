import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA_h_C2PBZQwtPWkzk_8Ohb4deOUEtwbJg",
  authDomain: "furniro-4d5ed.firebaseapp.com",
  projectId: "furniro-4d5ed",
  storageBucket: "furniro-4d5ed.firebasestorage.app",
  messagingSenderId: "58867002256",
  appId: "1:58867002256:web:778dc578d9a2464577e115",
  measurementId: "G-9H7QRRC186"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
