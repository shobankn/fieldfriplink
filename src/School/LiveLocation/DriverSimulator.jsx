// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const SOCKET_URL = "https://fieldtriplinkbackend-production.up.railway.app";

// export default function DriverSimulator() {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io(SOCKET_URL, { transports: ["websocket"] });
//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("🚖 Driver connected:", newSocket.id);

//       // Fake IDs for testing
//       const driverId = "driver123";
//       const tripId = "trip123";
//       const schoolId = "68933539d2cc260997867265"; // ✅ Replace with real schoolId from your token if needed

//       // 🔹 Step 1: Emit JOIN_APP (like a real user coming online)
//       newSocket.emit("JOIN_APP", { userId: driverId });
//       console.log("📡 Emitted JOIN_APP with driverId:", driverId);

//       // 🔹 Step 2: Simulate live location updates
//       let lat = 24.8607; // starting latitude
//       let lng = 67.0011; // starting longitude

//       const interval = setInterval(() => {
//         lat += (Math.random() - 0.5) * 0.001;
//         lng += (Math.random() - 0.5) * 0.001;
//         const speed = Math.floor(Math.random() * 60);

//         const payload = {
//           tripId,
//           driverId,
//           schoolId,
//           location: { lat, lng },
//           speed,
//         };

//         newSocket.emit("UPDATE_LOCATION", payload);
//         console.log("📤 Sent location update:", payload);
//       }, 2000);

//       // Cleanup
//       return () => clearInterval(interval);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("⚠️ Driver socket disconnected");
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-bold">🚖 Driver Simulator Running...</h2>
//       <p>Check console logs for JOIN_APP and LOCATION_UPDATE events.</p>
//     </div>
//   );
// }
