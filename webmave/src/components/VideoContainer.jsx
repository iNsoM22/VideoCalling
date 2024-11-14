import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const VideoBox = ({ stream, isOnCall, isLocalStream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-80 h-48 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  );
};

VideoBox.propTypes = {
  stream: PropTypes.object.isRequired,
  isOnCall: PropTypes.bool.isRequired,
  isLocalStream: PropTypes.bool.isRequired,
};

export default VideoBox;
