import Video from "../components/Video";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "100%",
    width: "100%",
    backgroundColor: "#EAECEE ",
    [theme.breakpoints.down("md")]: {
      overflow: "auto",
    },
  },

  selfStream: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    height: "25%",
    [theme.breakpoints.down("md")]: {
      height: "auto",
    },
  },

  otherStream: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    height: "25%",
    [theme.breakpoints.down("md")]: {
      height: "auto",
    },
  },

  tealVariant: {
    color: "#00a36b",
  },

  redVariant: {
    color: "#F92444",
  },
}));

const VideoChat = ({ state, self, peers }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      {peers.map((peer, key) => {
        if (peer.id === self.id) {
          return (
            <div key={key} className={classes.selfStream}>
              <Video stream={peer.sendingStream} isMine={true} peer={peer} />
            </div>
          );
        } else {
          return (
            <div key={key} className={classes.otherStream}>
              {console.log(
                "receive others stream <---------------",
                peer.receivingStream && peer.receivingStream.getTracks()
              )}
              <Video stream={peer.receivingStream} isMine={false} peer={peer} />
            </div>
          );
        }
      })}
    </Paper>
  );
};

export default VideoChat;
