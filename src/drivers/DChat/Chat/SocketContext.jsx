// Fixed SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      const extractedUserId = decoded.userId || decoded.id || decoded.sub;

      const newSocket = io("https://fieldtriplinkbackend-production.up.railway.app", {
        transports: ["websocket", "polling"],
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      newSocket.userId = extractedUserId;

      newSocket.on("connect", () => {
        console.log("✅ Socket connected with ID:", newSocket.id);
        newSocket.emit("JOIN_APP", { userId: extractedUserId });
      });

      newSocket.on("disconnect", (reason) => {
        console.warn("🔌 Socket disconnected:", reason);
      });

      newSocket.on("reconnect", () => {
        console.log("🔄 Socket reconnected");
        newSocket.emit("JOIN_APP", { userId: extractedUserId });
      });

      // Add error handling
      newSocket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
      });

      setSocket(newSocket);
      setUserId(extractedUserId);

      return () => {
        console.log("🔌 Disconnecting socket");
        newSocket.disconnect();
      };
    } catch (err) {
      console.error("❌ Failed to parse token:", err);
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);