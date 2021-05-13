const Home = () => {
  const createRoom = (e) => {
    console.log("Create room");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Join Room");
  };

  return (
    <div className="center">
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
