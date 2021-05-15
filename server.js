require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socket(server);

io.on("connection", (socket) => {
  socket.on("create room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("join room", (roomId) => {
    try {
      const rooms = io.sockets.adapter.rooms;
      const room = rooms.get(roomId);
      let otherPeers = [];

      if (rooms.has(roomId) && room.size) {
        room.forEach((peer) => {
          otherPeers.push(peer);
        });
        socket.join(roomId);
        socket.data.room = roomId;

        socket.emit("other peers", otherPeers);
        socket.to(roomId).emit("new peer", socket.id);
      } else {
        console.log("no room: " + roomId);
        socket.emit("socket-error", "Room doesn't Exist");
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("disconnect", () => {
    socket.to(socket.data.room).emit("disconnected", socket.id);
  });
});

io.of("/").adapter.on("create-room", (roomId) => {
  console.log(`Room created: ${roomId}`);
});

app.get("/server", (req, res) => {
  res.send("This is the server.");
});

if (process.env.PROD) {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
