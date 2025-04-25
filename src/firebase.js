// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtxqY77Zemi4-_wbet7TAel61d9hw_iYg",
  authDomain: "phelifla-chat.firebaseapp.com",
  projectId: "phelifla-chat",
  storageBucket: "phelifla-chat.firebasestorage.app",
  messagingSenderId: "803919627793",
  appId: "1:803919627793:web:50d318972cccc436fd13b0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
