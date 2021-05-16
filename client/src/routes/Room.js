import { Context } from "../components/Store";
import { useContext, useEffect, useState } from "react";
//Need to make logged in instance of Peer available here.
const Room = () => {
  const [state, dispatch] = useContext(Context);
  const [self, setSelf] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (state.self) {
      const self = state.room.peers.get(state.self);
      setSelf(self);
    }
  }, [state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //send same message to all connected peers
    for (let [key, value] of state.room.peers) {
      if (key !== self.id) {
        console.log("sending message as>>>", value);
        value.sendMessage(msg);
      }
    }
  };

  return (
    <div>
      <p>This is Room</p>
      <p>You are {self.id}</p>
      <form onSubmit={handleSubmit}>
        <textarea
          required
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></textarea>
        <button>Send</button>
      </form>
    </div>
  );
};

export default Room;
