import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3DsTDhrnn1to-1SZ3c2Uls_hliwLQ1Fo",
  authDomain: "ai-kpi-dashboard.firebaseapp.com",
  projectId: "ai-kpi-dashboard",
  storageBucket: "ai-kpi-dashboard.firebasestorage.app",
  messagingSenderId: "334489433469",
  appId: "1:334489433469:web:b788d6f323c602994c0814",
  measurementId: "G-C8PLJS43GC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;