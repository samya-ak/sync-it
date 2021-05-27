import { useState, useEffect, useRef } from "react";
import SFUPeer from "../util/SFUPeer";

const VideoStream = ({ self }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const sfuPeerRef = useRef(null);

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
      self.socket.emit("broadcasting", { room: self.room });
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
    <div style={{ width: "inherit" }}>
      <input
        type="file"
        onChange={(e) => {
          setVideoUrl(URL.createObjectURL(e.target.files[0]));
        }}
      />
      <div id="video-stream-container" style={{ width: "inherit" }}>
        {videoUrl ? (
          <video
            id="video-stream"
            style={{ width: "inherit" }}
            src={videoUrl}
            controls
          ></video>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default VideoStream;
