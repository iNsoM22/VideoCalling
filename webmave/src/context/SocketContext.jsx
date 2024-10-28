import { io } from "socket.io-client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "./UserContext";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    function handleConnect() {
      setIsConnected(true);
    }
    function handleDisconnect() {
      setIsConnected(false);
    }

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
    function handleGetUsers(response) {
      setOnlineUsers(response);
    }

    socket.on("getUsers", handleGetUsers);

    return () => {
      socket.off("getUsers", handleGetUsers);
    };
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === null) {
    throw new Error("Socket Error: useSocket must be used within a provider");
  }
  return context;
};
