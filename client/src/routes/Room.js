import { Context } from "../components/Store";
import { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chat from "../components/Chat";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "100%",
    width: "100%",
    backgroundColor: "#EAECEE ",
  },
}));

const Room = () => {
  const [state, dispatch] = useContext(Context);
  const [self, setSelf] = useState("");
  const classes = useStyles();

  useEffect(() => {
    if (state.self) {
      const self = state.room.peers.get(state.self);
      setSelf(self);
    }
  }, [state]);

  return (
    // <div>
    //    <p>This is Room</p>
    //   <p>You are {self.id}</p>
    //   <form onSubmit={handleSubmit}>
    //     <textarea
    //       required
    //       value={msg}
    //       onChange={(e) => setMsg(e.target.value)}
    //     ></textarea>
    //     <button>Send</button>
    //   </form>
    // </div>
    <Grid container style={{ height: "100vh" }} spacing={1}>
      <Grid item md={3} sm={3}>
        <Paper className={classes.paper}>video chat here</Paper>
      </Grid>

      <Grid item md={6} sm={6}>
        <Paper className={classes.paper}>video player here</Paper>
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
          <Paper className={classes.paper}>
            Enter Your Name:
            <div>{self.username || self.id} (You)</div>
          </Paper>
        </Grid>

        <Grid item style={{ height: "88vh" }}>
          <Chat self={self} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Room;
