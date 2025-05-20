// src/firebase.js
// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app"; // ✅ Aqui está o necessário

import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtxqY77Zemi4-_wbet7TAel61d9hw_iYg",
  authDomain: "phelifla-chat.firebaseapp.com",
  projectId: "phelifla-chat",
  storageBucket: "phelifla-chat.firebasestorage.app",
  messagingSenderId: "803919627793",
  appId: "1:803919627793:web:50d318972cccc436fd13b0"
};

//const app = initializeApp(firebaseConfig);
// ✅ Maneira compatível com o ESLint
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const fetchCategorias = async () => {
  const snapshot = await getDocs(collection(db, "categorias"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    nome: doc.data().nome
  }));
};

export { db, auth, provider, fetchCategorias };
