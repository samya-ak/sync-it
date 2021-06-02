import { Context } from "../components/Store";
import { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chat from "../components/Chat";
import TextField from "@material-ui/core/TextField";
import VideoChat from "../components/VideoChat";
import VideoStream from "../components/VideoStream";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

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
}));

const Room = () => {
  const [state, dispatch] = useContext(Context);
  const [self, setSelf] = useState("");
  const [username, setUsername] = useState(self.id);
  const [peers, setPeers] = useState([]);

  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (state.self) {
      const self = state.room.peers.get(state.self);
      setSelf(self);
    }

    setPeers(Array.from(state.room.peers.values()));
  }, [state]);

  const sendUsername = (e) => {
    if (e.charCode === 13) {
      for (let [key, value] of state.room.peers) {
        if (key !== self.id) {
          console.log("sending username to>>>", value);
          value.sendMessage(JSON.stringify({ username, isName: true }));
        }
      }
      dispatch({ type: "ADD_USERNAME", payload: username });
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
            <VideoStream self={self} />
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
                defaultValue={username}
                style={{ backgroundColor: "#fff" }}
                onChange={(e) => setUsername(e.target.value)}
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
    return <div>Small Screen</div>;
  }
};

export default Room;
