import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import { TextareaAutosize } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "100%",
    width: "100%",
    backgroundColor: "#eee",
    padding: "0.7em",
    boxSizing: "border-box",
  },
  card: {
    width: "auto",
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
  },
  yoursMessage: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
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
    borderColor: "#eee",
    borderRadius: "13px",
    padding: "8px",
  },
  sendMessage: {
    color: "#fff",
    backgroundColor: "#00a36b",
  },
}));

const Chat = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      {/* Messages */}
      <div className={`custom-scrollbar ${classes.messages}`}>
        <div className={classes.othersMessage}>
          <Card className={`${classes.card} ${classes.others}`} elevation={0}>
            <CardContent style={{ padding: "9px" }}>
              This is the first message. <br /> It is sent by someone that is
              not me.
            </CardContent>
          </Card>
          <div className={classes.author}>Someone. 5:00 pm</div>
        </div>
        <div className={classes.yoursMessage}>
          <Card className={`${classes.card} ${classes.yours}`} elevation={0}>
            <CardContent style={{ padding: "9px" }}>
              This is the second message.
            </CardContent>
          </Card>
          <div className={classes.author}>Someone. 5:00 pm</div>
        </div>
      </div>

      {/* Message Sender */}
      <div className={classes.messageSender}>
        <TextareaAutosize
          rowsMin={4}
          rowsMax={4}
          className={classes.textArea}
          aria-label="empty textarea"
          placeholder="Say something ..."
        />

        <IconButton
          aria-label="send message"
          component="span"
          className={classes.sendMessage}
        >
          <SendRoundedIcon />
        </IconButton>
      </div>
    </Paper>
  );
};

export default Chat;
