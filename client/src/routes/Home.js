import { useHistory } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import Room from "../util/Room";
import Peer from "../util/Peer";
import { Context } from "../components/Store";
import LiquidSwipeSlider from "../components/LiquidSwipeSlider";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Box,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import KeyboardIcon from "@material-ui/icons/Keyboard";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    height: "100vh",
  },
  half: {
    width: "50%",
  },
  boxHeight: {
    [theme.breakpoints.down("sm")]: {
      height: "350px",
    },
    [theme.breakpoints.up("sm")]: {
      height: "500px",
    },
  },
  create: {
    padding: "0.9rem 1rem",
    textTransform: "capitalize",
    marginRight: "1rem",

    [theme.breakpoints.down("sm")]: {
      marginBottom: "0.9rem",
    },
  },
  join: {
    color: "#0F9D58",
    textTransform: "capitalize",
    marginLeft: "1rem",
    padding: "0.7rem 1rem",
    fontSize: "1rem",
  },
}));

const borderInput = makeStyles(() => ({
  root: {
    "&:hover $notchedOutline": {
      borderColor: "#BCB6B6",
    },
    "&$focused $notchedOutline": {
      borderColor: "green",
    },
  },
  focused: {},
  notchedOutline: {},
}));

const Home = () => {
  let history = useHistory();
  const [state, dispatch] = useContext(Context);
  const [roomId, setRoomId] = useState("");
  const myStream = useRef();
  const classes = useStyles();
  const changeBorderColor = borderInput();

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

      //dispatch an event to send your mic and webcam status
      const sendStatus = new CustomEvent("sendStatus", { detail: socketId });
      document.dispatchEvent(sendStatus);

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

  const isNumeric = (value) => {
    return /^\d+$/.test(value);
  };

  const handleJoin = (e) => {
    const socket = io();

    if (isNumeric(roomId)) {
      socket.emit("join room", roomId);
    } else {
      handleError("Invalid room id.");
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

  const handleError = (msg) => {
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
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Box px={{ xs: 2, sm: 4, md: 4 }} py={{ xs: 1, sm: 2, md: 2 }}>
            <Typography variant="h5">
              Sync<span style={{ color: "#00d48b" }}>It</span>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box
            pl={{ xs: 3, sm: 11, md: 11 }}
            pr={{ xs: 6, sm: 7.5, md: 7.5 }}
            py={{ xs: 4, sm: 12, md: 12 }}
          >
            <Box>
              <Typography
                variant="h3"
                style={{ fontSize: "2.6rem", marginBottom: "2rem" }}
              >
                Premium video meetings.
                <br /> For upto four people.
              </Typography>
              <Typography
                variant="subtitle1"
                style={{ fontWeight: 500, color: "#666161" }}
              >
                Re-engineered the service for secure friendly meetings, SyncIt,
                to make free and available for all.
              </Typography>
            </Box>
            <Box py={{ xs: 3, sm: 7, md: 7 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<MeetingRoomIcon />}
                className={classes.create}
                style={{ background: "#0F9D58" }}
                onClick={createRoom}
              >
                Create Room
              </Button>
              <FormControl variant="outlined">
                <OutlinedInput
                  placeholder="Enter room id"
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      <KeyboardIcon />
                    </InputAdornment>
                  }
                  classes={changeBorderColor}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </FormControl>
              {roomId.length > 0 && (
                <Button
                  className={classes.join}
                  variant="text"
                  onClick={(e) => handleJoin(e)}
                >
                  Join
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box
            pl={{ xs: 3, sm: 7.5, md: 7.5 }}
            pr={{ xs: 3, sm: 11, md: 11 }}
            py={{ xs: 2, sm: 4, md: 4 }}
            className={classes.boxHeight}
            style={{ borderRadius: "20px" }}
          >
            <LiquidSwipeSlider />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box my={5}>
            <Typography variant="subtitle1" align="center">
              Sync<span style={{ color: "#00d48b" }}>It</span>
              &nbsp; &copy;&nbsp;Copyright {new Date().getUTCFullYear()}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
