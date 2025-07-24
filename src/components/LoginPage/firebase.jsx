import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut, 
    signInAnonymously, 
    signInWithCustomToken, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// It's good practice to have a unique identifier for your app instance
export const appId = import.meta.env.VITE_NATRA_APP_ID || 'default-natra-app';

// Export all necessary Firebase Auth and Firestore functions and modules
export { 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut, 
    signInAnonymously, 
    signInWithCustomToken, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    doc, 
    setDoc, 
    getDoc 
};
