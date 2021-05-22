require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const socket = require("socket.io");
const app = express();

// Try to load the key and certificate for HTTPS

let httpsOptions = {};

try {
  httpsOptions.key = fs.readFileSync("./localhost-key.pem");
  httpsOptions.cert = fs.readFileSync("./localhost.pem");
} catch (err) {
  console.error(
    "Unable to load HTTPS cert and/or key; available on HTTP only: " + err
  );
  httpsOptions = null;
}

let server;
const port = process.env.PORT || 5000;

if (httpsOptions) {
  server = https.createServer(httpsOptions, app);
  server.listen(port);
  console.log("HTTPS listening on port " + port);
} else {
  server = http.createServer(app);
  server.listen(port, () => console.log(`Server is running on port ${port}`));
}

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

        socket.to(roomId).emit("new peer", socket.id);
        socket.emit("other peers", otherPeers);
      } else {
        console.log("no room: " + roomId);
        socket.emit("socket-error", "Room doesn't Exist");
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("offer", (payload) => {
    console.log("offer>>>", payload);
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    console.log("answer >>>", payload);
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming);
  });

  socket.on("disconnect", () => {
    socket.to(socket.data.room).emit("disconnected", socket.id);
  });
});

app.get("/server", (req, res) => {
  res.send("This is the server.");
});

io.of("/").adapter.on("create-room", (roomId) => {
  console.log(`Room created: ${roomId}`);
});

if (process.env.PROD) {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}
