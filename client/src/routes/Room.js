import { Context } from "../components/Store";
import { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import { TextareaAutosize } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: "100%",
    width: "100%",
    backgroundColor: "#eee",
  },
  control: {
    padding: theme.spacing(2),
  },
  bcolor: {
    backgroundColor: "#aaa",
  },
  fullSpace: {
    width: "100%",
    height: "100%",
  },
  card: {
    width: "auto",
    maxWidth: "65%",
    borderRadius: "19px",
    backgroundColor: "#ada",
    color: "white",
  },
}));

const Room = () => {
  const [state, dispatch] = useContext(Context);
  const [self, setSelf] = useState("");
  const [msg, setMsg] = useState("");
  const classes = useStyles();

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
        console.log("sending message to>>>", value);
        value.sendMessage(msg);
      }
    }
    const message = {
      value: msg,
      yours: true,
      time: new Date(),
    };
    dispatch({ type: "UPDATE_MESSAGES", payload: message });
  };

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
    <Grid container spacing={2} style={{ height: "100vh" }}>
      <Grid item md={3}>
        <Paper className={classes.paper}>video chat here</Paper>
      </Grid>
      <Grid item md={6}>
        <Paper className={classes.paper}>video player here</Paper>
      </Grid>
      <Grid item container md={3} direction={"column"} spacing={1}>
        <Grid item style={{ height: "20%" }}>
          <Paper className={classes.paper}>online members</Paper>
        </Grid>
        <Grid item style={{ height: "80%" }}>
          <Paper
            className={classes.paper}
            style={{ padding: "0.7em", boxSizing: "border-box" }}
          >
            <div
              style={{ overflow: "auto", height: "85%" }}
              className="custom-scrollbar"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "10px",
                }}
              >
                <Card className={classes.card}>
                  <CardContent style={{ padding: "9px" }}>
                    This is the first message. <br /> It is sent by someone that
                    is not me.
                  </CardContent>
                </Card>
                <div
                  style={{
                    fontSize: "12px",
                    alignItems: "center",
                    display: "flex",
                    color: " #878785",
                  }}
                >
                  Someone. 5:00 pm
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "10px",
                }}
              >
                <Card className={classes.card}>
                  <CardContent style={{ padding: "9px" }}>
                    This is the first message. <br /> It is sent by someone that
                    is not me.
                  </CardContent>
                </Card>
                <div
                  style={{
                    fontSize: "12px",
                    alignItems: "center",
                    display: "flex",
                    color: " #878785",
                  }}
                >
                  Someone. 5:00 pm
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "10px",
                }}
              >
                <Card className={classes.card}>
                  <CardContent style={{ padding: "9px" }}>
                    This is the first message. <br /> It is sent by someone that
                    is not me.
                  </CardContent>
                </Card>
                <div
                  style={{
                    fontSize: "12px",
                    alignItems: "center",
                    display: "flex",
                    color: " #878785",
                  }}
                >
                  Someone. 5:00 pm
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "10px",
                }}
              >
                <Card className={classes.card}>
                  <CardContent style={{ padding: "9px" }}>
                    This is the first message. <br /> It is sent by someone that
                    is not me.
                  </CardContent>
                </Card>
                <div
                  style={{
                    fontSize: "12px",
                    alignItems: "center",
                    display: "flex",
                    color: " #878785",
                  }}
                >
                  Someone. 5:00 pm
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "10px",
                }}
              >
                <Card className={classes.card}>
                  <CardContent style={{ padding: "9px" }}>
                    This is the first message. <br /> It is sent by someone that
                    is not me.
                  </CardContent>
                </Card>
                <div
                  style={{
                    fontSize: "12px",
                    alignItems: "center",
                    display: "flex",
                    color: " #878785",
                  }}
                >
                  Someone. 5:00 pm
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "10px",
                }}
              >
                <Card className={classes.card}>
                  <CardContent style={{ padding: "9px" }}>
                    This is the first message. <br /> It is sent by someone that
                    is not me.
                  </CardContent>
                </Card>
                <div
                  style={{
                    fontSize: "12px",
                    alignItems: "center",
                    display: "flex",
                    color: " #878785",
                  }}
                >
                  Someone. 5:00 pm
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "10px",
                }}
              >
                <Card className={classes.card}>
                  <CardContent style={{ padding: "9px" }}>
                    This is the first message. <br /> It is sent by someone that
                    is not me.
                  </CardContent>
                </Card>
                <div
                  style={{
                    fontSize: "12px",
                    alignItems: "center",
                    display: "flex",
                    color: " #878785",
                  }}
                >
                  Someone. 5:00 pm
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "10px",
                }}
              >
                <Card className={classes.card}>
                  <CardContent style={{ padding: "9px" }}>
                    This is the first message. <br /> It is sent by someone that
                    is not me.
                  </CardContent>
                </Card>
                <div
                  style={{
                    fontSize: "12px",
                    alignItems: "center",
                    display: "flex",
                    color: " #878785",
                  }}
                >
                  Someone. 5:00 pm
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "row-reverse",
                }}
              >
                <Card className={classes.card}>
                  <CardContent style={{ padding: "9px" }}>
                    This is the second message.
                  </CardContent>
                </Card>
                <div
                  style={{
                    fontSize: "12px",
                    alignItems: "center",
                    display: "flex",
                    color: " #878785",
                  }}
                >
                  Someone. 5:00 pm
                </div>
              </div>
            </div>

            <div
              style={{
                height: "15%",
                paddingTop: "15px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <TextareaAutosize
                style={{ height: "100%", width: "80%" }}
                aria-label="empty textarea"
                placeholder="Say something ..."
              />
              <button>Send</button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Room;
