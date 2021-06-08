import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import { TextareaAutosize } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useContext } from "react";
import { Context } from "../components/Store";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "100%",
    width: "100%",
    backgroundColor: "#EAECEE",
    padding: "0.7em",
    boxSizing: "border-box",
  },
  card: {
    width: "auto",
    minWidth: "130px",
    maxWidth: "65%",
    borderRadius: "19px",
    color: "white",
  },
  others: {
    backgroundColor: "#9ba2a2",
  },
  yours: {
    backgroundColor: "#00d48b",
  },
  messages: {
    overflow: "auto",
    height: "85%",
  },
  othersMessage: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    whiteSpace: "pre-wrap",
    minWidth: "120px",
  },
  yoursMessage: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    marginBottom: "10px",
    whiteSpace: "pre-wrap",
    minWidth: "120px",
  },
  author: {
    fontSize: "12px",
    alignItems: "center",
    display: "flex",
    color: " #878785",
    fontWeight: "bold",
  },
  messageSender: {
    height: "15%",
    paddingTop: "15px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  textArea: {
    width: "75%",
    outline: "none",
    resize: "none",
    borderColor: "#CCD1D1 ",
    borderRadius: "13px",
    padding: "8px",
  },
  sendMessage: {
    color: "#fff",
    backgroundColor: "#00a36b",
  },
}));

const Chat = ({ self }) => {
  const classes = useStyles();
  const [msg, setMsg] = useState("");
  const [state, dispatch] = useContext(Context);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const handleSubmit = (e) => {
    if (msg.length > 0) {
      console.log("sending>>>", msg);
      // send same message to all connected peers
      for (let [key, value] of state.room.peers) {
        if (key !== self.id) {
          console.log("sending message to>>>", value);
          value.sendMessage(JSON.stringify({ msg }));
        }
      }
      const message = {
        value: msg,
        yours: true,
        time: new Date(),
        author: state.username,
      };
      dispatch({ type: "UPDATE_MESSAGES", payload: message });
      setMsg("");
    }
  };

  return (
    <Paper className={classes.paper}>
      {console.log("msgs>>>", state.messages)}
      {/* Messages */}
      <div className={`custom-scrollbar ${classes.messages}`}>
        {state.messages.map((message, key) => {
          return (
            <div
              className={
                message.yours ? classes.yoursMessage : classes.othersMessage
              }
              key={key}
            >
              <Card
                className={`${classes.card} ${
                  message.yours ? classes.yours : classes.others
                }`}
                elevation={0}
              >
                <CardContent style={{ padding: "9px" }}>
                  {message.value}
                </CardContent>
              </Card>
              <div className={classes.author}>
                {message.author}
                &nbsp;{" "}
                {message.time.toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Sender */}
      <div className={classes.messageSender}>
        <TextareaAutosize
          rowsMin={matches ? 4 : 2}
          rowsMax={matches ? 4 : 2}
          className={classes.textArea}
          aria-label="empty textarea"
          placeholder="Say something ..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <IconButton
          aria-label="send message"
          component="span"
          onClick={handleSubmit}
          className={classes.sendMessage}
        >
          <SendRoundedIcon />
        </IconButton>
      </div>
    </Paper>
  );
};

export default Chat;
