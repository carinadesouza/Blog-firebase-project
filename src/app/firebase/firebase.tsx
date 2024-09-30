import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBGOUWbflA1jpt_pYBZ1TozGO6EdK9iMI0",
  authDomain: "blog-b84fe.firebaseapp.com",
  projectId: "blog-b84fe",
  storageBucket: "blog-b84fe.appspot.com",
  messagingSenderId: "401516248817",
  appId: "1:401516248817:web:79448b48c52cb2511bb350",
  measurementId: "G-CBV0ML43TK"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics and only use it on the client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export const storage = getStorage(app);
export { db, auth, analytics };