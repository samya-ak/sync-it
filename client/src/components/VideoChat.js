import Video from "../components/Video";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "100%",
    width: "100%",
    backgroundColor: "#EAECEE ",
  },

  selfStream: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    height: "25%",
  },

  otherStream: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    height: "25%",
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
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const mute = (e, sendingStream) => {
    console.log("stream------>", sendingStream.getTracks());
    setIsMicOn(!isMicOn);
  };

  return (
    <Paper className={classes.paper}>
      {peers.map((peer, key) => {
        if (peer.id === self.id) {
          return (
            <div key={key} className={classes.selfStream}>
              <div style={{ width: "80%", marginTop: "15px" }}>
                <Video stream={peer.sendingStream} isMine={true} />
              </div>
              <div>
                {peer.name}(You)
                {isMicOn ? (
                  <MicIcon
                    className={classes.tealVariant}
                    onClick={(e) => mute(e, peer.sendingStream)}
                  />
                ) : (
                  <MicOffIcon
                    className={classes.redVariant}
                    onClick={(e) => setIsMicOn(!isMicOn)}
                  />
                )}
                {isVideoOn ? (
                  <VideocamIcon
                    className={classes.tealVariant}
                    onClick={(e) => setIsVideoOn(!isVideoOn)}
                  />
                ) : (
                  <VideocamOffIcon
                    className={classes.redVariant}
                    onClick={(e) => setIsVideoOn(!isVideoOn)}
                  />
                )}
              </div>
            </div>
          );
        } else {
          return (
            <div key={key} className={classes.otherStream}>
              {console.log(
                "receive others stream <---------------",
                peer.receivingStream && peer.receivingStream.getTracks()
              )}
              <div style={{ width: "80%", marginTop: "15px" }}>
                <Video stream={peer.receivingStream} isMine={false} />
              </div>
              <div>
                <div>
                  {peer.name}
                  {isMicOn ? (
                    <MicIcon
                      className={classes.tealVariant}
                      onClick={(e) => setIsMicOn(!isMicOn)}
                    />
                  ) : (
                    <MicOffIcon
                      className={classes.redVariant}
                      onClick={(e) => setIsMicOn(!isMicOn)}
                    />
                  )}
                  {isVideoOn ? (
                    <VideocamIcon
                      className={classes.tealVariant}
                      onClick={(e) => setIsVideoOn(!isVideoOn)}
                    />
                  ) : (
                    <VideocamOffIcon
                      className={classes.redVariant}
                      onClick={(e) => setIsVideoOn(!isVideoOn)}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        }
      })}
    </Paper>
  );
};

export default VideoChat;
