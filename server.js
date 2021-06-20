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

//track broadcasting rooms
const broadcastingRooms = new Map();
const queueCandidates = new Map();

io.on("connection", (socket) => {
  socket.on("error", (error) => {
    console.log("Error occured in server: ", error);
  });
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

      if (room && room.size === 4) {
        socket.emit("room-full");
        return;
      }

      if (rooms.has(roomId)) {
        room.forEach((peer) => {
          otherPeers.push(peer);
        });

        socket.to(roomId).emit("new peer", socket.id);
        socket.emit("other peers", otherPeers);
      }
      socket.join(roomId);
      socket.data.room = roomId;
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("offer", (payload) => {
    console.log("offer>>>");
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    console.log("answer >>>");
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming);
  });

  //miscellanous
  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    socket.to(socket.data.room).emit("disconnected", socket.id);
  });

  socket.on("leave room", (roomId) => {
    socket.leave(roomId);
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

  socket.on("check-stream-available", (roomId, callback) => {
    if (broadcastingRooms.has(roomId)) {
      callback({ isStreaming: true });
    } else {
      callback({ isStreaming: false });
    }
  });

  socket.on("stop streaming", async (roomId) => {
    if (broadcastingRooms.has(roomId)) {
      broadcastingRooms.delete(roomId);
    }

    const sockets = await io.in(roomId).fetchSockets();
    console.log("Sockets in room: ---", sockets);
    for (const socket of sockets) {
      console.log("Queue Candidates----->", queueCandidates);
      queueCandidates.has(socket.id) && queueCandidates.delete(socket.id);
    }

    socket.to(roomId).emit("streaming stopped");
  });
});

//sfu server
{
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const ice = {
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
      // {
      //   urls: "turn:numb.viagenie.ca",
      //   credential: "muazkh",
      //   username: "webrtc@live.com",
      // },
    ],
  };

  app.post("/ice", async ({ body }, res) => {
    try {
      console.log("Ice got hit | Broadcasting rooms", broadcastingRooms);
      console.log("got ice candidate from client>>>>", body);
      if (broadcastingRooms.has(body.room)) {
        const room = broadcastingRooms.get(body.room);
        // console.log("Room>>>", room);
        const peer = room.get(body.id);
        const candidate = new webrtc.RTCIceCandidate(body.candidate);
        // console.log("Peer>>", peer);
        if (peer) {
          peer
            .addIceCandidate(candidate)
            .catch((e) => console.log("ICE ERROR: ", e));
        } else {
          if (peerCandiddates.has(body.id)) {
            console.log("adding to candidate queue---------");
            peerCandiddates.get(body.id).push(candidate);
          } else {
            console.log("adding to candidate queue---------");
            peerCandiddates.set(body.id, [candidate]);
          }
        }

        res.json({ candidate });
      } else {
        const candidate = new webrtc.RTCIceCandidate(body.candidate);
        if (peerCandiddates.has(body.id)) {
          console.log("adding to candidate queue 400---------");
          peerCandiddates.get(body.id).push(candidate);
        } else {
          console.log("adding to candidate queue 400---------");
          peerCandiddates.set(body.id, [candidate]);
        }
        res.status(400).send(`No room ${body.room} in broadcasting room.`);
      }
    } catch (e) {
      console.log("Internal server Error: ", e);
      res.status(500).send(e);
    }
  });

  /*
  {
    "room_id": {
      'stream': 'something',
      'peer1': 'rtc peer object',
      'peer2': 'rtc peer object',
    }
  }
  */

  app.post("/broadcast", async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection(ice);

    console.log("broadcast got hit | Broadcasting to room>>>>: ", body);
    if (!broadcastingRooms.has(body.room)) {
      const room = new Map();
      room.set(body.id, peer);
      broadcastingRooms.set(body.room, room);
      console.log(
        "room created>>>",
        broadcastingRooms,
        broadcastingRooms.get(body.room)
      );
    }

    peer.onicecandidate = (e) => handleIceCandidate(e, body.id);
    peer.ontrack = (e) => handleTrackEvent(e, body.room);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    if (queueCandidates.has(body.id) && queueCandidates.get(body.id).length) {
      const candidates = queueCandidates.get(body.id);
      candidates.forEach((candidate) => {
        console.log("add ice from queue --- broadcast");
        peer
          .addIceCandidate(candidate)
          .catch((e) => console.log("ICE ERROR: ", e));
        candidates.shift();
      });
    }
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
      sdp: peer.localDescription,
    };

    res.json(payload);
  });

  async function handleIceCandidate(e, socketId) {
    const sockets = await io.in(socketId).fetchSockets();
    const candidate = e.candidate;
    if (e.candidate) {
      console.log("sending ice candidate to client", candidate, sockets[0].id);
      sockets[0].emit("sfu-ice-candidate", { candidate });
    }
  }

  function handleTrackEvent(e, room) {
    console.log("Broadcasting to room------->", room);
    if (broadcastingRooms.has(room)) {
      broadcastingRooms.get(room).set("stream", e.streams[0]);
    } else {
      console.error("no broadcasting room: " + room);
    }
    console.log("room after adding stream >>>>", broadcastingRooms.get(room));
  }

  app.post("/consume", async ({ body }, res) => {
    try {
      console.log("consuming got hit", body);
      const peer = new webrtc.RTCPeerConnection(ice);
      peer.onicecandidate = (e) => handleIceCandidate(e, body.id);

      const desc = new webrtc.RTCSessionDescription(body.sdp);

      await peer.setRemoteDescription(desc);
      if (queueCandidates.has(body.id) && queueCandidates.get(body.id).length) {
        const candidates = queueCandidates.get(body.id);
        candidates.forEach((candidate) => {
          console.log("add ice from queue --- broadcast");
          peer
            .addIceCandidate(candidate)
            .catch((e) => console.log("ICE ERROR: ", e));
          candidates.shift();
        });
      }

      if (broadcastingRooms.has(body.room)) {
        const room = broadcastingRooms.get(body.room);
        console.log("This is the room>>>", room);
        room
          .get("stream")
          .getTracks()
          .forEach((track) => peer.addTrack(track, room.get("stream")));
        room.set(body.id, peer);
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
