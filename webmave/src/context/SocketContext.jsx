import { io } from "socket.io-client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useUser } from "./UserContext";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onGoingCall, setOnGoingCall] = useState([]);

  const currentSocketUser = onlineUsers.find(
    (onlineUser) => onlineUser.userID == user.email
  );

  const handleCall = useCallback(
    (user) => {
      if (!currentSocketUser | !socket) return null;
      let participants = {
        caller: currentSocketUser,
        receiver: user,
      };

      setOnGoingCall({
        participants,
        isRinging: false,
      });
      socket.emit("call", participants);
    },
    [socket, currentSocketUser, onGoingCall]
  );

  const onIncomingCall = useCallback(
    (participants) => {
      setOnGoingCall({
        participants,
        isRinging: true,
      });
    },
    [socket, user, onGoingCall]
  );

  useEffect(() => {
    if (!user) return;

    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    function handleConnect() {
      setIsConnected(true);
      if (user) {
        socket.emit("addNewUser", user);
      }
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
    if (!socket || !socket.connected) return;

    socket.emit("addNewUser", user);

    socket.on("getUsers", (response) => setOnlineUsers(response));

    return () => {
      socket.off("getUsers", (response) => setOnlineUsers(response));
    };
  }, [socket, user, isConnected]);

  // Calls Listener
  useEffect(() => {
    if (!socket) return;
    if (!socket.connected) return;

    socket.on("incomingCall", onIncomingCall);

    return () => {
      socket.off("incomingCall", onIncomingCall);
    };
  }, [socket, isConnected, user, onIncomingCall]);

  return (
    <SocketContext.Provider value={{ onlineUsers, handleCall, onGoingCall }}>
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
