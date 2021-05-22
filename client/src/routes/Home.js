import { useHistory } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import Room from "../util/Room";
import Peer from "../util/Peer";
import { Context } from "../components/Store";
import io from "socket.io-client";

const Home = () => {
  let history = useHistory();
  const [state, dispatch] = useContext(Context);
  const [roomId, setRoomId] = useState("");
  let socketError = false;
  const myStream = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        myStream.current = stream;
      });
  }, []);

  const createRoom = (e) => {
    const socket = io();
    const roomId = new Date().getTime().toString();
    const room = new Room(roomId);
    socket.emit("create room", roomId);
    joinRoom(room, socket);
    newPeerListener(socket, room);
    handleDisconnect(socket, room);
    history.push(`/rooms/${roomId}`);
  };

  const handleDisconnect = (socket, room) => {
    socket.on("disconnected", (peerId) => {
      //remove peer from room - client
      room.peers.delete(peerId);
      dispatch({ type: "ADD_ROOM", payload: room });
    });
  };

  const newPeerListener = (socket, room) => {
    socket.on("new peer", (socketId) => {
      console.log("new peer joined>>>", socketId);
      const otherPeer = new Peer(
        socketId,
        room.id,
        socket,
        dispatch,
        myStream.current
      );
      room.peers = otherPeer;
      dispatch({ type: "ADD_ROOM", payload: room });
    });
  };

  const joinRoom = (room, socket) => {
    socket.on("connect", () => {
      const peer = new Peer(
        socket.id,
        room.id,
        socket,
        dispatch,
        myStream.current
      );
      room.peers = peer;
      dispatch({ type: "ADD_SELF", payload: socket.id });
      console.log("you>>>jr", socket.id);
    });

    dispatch({ type: "ADD_ROOM", payload: room });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const socket = io();
    socket.emit("join room", roomId);
    socket.on("socket-error", (errorMessage) => {
      handleError(errorMessage);
      socketError = true;
    });

    if (!socketError) {
      const room = new Room(roomId);
      joinRoom(room, socket);

      socket.on("other peers", (otherPeers) => {
        otherPeers.forEach((peer) => {
          const otherPeer = new Peer(
            peer,
            room.id,
            socket,
            dispatch,
            myStream.current
          );
          room.peers = otherPeer;
          otherPeer.call();
        });
        dispatch({ type: "ADD_ROOM", payload: room });
      });

      newPeerListener(socket, room);

      history.push(`/rooms/${roomId}`);
      handleDisconnect(socket, room);
    }
  };

  const handleError = (msg) => {
    dispatch({ type: "SET_ERROR", payload: msg });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="button" onClick={createRoom}>
          Create room
        </button>
        <br />
        <br />
        <input
          type="text"
          required
          onChange={(e) => setRoomId(e.target.value)}
        ></input>{" "}
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default Home;
