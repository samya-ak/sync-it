import { useEffect, useRef } from "react";

const Video = ({ stream, isMine }) => {
  const streamRef = useRef();

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.srcObject = stream;
    }
  }, [stream, streamRef, isMine]);

  return (
    <video
      style={{ width: "100%", height: "150px" }}
      ref={streamRef}
      muted={isMine ? true : false}
      autoPlay
    />
  );
};

export default Video;
