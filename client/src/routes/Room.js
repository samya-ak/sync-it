import { Context } from "../components/Store";
import { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chat from "../components/Chat";
import TextField from "@material-ui/core/TextField";
import VideoChat from "../components/VideoChat";
import VideoStream from "../components/VideoStream";
import MobileRoom from "../components/MobileRoom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import CallEndIcon from "@material-ui/icons/CallEnd";
import IconButton from "@material-ui/core/IconButton";
import { copyLink } from "../util/Util";
import withCreateJoin from "../components/WithCreateJoin";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "100%",
    width: "100%",
    backgroundColor: "#EAECEE ",
  },
  yourName: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  utilButtons: {
    backgroundColor: "#fff",
    color: theme.palette.primary.main,
    marginRight: theme.spacing(2),
    "&:hover": {
      color: "#CD2B2B",
      backgroundColor: theme.palette.secondary.light,
    },
  },
  title: {
    flexGrow: 1,
  },
}));

const Room = ({ handleJoin }) => {
  const [state, dispatch] = useContext(Context);
  const [self, setSelf] = useState(null);
  const [username, setUsername] = useState("");
  const [peers, setPeers] = useState([]);
  let history = useHistory();

  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (state.room == null) {
      //user tried to join room with direct url
      const arrayPath = window.location.href.split("/");
      const roomId = arrayPath[arrayPath.length - 1];

      console.log("handle join in room use effect");
      handleJoin(roomId);
    }
  }, []);

  useEffect(() => {
    if (state.self) {
      const self = state.room.peers.get(state.self);
      setSelf(self);
    }

    if (state.room !== null) {
      console.log("this causes re-render of video chat----------");
      setPeers(Array.from(state.room.peers.values()));
    }
  }, [state]);

  const sendUsername = (e) => {
    if (e.charCode === 13) {
      self.name = username;
      for (let [key, value] of state.room.peers) {
        if (key !== self.id) {
          console.log("sending username to>>>", value);
          value.sendMessage(JSON.stringify({ username, isName: true }));
        }
      }
      dispatch({ type: "ADD_USERNAME", payload: username });
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: { open: true, message: "Username set.", severity: "success" },
      });
    }
  };

  const copyRoomLink = async (e) => {
    const result = await copyLink();
    console.log("Result >>>>>", result);
    if (result.success) {
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: { open: true, message: result.msg, severity: "success" },
      });
    } else {
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: { open: true, message: result.msg, severity: "error" },
      });
    }
  };

  const setName = (name) => {
    self.name = name;
    setUsername(name);
  };

  const endCall = () => {
    //close connection with all peers
    peers.forEach((peer) => peer.id === self.id || peer.closeConnection());
    if (self.socket) {
      self.socket.emit("leave room", self.room);
      dispatch({ type: "RESET" });
      history.push("/");
    }
  };

  if (matches) {
    return (
      <Grid container style={{ height: "100vh" }} spacing={1}>
        <Grid item md={3} sm={3}>
          <VideoChat self={self} state={state} peers={peers} />
        </Grid>

        <Grid item md={6} sm={6}>
          <Paper className={classes.paper}>
            <AppBar position="static" color="primary">
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  SyncIt
                </Typography>

                <IconButton
                  className={classes.utilButtons}
                  onClick={(e) => copyRoomLink()}
                >
                  <LinkIcon />
                </IconButton>

                <IconButton
                  className={classes.utilButtons}
                  onClick={() => endCall()}
                >
                  <CallEndIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <VideoStream self={self} />
            <div style={{ padding: "20px" }}>
              <h5>Note:</h5>
              <p>
                If the local video streaming is not working, you may need to
                disable your chromium based browser's 'hardware accelaration'
                from system settings due to bug in captureStream api.
              </p>
            </div>
          </Paper>
        </Grid>

        <Grid
          item
          container
          md={3}
          sm={3}
          direction={"column"}
          justify="space-between"
        >
          <Grid item style={{ height: "10vh" }}>
            {console.log("self in paper>>>", self)}
            <Paper className={`${classes.paper} ${classes.yourName}`}>
              <TextField
                id="user-name"
                label="Your Name"
                variant="outlined"
                size="small"
                defaultValue={state.username}
                style={{ backgroundColor: "#fff" }}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={sendUsername}
              />
            </Paper>
          </Grid>

          <Grid item style={{ height: "88vh" }}>
            <Chat self={self} />
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <MobileRoom
        self={self}
        state={state}
        peers={peers}
        endCall={endCall}
        setName={setName}
        sendUsername={sendUsername}
      />
    );
  }
};

export default withCreateJoin(Room);
