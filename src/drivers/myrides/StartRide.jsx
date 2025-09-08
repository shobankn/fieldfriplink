// // tracker.js (frontend)
// import io from "socket.io-client";
// import {jwtDecode }from "jwt-decode";

// let socket = null;
// let interval = null;

// function getDriverId() {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.error("❌ No token found in localStorage");
//     return null;
//   }
//   try {
//     const decoded = jwtDecode(token);
//     const driverId = decoded?.id || decoded?.userId || decoded?.driverId || null;
//     console.log("🔑 Decoded driverId from token:", driverId);
//     return driverId;
//   } catch (err) {
//     console.error("❌ Error decoding token:", err.message);
//     return null;
//   }
// }

// export function startTracking(tripId, schoolId) {
//   const driverId = getDriverId();
//   if (!driverId) {
//     console.error("❌ Cannot start tracking: no driverId");
//     return;
//   }

//   console.log("🚀 Starting tracking for trip:", tripId, "school:", schoolId);

//   // connect socket
//   socket = io("https://fieldtriplinkbackend-production.up.railway.app", {
//     transports: ["websocket"],
//   });

//   socket.on("connect", () => {
//     console.log("🔌 Socket connected with id:", socket.id);
//     // JOIN_APP event
//     socket.emit("JOIN_APP", { userId: driverId });
//     console.log("📨 JOIN_APP sent with driverId:", driverId);
//   });

//   socket.on("connect_error", (err) => {
//     console.error("❌ Socket connection error:", err.message);
//   });

//   socket.on("disconnect", () => {
//     console.log("⚡️ Socket disconnected");
//   });

//   // send GPS every 2s
//   if (navigator.geolocation) {
//     interval = setInterval(() => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude, speed } = pos.coords;
//           console.log("📍 Got position:", latitude, longitude, "speed:", speed);

//           socket.emit("UPDATE_LOCATION", {
//             tripId,
//             driverId,
//             schoolId,
//             location: { lat: latitude, lng: longitude },
//             speed: speed || 0,
//           });

//           console.log("📨 UPDATE_LOCATION sent:", {
//             tripId,
//             driverId,
//             schoolId,
//             location: { lat: latitude, lng: longitude },
//             speed: speed || 0,
//           });
//         },
//         (err) => console.error("❌ Geolocation error:", err.message)
//       );
//     }, 5000);
//   } else {
//     console.error("❌ Geolocation not supported in this browser");
//   }
// }

// export function stopTracking() {
//   if (interval) {
//     clearInterval(interval);
//     console.log("🛑 Location interval cleared");
//   }
//   if (socket) {
//     socket.disconnect();
//     console.log("🛑 Socket disconnected");
//   }
// }






// import io from "socket.io-client";
// import {jwtDecode }from "jwt-decode";

// let socket = null;
// let interval = null;

// function getDriverId() {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.error("❌ No token found in localStorage");
//     return null;
//   }
//   try {
//     const decoded = jwtDecode(token);
//     const driverId = decoded?.id || decoded?.userId || decoded?.driverId || null;
//     console.log("🔑 Decoded driverId from token:", driverId);
//     return driverId;
//   } catch (err) {
//     console.error("❌ Error decoding token:", err.message);
//     return null;
//   }
// }

// export function startTracking(tripId, schoolId) {
//   const driverId = getDriverId();
//   if (!driverId) {
//     console.error("❌ Cannot start tracking: no driverId");
//     return;
//   }

//   console.log("🚀 Starting tracking for trip:", tripId, "school:", schoolId);

//   // connect socket
//   socket = io("https://fieldtriplinkbackend-production.up.railway.app", {
//     transports: ["websocket"],
//   });

//   socket.on("connect", () => {
//     console.log("🔌 Socket connected with id:", socket.id);
//     // JOIN_APP event
//     socket.emit("JOIN_APP", { userId: driverId });
//     console.log("📨 JOIN_APP sent with driverId:", driverId);
//   });

//   socket.on("connect_error", (err) => {
//     console.error("❌ Socket connection error:", err.message);
//   });

//   socket.on("disconnect", () => {
//     console.log("⚡️ Socket disconnected");
//   });

//   // send GPS every 2s
//   if (navigator.geolocation) {
//     interval = setInterval(() => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude, speed } = pos.coords;
//           console.log("📍 Got position:", latitude, longitude, "speed:", speed);

//           socket.emit("UPDATE_LOCATION", {
//             tripId,
//             driverId,
//             schoolId,
//             location: { lat: latitude, lng: longitude },
//             speed: speed || 0,
//           });

//           console.log("📨 UPDATE_LOCATION sent:", {
//             tripId,
//             driverId,
//             schoolId,
//             location: { lat: latitude, lng: longitude },
//             speed: speed || 0,
//           });
//         },
//         (err) => console.error("❌ Geolocation error:", err.message)
//       );
//     }, 5000);
//   } else {
//     console.error("❌ Geolocation not supported in this browser");
//   }
// }

// export function stopTracking() {
//   if (interval) {
//     clearInterval(interval);
//     console.log("🛑 Location interval cleared");
//   }
//   if (socket) {
//     socket.disconnect();
//     console.log("🛑 Socket disconnected");
//   }
// }





// tracker.js
// import io from "socket.io-client";
// import { jwtDecode } from "jwt-decode";

// let socket = null;
// let interval = null;

// function getDriverId() {
//   const token = localStorage.getItem("token");
//   if (!token) return null;
//   try {
//     const decoded = jwtDecode(token);
//     return decoded?.id || decoded?.userId || decoded?.driverId || null;
//   } catch (err) {
//     console.error("Error decoding token:", err.message);
//     return null;
//   }
// }

// export function startTracking(tripId, schoolId) {
//   const driverId = getDriverId();
//   if (!driverId) {
//     console.error("No driverId, cannot start tracking");
//     return;
//   }

//   console.log("🚀 Starting tracking for trip:", tripId);

//   // Persist active trip
//   localStorage.setItem("activeTrip", JSON.stringify({ tripId, schoolId }));

//   // Initialize socket if needed
//   if (!socket || socket.disconnected) {
//     socket = io("https://fieldtriplinkbackend-production.up.railway.app", {
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 2000,
//     });

//     socket.on("connect", () => {
//       console.log("🔌 Socket connected:", socket.id);
//       socket.emit("JOIN_APP", { userId: driverId });
//       console.log("📨 JOIN_APP sent with driverId:", driverId);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("⚡️ Socket disconnected:", reason);
//     });

//     socket.on("connect_error", (err) => {
//       console.error("❌ Socket connection error:", err.message);
//     });
//   }

//   // Clear previous interval
//   if (interval) clearInterval(interval);

//   const sendLocation = () => {
//     if (!navigator.geolocation) {
//       console.error("❌ Geolocation not supported");
//       return;
//     }

//     interval = setInterval(() => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude, speed } = pos.coords;

//           if (!socket || socket.disconnected) {
//             console.warn("Socket not connected, skipping location emit");
//             return;
//           }

//           socket.emit("UPDATE_LOCATION", {
//             tripId,
//             driverId,
//             schoolId,
//             location: { lat: latitude, lng: longitude },
//             speed: speed || 0,
//           });

//           console.log(
//             "📍 UPDATE_LOCATION sent:",
//             { tripId, driverId, schoolId, lat: latitude, lng: longitude, speed: speed || 0 }
//           );
//         },
//         (err) => console.error("❌ Geolocation error:", err.message)
//       );
//     }, 5000);
//   };

//   if (socket.connected) sendLocation();
//   else socket.on("connect", sendLocation);
// }

// export function stopTracking() {
//   if (interval) {
//     clearInterval(interval);
//     interval = null;
//     console.log("🛑 Location interval cleared");
//   }

//   if (socket) {
//     socket.disconnect();
//     socket = null;
//     console.log("🛑 Socket disconnected");
//   }

//   localStorage.removeItem("activeTrip");
// }

// export function initTrackingOnLoad() {
//   const active = localStorage.getItem("activeTrip");
//   if (active) {
//     const { tripId, schoolId } = JSON.parse(active);
//     console.log("🔄 Resuming tracking after refresh for trip:", tripId);
//     startTracking(tripId, schoolId);
//   }
// }





// tracker.js
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";

let socket = null;
let interval = null;

const GOOGLE_MAPS_API_KEY = 'AIzaSyCmxW7FtSQfxD0bpILwLJhqHsMfEn_QuPg';

function getDriverId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded?.id || decoded?.userId || decoded?.driverId || null;
  } catch (err) {
    console.error("Error decoding token:", err.message);
    return null;
  }
}

// ---- METHOD 1: Browser Geolocation API
function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 0,
        });
      },
      (err) => reject(err.message),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}

// ---- METHOD 2: Google Geolocation API
async function getGoogleLocation() {
  try {
    const res = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_MAPS_API_KEY}`,
      { method: "POST" }
    );
    if (!res.ok) throw new Error("Google API failed");
    const data = await res.json();
    return {
      latitude: data.location.lat,
      longitude: data.location.lng,
      accuracy: data.accuracy,
    };
  } catch (err) {
    console.error("❌ Google Geolocation API error:", err.message);
    return null;
  }
}

// ---- METHOD 3: Last known location from localStorage
function getLastKnownLocation() {
  try {
    const loc = localStorage.getItem("lastLocation");
    return loc ? JSON.parse(loc) : null;
  } catch {
    return null;
  }
}

// ---- Unified location fetch with OR operator fallback
async function fetchAccurateLocation() {
  let location = null;

  try {
    location = await getBrowserLocation();
    console.log("✅ Got location from Browser API");
  } catch {
    console.warn("⚠️ Browser geolocation failed, trying Google API");
    location = await getGoogleLocation();
  }

  if (!location) {
    console.warn("⚠️ Falling back to last known location");
    location = getLastKnownLocation();
  }

  if (location) {
    localStorage.setItem("lastLocation", JSON.stringify(location));
  }

  return location;
}

// ---- Tracking
// ---- Tracking
export async function startTracking(tripId, schoolId) {
  const driverId = getDriverId();
  if (!driverId) {
    console.error("No driverId, cannot start tracking");
    return;
  }

  console.log("🚀 Starting tracking for trip:", tripId);

  // Prompt for browser location first
  let loc = null;
  try {
    loc = await getBrowserLocation(); // <-- This triggers the permission prompt
    console.log("✅ User allowed location:", loc);
  } catch (err) {
    console.error("❌ User denied location or error:", err);
    alert("Cannot start ride without allowing location access.");
    return; // stop the ride if location permission denied
  }

  localStorage.setItem("activeTrip", JSON.stringify({ tripId, schoolId }));

  // Connect socket
  if (!socket || socket.disconnected) {
    socket = io("https://fieldtriplinkbackend-production.up.railway.app", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      socket.emit("JOIN_APP", { userId: driverId });
    });

    socket.on("disconnect", (reason) => {
      console.log("⚡️ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });
  }

  // Send first location immediately
  socket.emit("UPDATE_LOCATION", {
    tripId,
    driverId,
    schoolId,
    location: { lat: loc.latitude, lng: loc.longitude },
    accuracy: loc.accuracy,
  });
  console.log("📍 First location sent:", loc);

  // Start interval for periodic updates
  if (interval) clearInterval(interval);
  interval = setInterval(async () => {
    let currentLoc = await fetchAccurateLocation();
    if (!currentLoc || !socket || socket.disconnected) return;

    socket.emit("UPDATE_LOCATION", {
      tripId,
      driverId,
      schoolId,
      location: { lat: currentLoc.latitude, lng: currentLoc.longitude },
      accuracy: currentLoc.accuracy,
    });

    console.log("📍 UPDATE_LOCATION sent:", currentLoc);
  }, 5000);
}


export function stopTracking() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    console.log("🛑 Location interval cleared");
  }

  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🛑 Socket disconnected");
  }

  localStorage.removeItem("activeTrip");
}

export function initTrackingOnLoad() {
  const active = localStorage.getItem("activeTrip");
  if (active) {
    const { tripId, schoolId } = JSON.parse(active);
    console.log("🔄 Resuming tracking after refresh for trip:", tripId);
    startTracking(tripId, schoolId);
  }
}

