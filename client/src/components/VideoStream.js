import { useState, useEffect, useRef, useContext } from "react";
import SFUPeer from "../util/SFUPeer";
import { Context } from "../components/Store";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import StopIcon from "@material-ui/icons/Stop";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
  desktopVideo: {
    width: "auto",
    height: "100%",
  },
  mobileVideo: {
    width: "100%",
    height: "inherit",
  },
  desktopVideo2: {
    height: "45vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  mobileVideo2: {
    height: "inherit",
    backgroundColor: "black",
  },
}));

const VideoStream = ({ self }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [hasStream, setHasStream] = useState(false);
  const [state, dispatch] = useContext(Context);
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
      console.log("no sfupeer--------", stream);
      sfuPeerRef.current = new SFUPeer(true, stream, self);
      dispatch({ type: "UPDATE_SFUPEER", payload: sfuPeerRef.current });
    } else {
      console.log("has sfupeer-------", stream);
    }
  };

  const stopStreaming = () => {
    sfuPeerRef.current.stopStreaming();
    sfuPeerRef.current = null;
    self.socket.emit("stop streaming", self.room);
    setVideoUrl("");
    setHasStream(false);
    document.getElementById("stream-video-file").value = "";
    dispatch({ type: "UPDATE_SFUPEER", payload: null });
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
        dispatch({ type: "UPDATE_SFUPEER", payload: null });
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
        accept="video/*, audio/*"
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
        <div className={!matches ? classes.selectorMobileHeight : ""}>
          <div
            className={matches ? classes.desktopVideo2 : classes.mobileVideo2}
          >
            <video
              id="video-stream"
              className={matches ? classes.desktopVideo : classes.mobileVideo}
              src={videoUrl}
              controls
            ></video>
          </div>
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
