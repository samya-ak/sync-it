import { useHistory } from "react-router-dom";
import { useContext } from "react";
import Room from "../util/Room";
import Peer from "../util/Peer";
import { Context } from "../components/Store";
import io from "socket.io-client";

const Home = () => {
  let history = useHistory();
  const [dispatch] = useContext(Context);

  const createRoom = (e) => {
    const socket = io();
    const roomId = new Date().getTime();
    const room = new Room(roomId);

    socket.on("connect", () => {
      const peer = new Peer(socket.id, roomId, socket);
      room.peers = peer;
    });
    dispatch({ type: "ADD_ROOM", payload: { id: roomId, room } });
    history.push(`/rooms/${roomId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Join Room");
    // console.log(state);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="button" onClick={createRoom}>
          Create room
        </button>
        <br />
        <br />
        <input type="text" name="room-id" id="room-id"></input>{" "}
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default Home;
