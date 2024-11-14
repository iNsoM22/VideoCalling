import { io } from "socket.io-client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useUser } from "./UserContext";
import Peer, { SignalData } from "simple-peer";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onGoingCall, setOnGoingCall] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [peerData, setPeerData] = useState(null);

  const currentSocketUser = onlineUsers.find(
    (onlineUser) => onlineUser.userID == user.email
  );

  const handleCallEnd = useCallback(() => {}, []);

  const createPeer = useCallback(
    ({ stream, initiator }) => {
      const iceServers = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ];
      const peer = new Peer({
        stream,
        initiator,
        trickle: true,
        config: { iceServers },
      });
      peer.on("stream", (stream) => {
        setPeerData((prevPeer) => {
          if (prevPeer) {
            return { ...prevPeer, stream };
          }
          return prevPeer;
        });
      });
      peer.on("error", console.error);

      // Complete the EndCall function here.
      peer.on("close", () => handleCallEnd());
      const rtcPeerConnection = peer._pc;

      rtcPeerConnection.oniceconnectionstatechange = async () => {
        if (
          rtcPeerConnection.iceConnectionState === "disconnected" ||
          rtcPeerConnection === "failed"
        ) {
          handleCallEnd({});
        }
      };
      return peer;
    },
    [currentlyGoingCall, setPeerData]
  );

  const completePeerConnection = useCallback(
    (connectionData) => {
      if (!localStream) {
        console.log("ERROR: Missing the LocalStream!");
        return;
      }
      if (peer) {
        peer.peerConnection?.signal(connectionData.sdp);
        return;
      }
      const newPeer = createPeer({ localStream, initiator: true });

      setPeerData({
        peerConnection: newPeer,
        participantUser: connectionData.currentlyGoingCall.receiver.caller,
        stream: undefined,
      });

      newPeer.on("signal", async (data) => {
        if (!socket) return;
        socket.emit("webrtcSignal", {
          sdp: data,
          currentlyGoingCall,
          isCaller: false,
        });
      });
    },
    [localStream, createPeer, peerData, onGoingCall]
  );

  const handleJoinCall = useCallback(
    async (currentlyGoingCall) => {
      setOnGoingCall((prev) => {
        if (prev) {
          return { ...prev, isRinging: false };
        }
        return prev;
      });
      const stream = await getMediaStream();
      if (!stream) return;

      const newPeer = createPeer({ stream, initiator: true });

      setPeerData({
        peerConnection: newPeer,
        participantUser: currentlyGoingCall.participants.caller,
        stream: undefined,
      });

      newPeer.on("signal", async (data) => {
        if (!socket) return;
        socket.emit("webrtcSignal", {
          sdp: data,
          currentlyGoingCall,
          isCaller: false,
        });
      });
    },
    [socket, currentSocketUser]
  );

  const getMediaStream = useCallback(
    async (facemode = "user") => {
      if (localStream) return localStream;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );

        const stream = navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 400, ideal: 800, max: 1200 },
            height: { min: 300, ideal: 600, max: 800 },
            frameRate: { min: 15, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? facemode : undefined,
          },
        });
        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.log("Error: Failed to get the stream.");
        setLocalStream(null);
        return null;
      }
    },
    [localStream]
  );

  const handleCall = useCallback(
    async (user) => {
      if (!currentSocketUser | !socket) return null;

      const stream = await getMediaStream();

      if (!stream) {
        console.log("INFO: No Stream Found.");
        return;
      }

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
    socket.on("webrtcSignal", completePeerConnection);

    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webrtcSignal", completePeerConnection);
    };
  }, [socket, isConnected, user, onIncomingCall, completePeerConnection]);

  return (
    <SocketContext.Provider
      value={{
        onlineUsers,
        handleCall,
        onGoingCall,
        peerData,
        localStream,
        handleJoinCall,
      }}
    >
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
