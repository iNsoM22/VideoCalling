import { io } from "socket.io-client";
import React, { createContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  // This userUser would be a custom context that will be providing user details
  // or could be a function which interacts with the backend to get the user details.
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(null);

  useEffect(() => {
    // This line is preventing recursion
    // Has to be resolved in later versions.
    if (!user || socket) return;

    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || socket.connected) return;

    socket.emit("addNewUser", user);
    socket.on("getUsers", (response) => {
      setOnlineUsers(response);
    });

    return () => {
      socket.off("getUsers", (response) => {
        setOnlineUsers(response);
      });
    };
  }, [socket, user, onlineUsers]);

  return (
    <SocketContext.Provider value={[socket, isConnected, onlineUsers]}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = userContext(SocketContext);

  if (context === null) {
    throw new Error("Socket Error: useSocket must be used within a provider");
  }
  return context;
};
