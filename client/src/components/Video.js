import { useEffect, useRef, useState } from "react";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import profile from "../images/profile.png";

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
  const [isMicOn, setIsMicOn] = useState(stream !== null);
  const [isVideoOn, setIsVideoOn] = useState(stream !== null);
  const isMicOnRef = useRef(isMicOn);
  const isVideoOnRef = useRef(isVideoOn);
  const theme = useTheme();

  const _setIsMicOn = (val) => {
    isMicOnRef.current = val;
    setIsMicOn(val);
  };

  const _setIsVideoOn = (val) => {
    isVideoOnRef.current = val;
    setIsVideoOn(val);
  };

  const toggleMute = () => {
    if (stream !== null) {
      _setIsMicOn(!isMicOn);
      const toggleSound = new Event("toggleMute");
      document.dispatchEvent(toggleSound);
    }
  };

  useEffect(() => {
    if (isMine) {
      const status = {
        id: peer.id,
        isMicOn: isMicOnRef.current,
        room: peer.room,
      };
      peer.socket.emit("micStatusChange", status);
      console.log("emit mic status ----------->", status);
    }
  }, [isMicOn]);

  const toggleVideoStream = () => {
    if (stream !== null) {
      _setIsVideoOn(!isVideoOn);
      const toggleVideo = new Event("toggleVideoStream");
      document.dispatchEvent(toggleVideo);
    }
  };

  useEffect(() => {
    if (isMine) {
      const status = {
        id: peer.id,
        isVideoOn: isVideoOnRef.current,
        room: peer.room,
      };
      peer.socket.emit("videoStatusChange", status);
      console.log("emit Is video on", status);
    }
  }, [isVideoOn]);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.srcObject = stream;
    }
    console.log("Got this stream in video -------", stream);
  }, [stream]);

  useEffect(() => {
    if (!isMine) {
      peer.socket.on("videoStatusChanged", (payload) => {
        console.log("on video status changed>>>", payload);

        if (payload.id === peer.id) {
          _setIsVideoOn(payload.isVideoOn);
        }
      });

      peer.socket.on("micStatusChanged", (payload) => {
        console.log("on mic status changed>>>", payload);
        if (payload.id === peer.id) {
          console.log("here>>>>>", peer);
          _setIsMicOn(payload.isMicOn);
        }
      });

      peer.socket.on("receive-status", (payload) => {
        console.log("Receive Status---------------------->", payload, peer);
        if (payload.from === peer.id) {
          _setIsVideoOn(payload.isVideoOn);
          _setIsMicOn(payload.isMicOn);
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
    if (isMine) {
      document.addEventListener("sendStatus", (e) => {
        const status = {
          id: e.detail,
          from: peer.id,
          isMicOn: isMicOnRef.current,
          isVideoOn: isVideoOnRef.current,
        };

        console.log("emitting send status-------->", status, peer);

        peer.socket.emit("send-status", status);
      });
    }
  }, []);

  return (
    <div>
      <div
        style={{
          marginTop: "15px",
          backgroundColor: theme.palette.secondary.light,
        }}
      >
        <div className={classes.container}>
          {stream === null ? (
            <img
              src={profile}
              alt="no video stream"
              style={{ width: "100%", height: "inherit", objectFit: "contain" }}
            />
          ) : (
            <video
              style={{ height: "inherit", objectFit: "cover" }}
              ref={streamRef}
              muted={isMine ? true : false}
              autoPlay
            />
          )}
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
