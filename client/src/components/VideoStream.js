import { useState, useEffect, useRef } from "react";
import SFUPeer from "../util/SFUPeer";
import { makeStyles } from "@material-ui/core/styles";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import { Typography } from "@material-ui/core";
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
  const [hasStream, setHasStream] = useState(false);
  const sfuPeerRef = useRef(null);
  const classes = useStyles();

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
      console.log("no sfupeer--------", stream);
      sfuPeerRef.current = new SFUPeer(true, stream, self);
      // self.socket.emit("broadcasting", { room: self.room });
    } else {
      console.log("has sfupeer-------", stream);
      //there's already a webrtc connection, but wanna stream another video file
      // sfuPeerRef.current.stream = stream;
    }
  };

  const stopStreaming = () => {
    sfuPeerRef.current.stopStreaming();
    sfuPeerRef.current = null;
    self.socket.emit("stop streaming", self.room);
    setVideoUrl("");
    setHasStream(false);
  };

  useEffect(() => {
    if (self) {
      self.socket.on("broadcast-started", (incoming) => {
        console.log("broadcast started ---->", incoming);
        //when you are consuming stream
        sfuPeerRef.current = new SFUPeer(false, null, self);
      });

      //check if someone is streaming in the room
      self.socket.emit("check-stream-available", self.room, (response) => {
        console.log("checking if someone is streaming in room------------");
        if (response.isStreaming) {
          sfuPeerRef.current = new SFUPeer(false, null, self);
        } else {
          console.log("noone is streaming video in room-------");
        }
      });

      self.socket.on("streaming stopped", () => {
        console.log("streaming stopped", self);
        sfuPeerRef.current && sfuPeerRef.current.closeConnection();
        sfuPeerRef.current = null;
        setHasStream(false);
      });

      //event listener that gets stream from SFUPeer and shows in ui
      document.addEventListener("initStream", (e) => {
        console.log("Init Stream>>>>", e.detail);
        setHasStream(true);
        const target = document.getElementById("video-stream");
        console.log("has video target??", target);
        if (target) {
          target.srcObject = e.detail;
        }
      });

      return () => {
        self.socket.off("broadcast-started");
        self.socket.off("streaming stopped");
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
          setHasStream(true);
          setVideoUrl(URL.createObjectURL(e.target.files[0]));
        }}
      />

      {!hasStream ? (
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
          {videoUrl && (
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<StopIcon style={{ color: "#fff" }} />}
              onClick={() => stopStreaming()}
              style={{ color: "#fff", textTransform: "capitalize" }}
            >
              Stop Streaming
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoStream;
