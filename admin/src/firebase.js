import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDycUi5fKVo7Trgc2jfUgBJBJhYfVA3VSI",
    authDomain: "chatoriapp.firebaseapp.com",
    projectId: "chatoriapp",
    storageBucket: "chatoriapp.firebasestorage.app",
    messagingSenderId: "271960677154",
    appId: "1:271960677154:web:55e0226ff6ca5ba448e37b",
    measurementId: "G-LLWFKG3HFP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
