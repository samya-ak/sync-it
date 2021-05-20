import { useEffect, useRef } from "react";

const Video = ({ stream }) => {
  const streamRef = useRef();

  useEffect(() => {
    if (streamRef.current) streamRef.current.srcObject = stream;
  }, [stream, streamRef]);

  return (
    <video
      style={{ width: "100%", height: "150px" }}
      ref={streamRef}
      autoPlay
    />
  );
};

export default Video;
