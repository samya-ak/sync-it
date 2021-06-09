import io from "socket.io-client";
import Room from "../util/Room";
import Peer from "../util/Peer";
import { Context } from "../components/Store";
import { useContext, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const withCreateJoin = (WrappedComponent) => {
  return (props) => {
    const [state, dispatch] = useContext(Context);
    const myStream = useRef();
    let history = useHistory();
    const hasStream = useRef(false);

    useEffect(() => {
      if (!hasStream.current) {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            if (myStream.current == null) {
              console.log("myStream init in useEffect ------------");
              myStream.current = stream;
              hasStream.current = true;
            }
          })
          .catch((err) => {
            myStream.current = null;
            showError("Media device not found or not allowed.");
          });
      }
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

        //dispatch an event to send your mic and webcam status
        const sendStatus = new CustomEvent("sendStatus", { detail: socketId });
        document.dispatchEvent(sendStatus);

        dispatch({ type: "ADD_ROOM", payload: room });
      });
    };

    const handleDisconnect = (socket, room) => {
      socket.on("disconnected", (peerId) => {
        //remove peer from room - client
        room.peers.delete(peerId);
        dispatch({ type: "ADD_ROOM", payload: room });
      });
    };

    const isNumeric = (value) => {
      return /^\d+$/.test(value);
    };

    const handleJoin = async (roomId) => {
      if (!hasStream.current) {
        try {
          //when room is accessed directly from url, there is no stream so
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });

          if (myStream.current == null) {
            console.log("myStream init in handle join ------------");
            myStream.current = stream;
            hasStream.current = true;
          }
        } catch (err) {
          myStream.current = null;
          showError("Media device not found or not allowed.");
        }
      }

      const socket = io();

      console.log("mystream>>>>", myStream.current);

      if (isNumeric(roomId)) {
        socket.emit("join room", roomId);
      } else {
        showError("Invalid room id.");
        return;
      }

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
    };

    const showError = (msg) => {
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          open: true,
          message: msg,
          severity: "error",
        },
      });
    };

    return (
      <WrappedComponent
        createRoom={createRoom}
        handleJoin={handleJoin}
        {...props}
      />
    );
  };
};

export default withCreateJoin;
