import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../components/Store";

const Home = () => {
  let history = useHistory();
  const [state, dispatch] = useContext(Context);

  const createRoom = (e) => {
    const roomId = new Date().getTime();
    history.push(`/rooms/${roomId}`);
    console.log("Create room");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Join Room");
    dispatch({ type: "SET_ERROR", payload: "something error" });
    console.log(state);
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
