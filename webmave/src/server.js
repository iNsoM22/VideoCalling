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
    // If a new User is added then it will notify the already connected users
    // Notification Logic would be implemented by the backend
    // Keep Track of previous users and current users.
    const notifyUsers = socket.emit("getUsers", onlineUsers);

    // Add User to the Socket Connection
    socket.on("addNewUser", (newUser) => {
      newUser &&
        !onlineUsers.some(
          (connectedUser) => connectedUser.userID === newUser.id
        ) &&
        onlineUsers.push({
          userID: newUser.id,
          socketID: socket.id,
          profile: newUser,
        });
      notifyUsers();
    });

    socket.disconnect("diconnect", () => {
      onlineUsers = onlineUsers.filter(
        (connectedUser) => connectedUser.socketID !== socket.id
      );
      notifyUsers();
    });
  });

  httpServer
    .once("error", (err) => {
      ss;
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
