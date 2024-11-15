"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import VideoBox from "./VideoContainer";
import Button from "@/components/Button";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";

const VideoCall = () => {
  const { localStream, peerData, onGoingCall } = useSocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  useEffect(() => {
    if (!localStream) return;
    // Automatically enable camera and mic if the stream is available
    setIsVideoOn(localStream.getVideoTracks()[0]?.enabled ?? false);
    setIsMicOn(localStream.getAudioTracks()[0]?.enabled ?? false);
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const endCall = useCallback(() => {
    // This needs to be implemented rn
    return;
    if (!localStream) return;
    localStream.getTracks().forEach((track) => track.stop());
    setIsMicOn(false);
    setIsVideoOn(false);
  }, [localStream]);

  const isOnCall = localStream && peerData && onGoingCall ? true : false;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Video Box */}
      <div>
        {localStream && (
          <div>
            <h3> My Video</h3>
            <VideoBox
              stream={localStream}
              isLocalStream={true}
              isOnCall={isOnCall}
            />
          </div>
        )}

        {peerData && peerData.stream && (
          <div>
            <h3> Other User's Video</h3>
            <VideoBox
              stream={peerData.stream}
              isLocalStream={false}
              isOnCall={isOnCall}
            />
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-4">
        {/* Toggle Camera */}
        <Button
          onClick={toggleCamera}
          icon={isVideoOn ? <FaVideo /> : <FaVideoSlash />}
          text={isVideoOn ? "Turn Video Off" : "Turn Video On"}
          backgroundColor={isVideoOn ? "#3B82F6" : "#E53E3E"}
        />

        {/* Toggle Mic */}
        <Button
          onClick={toggleMic}
          icon={isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
          text={isMicOn ? "Mute" : "Unmute"}
          backgroundColor={isMicOn ? "#3B82F6" : "#E53E3E"}
        />

        {/* End Call */}
        <Button
          onClick={endCall}
          icon={<FaPhoneSlash />}
          text="End Call"
          backgroundColor="#FF5A5F"
        />
      </div>
    </div>
  );
};

export default VideoCall;
