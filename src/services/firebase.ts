import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnpvppzSLSV5xc0uVcr4C4nXVGzHXJ7IU",
  authDomain: "asean-dashboard.firebaseapp.com",
  projectId: "asean-dashboard",
  storageBucket: "asean-dashboard.firebasestorage.app",
  messagingSenderId: "82346298784",
  appId: "1:82346298784:web:18595044422d02e04468c5",
  measurementId: "G-E1VESD5609"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);