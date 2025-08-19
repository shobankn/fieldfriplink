import { useEffect } from "react";
import { useSocketContext } from "../SocketContext";

const useSocket = ({ onMessageReceived, onMessageSent, onUserStatusChange }) => {
  const socket = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    if (onMessageReceived) {
      socket.on("RECEIVE_MESSAGE", onMessageReceived);
    }

    if (onMessageSent) {
      socket.on("SEND_MESSAGE_SUCCESS", onMessageSent);
    }

    if (onUserStatusChange) {
      socket.on("USER_STATUS_CHANGE", onUserStatusChange);
    }

    return () => {
      if (onMessageReceived) {
        socket.off("RECEIVE_MESSAGE", onMessageReceived);
      }

      if (onMessageSent) {
        socket.off("SEND_MESSAGE_SUCCESS", onMessageSent);
      }

      if (onUserStatusChange) {
        socket.off("USER_STATUS_CHANGE", onUserStatusChange);
      }
    };
  }, [socket, onMessageReceived, onMessageSent, onUserStatusChange]);

  return socket;
};

export default useSocket;
