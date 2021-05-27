require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const socket = require("socket.io");
const app = express();
const webrtc = require("wrtc");

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

app.get("/server", (req, res) => {
  res.send("This is the server.");
});

//signaling server
const io = socket(server);

io.on("connection", (socket) => {
  //signaling
  socket.on("create room", (roomId) => {
    socket.join(roomId);
    socket.data.room = roomId;
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

  //miscellanous
  socket.on("disconnect", () => {
    socket.to(socket.data.room).emit("disconnected", socket.id);
  });

  socket.on("videoStatusChange", (payload) => {
    socket.to(payload.room).emit("videoStatusChanged", payload);
  });

  socket.on("micStatusChange", (payload) => {
    socket.to(payload.room).emit("micStatusChanged", payload);
  });

  socket.on("send-status", (payload) => {
    io.to(payload.id).emit("receive-status", payload);
  });

  socket.on("broadcasting", (payload) => {
    socket.to(payload.room).emit("broadcast-started", payload);
  });
});

//sfu server
{
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const broadcasts = new Map();

  const ice = {
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
      {
        urls: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
    ],
  };

  app.post("/broadcast", async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection(ice);
    peer.ontrack = (e) => handleTrackEvent(e, body.room);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
      sdp: peer.localDescription,
    };

    res.json(payload);
  });

  function handleTrackEvent(e, room) {
    console.log("Broadcasting to room------->", room);
    broadcasts.set(room, e.streams[0]);
  }

  app.post("/consume", async ({ body }, res) => {
    try {
      const peer = new webrtc.RTCPeerConnection(ice);
      const desc = new webrtc.RTCSessionDescription(body.sdp);
      await peer.setRemoteDescription(desc);
      if (broadcasts.has(body.room)) {
        broadcasts
          .get(body.room)
          .getTracks()
          .forEach((track) => peer.addTrack(track, broadcasts.get(body.room)));
      } else {
        throw new Error("No broadcasts for your room");
      }
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      const payload = {
        sdp: peer.localDescription,
      };

      res.json(payload);
    } catch (e) {
      console.log(e);
    }
  });
}

io.of("/").adapter.on("create-room", (roomId) => {
  console.log(`Room created: ${roomId}`);
});

if (process.env.PROD) {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}
