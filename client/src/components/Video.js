import { useEffect, useRef, useState } from "react";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  tealVariant: {
    color: "#00a36b",
  },

  redVariant: {
    color: "#F92444",
  },

  container: {
    position: "relative",
    height: "150px",
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    transition: ".5s ease",
    opacity: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
  },

  name: {
    color: "white",
  },
}));

const Video = ({ stream, isMine, peer }) => {
  const streamRef = useRef();
  const classes = useStyles();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const toggleMute = (e) => {
    // console.log("stream------>", sendingStream.getTracks());
    setIsMicOn(!isMicOn);
    const toggleSound = new Event("toggleMute");
    console.log("Event dispatched --->");
    document.dispatchEvent(toggleSound);
  };

  const toggleVideoStream = async (e) => {
    await peer.socket.emit("videoStatusChange", { id: peer.id });
    console.log("videoStatusChange emitted--->");
    const toggleVideo = new Event("toggleVideoStream");
    document.dispatchEvent(toggleVideo);
    console.log("Event dispatched video stream--->");
    setIsVideoOn(!isVideoOn);
  };

  useEffect(() => {
    console.log("Use effect ran ----> Video");
    if (streamRef.current) {
      streamRef.current.srcObject = stream;
    }
  }, [stream, streamRef]);

  useEffect(() => {
    if (!isMine) {
      peer.socket.on("videoStatusChanged", (payload) => {
        console.log("Video Status Changed", payload);
      });

      return () => {
        peer.socket.off("videoStatusChanged", () => {
          console.log("scoket destroyed -------->>");
        });
      };
    }
  }, [isMine, peer]);

  return (
    <div>
      <div style={{ marginTop: "15px" }}>
        <div className={classes.container}>
          <video
            style={{ height: "inherit", objectFit: "cover" }}
            ref={streamRef}
            muted={isMine ? true : false}
            autoPlay
          />
          {!isMine ? (
            <div className={classes.bottom}>
              <span className={classes.name}>Samyak Maharjan</span>
              <span cassName={classes.buttons}>
                <MicIcon style={{ color: "white" }} />
                <VideocamIcon style={{ color: "white" }} />
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {isMine ? (
        <div>
          name
          {isMicOn ? (
            <MicIcon
              className={classes.tealVariant}
              onClick={(e) => toggleMute(e)}
            />
          ) : (
            <MicOffIcon
              className={classes.redVariant}
              onClick={(e) => toggleMute(e)}
            />
          )}
          {isVideoOn ? (
            <VideocamIcon
              className={classes.tealVariant}
              onClick={(e) => toggleVideoStream(e)}
            />
          ) : (
            <VideocamOffIcon
              className={classes.redVariant}
              onClick={(e) => toggleVideoStream(e)}
            />
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Video;
