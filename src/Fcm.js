

import { getMessagingIfSupported } from "../src/School/Firebase"; // adjust path if different
import { getToken } from "firebase/messaging";


export async function requestFcmToken() {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return { token: null, error: "This browser does not support notifications." };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { token: null, error: "Permission not granted" };

  // Register service worker
  const swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

  try {
    const token = await getToken(messaging, {
      vapidKey: "BD8yRzMD-L5HA4OBavdG-VIg8CeeavBCVBzvWzTt2i13ALno8l03lODK7uugAZ2TbbGOR0FtcM5pMLgj-3wdjsU", // from Firebase Console → Project Settings → Cloud Messaging
      serviceWorkerRegistration: swReg,
    });
    return { token };
  } catch (err) {
    return { token: null, error: err.message };
  }
}
