import { useEffect, useRef, useState } from "react";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  tealVariant: {
    color: "#00a36b",
    cursor: "pointer",
  },

  redVariant: {
    color: "#F92444",
    cursor: "pointer",
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

  const toggleMute = () => {
    setIsMicOn(!isMicOn);
    const toggleSound = new Event("toggleMute");
    document.dispatchEvent(toggleSound);
  };

  useEffect(() => {
    console.log("mic status -_--------->", isMicOn);
    peer.socket.emit("micStatusChange", {
      id: peer.id,
      isMicOn,
      room: peer.room,
    });
  }, [isMicOn]);

  const toggleVideoStream = () => {
    setIsVideoOn(!isVideoOn);
    const toggleVideo = new Event("toggleVideoStream");
    document.dispatchEvent(toggleVideo);
  };

  useEffect(() => {
    console.log("Is video on", isVideoOn);
    peer.socket.emit("videoStatusChange", {
      id: peer.id,
      isVideoOn,
      room: peer.room,
    });
  }, [isVideoOn]);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.srcObject = stream;
    }
  }, [stream, streamRef]);

  useEffect(() => {
    if (!isMine) {
      peer.socket.on("videoStatusChanged", (payload) => {
        console.log("on video status changed>>>", payload);

        if (payload.id === peer.id) {
          setIsVideoOn(payload.isVideoOn);
        }
      });

      peer.socket.on("micStatusChanged", (payload) => {
        console.log("on mic status changed>>>", payload);
        if (payload.id === peer.id) {
          console.log("here>>>>>", peer);
          setIsMicOn(payload.isMicOn);
        }
      });

      peer.socket.on("receive-status", (payload) => {
        console.log("Receive Status---------------------->", payload, peer);
        if (payload.from === peer.id) {
          setIsVideoOn(payload.isVideoOn);
          setIsMicOn(payload.isMicOn);
        }
      });

      return () => {
        peer.socket.off("videoStatusChanged");
        peer.socket.off("micStatusChanged");
        peer.socket.off("receive-status");
      };
    }
  }, [isMine, peer]);

  useEffect(() => {
    const status = {
      from: peer.id,
      isMicOn,
      isVideoOn,
    };

    if (isMine) {
      document.addEventListener("sendStatus", (e) => {
        status["id"] = e.detail;

        console.log("emitting send status-------->", status, peer);

        peer.socket.emit("send-status", status);
      });
    }
  }, [isVideoOn, isMicOn]);

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
              <span className={classes.name}>{peer.name}</span>
              <span className={classes.buttons}>
                {isMicOn ? (
                  <MicIcon style={{ color: "white" }} />
                ) : (
                  <MicOffIcon style={{ color: "white" }} />
                )}

                {isVideoOn ? (
                  <VideocamIcon style={{ color: "white" }} />
                ) : (
                  <VideocamOffIcon style={{ color: "white" }} />
                )}
              </span>
            </div>
          ) : (
            <div className={classes.bottom}>
              <span className={classes.name}>{peer.name} (You)</span>
              <span className={classes.buttons}>
                {isMicOn ? (
                  <MicIcon
                    className={classes.tealVariant}
                    onClick={() => toggleMute()}
                  />
                ) : (
                  <MicOffIcon
                    className={classes.redVariant}
                    onClick={() => toggleMute()}
                  />
                )}

                {isVideoOn ? (
                  <VideocamIcon
                    className={classes.tealVariant}
                    onClick={() => toggleVideoStream()}
                  />
                ) : (
                  <VideocamOffIcon
                    className={classes.redVariant}
                    onClick={() => toggleVideoStream()}
                  />
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Video;
