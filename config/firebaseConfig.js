import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgpK4HG8q4TDxv24g8G7zNPU-EVjN4XPs",
  authDomain: "interior-ai-8cfe9.firebaseapp.com",
  projectId: "interior-ai-8cfe9",
  storageBucket: "interior-ai-8cfe9.firebasestorage.app",
  messagingSenderId: "813173262410",
  appId: "1:813173262410:web:dabd2af0a8df2349483eb3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);