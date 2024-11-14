import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { onCall } from "./services/onCall.js";
import { onWebRTCSignal } from "./services/webRTCSignal.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  let onlineUsers = [];
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Client Connected....");
    // If a new User is added then it will notify the already connected users
    // Notification Logic would be implemented by the backend
    // Keep Track of previous users and current users.
    // Add User to the Socket Connection
    socket.on("addNewUser", (newUser) => {
      newUser &&
        !onlineUsers.some(
          (connectedUser) => connectedUser.userID === newUser.email
        ) &&
        onlineUsers.push({
          userID: newUser.email,
          socketID: socket.id,
          profile: newUser,
        });
      io.emit("getUsers", onlineUsers);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected...");
      onlineUsers = onlineUsers.filter((user) => user.socketID !== socket.id);
      io.emit("getUsers", onlineUsers);
    });
    socket.on("call", onCall);
    socket.on("webrtcSignal", onWebRTCSignal);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
