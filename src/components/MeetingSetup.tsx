'use client';
import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import Notification from './Notify';
import { Button } from './ui/button';

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  }

  const [hasMic, setHasMic] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    let audioStream: MediaStream | null = null;
    let videoStream: MediaStream | null = null;

    const checkDevices = async () => {
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setHasMic(audioStream.active);
      } catch (error) {
        setHasMic(false);
      }
      try {
        videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setHasCamera(videoStream.active);
      } catch (error) {
        setHasCamera(false);
      }
    };

    checkDevices();

    return () => {
      audioStream && audioStream.getTracks().forEach((track) => track.stop());
      videoStream && videoStream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (isMicCamToggled) {
      hasCamera && call.camera.disable();
      hasMic && call.microphone.enable();
    } else {
      hasCamera && call.camera.enable();
      hasMic && call.microphone.enable();
    }
  }, [isMicCamToggled, hasCamera, hasMic, call]);

  if (callTimeNotArrived)
    return (
      <Notification
        title={`Your Meeting has not started yet. It is scheduled for ${new Date(
          callStartsAt,
        ).toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Notification
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={async () => {
          await call.join({ video: hasCamera });
          setIsSetupComplete(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
