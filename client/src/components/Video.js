import { useEffect, useRef } from "react";

const Video = ({ stream, isMine }) => {
  const streamRef = useRef();

  useEffect(() => {
    if (streamRef.current) {
      if (isMine) {
        stream.getTracks().forEach((track) => {
          console.log("kind>>>>", track.kind);
          if (track.kind === "audio") track.enabled = !track.enabled;
        });
      }

      streamRef.current.srcObject = stream;
    }
  }, [stream, streamRef, isMine]);

  return (
    <video
      style={{ width: "100%", height: "150px" }}
      ref={streamRef}
      autoPlay
    />
  );
};

export default Video;
