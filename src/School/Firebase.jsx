// src/School/Firebase.jsx
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, isSupported ,onMessage } from "firebase/messaging";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3VXKkaLGIdpL4QOCyr69zXAy4_IBpDjw",
  authDomain: "fieldtriplink-3824c.firebaseapp.com",
  projectId: "fieldtriplink-3824c",
  storageBucket: "fieldtriplink-3824c.firebasestorage.app",
  messagingSenderId: "507798786318",
  appId: "1:507798786318:web:ff51b27bd669384cc8c75f",
  measurementId: "G-1TSSZ96E51",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// ✅ Export helper for FCM
export const getMessagingIfSupported = async () => {
  const supported = await isSupported().catch(() => false);
  return supported ? getMessaging(app) : null;


};


// ✅ Listen for foreground messages
export const listenToMessages = async (callback) => {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("📩 Foreground FCM:", payload);
    callback(payload);
  });
};
