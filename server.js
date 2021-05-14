require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socket(server);

let rooms = new Map();

io.on("connection", (socket) => {
  console.log("soc id>>>>", socket.id);
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
