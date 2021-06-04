import { useState, useEffect, useRef } from "react";
import SFUPeer from "../util/SFUPeer";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import { Typography, useMediaQuery } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import StopIcon from "@material-ui/icons/Stop";

const useStyles = makeStyles((theme) => ({
  chooseFile: {
    height: "45vh",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  selectorMobileHeight: {
    [theme.breakpoints.down("md")]: {
      height: "inherit",
    },
  },
}));

const VideoStream = ({ self }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const sfuPeerRef = useRef(null);
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (videoUrl) {
      const target = document.getElementById("video-stream");
      console.log("video target>>>>>", target);
      const stream = target.captureStream();
      stream.onaddtrack = () => handleAddTrack(stream);
    }
  }, [videoUrl]);

  const handleAddTrack = (stream) => {
    if (!sfuPeerRef.current) {
      //when new stream needs to be created - you are streaming
      sfuPeerRef.current = new SFUPeer(true, stream, self);
      // self.socket.emit("broadcasting", { room: self.room });
    } else {
      //there's already a webrtc connection, but wanna stream another video file
      sfuPeerRef.current.stream = stream;
    }
  };

  useEffect(() => {
    if (self) {
      self.socket.on("broadcast-started", (incoming) => {
        console.log("broadcast started ---->", incoming);
        //when you are consuming stream
        sfuPeerRef.current = new SFUPeer(false, null, self);
      });

      return () => {
        self.socket.off("broadcast-started");
      };
    }
  }, [self]);

  return (
    <div style={{ width: "inherit" }} className={classes.selectorMobileHeight}>
      <input
        id="stream-video-file"
        type="file"
        style={{ display: "none" }}
        onChange={(e) => {
          setVideoUrl(URL.createObjectURL(e.target.files[0]));
        }}
      />

      {!videoUrl ? (
        <div className={classes.selectorMobileHeight}>
          <div
            className={`${classes.chooseFile} ${classes.selectorMobileHeight}`}
            onClick={() => document.getElementById("stream-video-file").click()}
            id="video-selector"
          >
            <div style={{ textAlign: "center" }}>
              <OndemandVideoIcon fontSize="large" style={{ color: "#fff" }} />
              <Typography style={{ color: "#fff" }}>
                Select a video file from your device and start streaming.
              </Typography>
            </div>
          </div>
          <div id="video-stream-container" style={{ width: "inherit" }}></div>
        </div>
      ) : (
        <div style={{ width: "inherit" }}>
          <video
            id="video-stream"
            style={{ width: "inherit", maxHeight: "inherit" }}
            src={videoUrl}
            controls
          ></video>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<StopIcon style={{ color: "#fff" }} />}
            onClick={() => setVideoUrl("")}
            style={{ color: "#fff", textTransform: "capitalize" }}
          >
            Stop Streaming
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoStream;
