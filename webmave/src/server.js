import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
app.prepare().then(() => {
  const httpServer = createServer(handler);

  let onlineUsers = [];
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Client Connected....");
    // If a new User is added then it will notify the already connected users
    // Notification Logic would be implemented by the backend
    // Keep Track of previous users and current users.
    socket.emit("getUsers", onlineUsers);

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
      socket.emit("getUsers", onlineUsers);
    });

    socket.on("diconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketID !== socket.id);
      socket.emit("getUsers", onlineUsers);
    });
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
