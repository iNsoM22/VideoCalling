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
    <div className="flex h-screen flex-col items-center justify-center pb-10 text-white">
      <h1 className="mb-4 w-full text-center text-2xl font-bold">
        Waiting Room
      </h1>
      <div className="self-center px-5 py-2">
        <VideoPreview className="size-[15rem] sm:size-[22rem] md:size-[30rem]" />
      </div>

      <div className="flex w-auto justify-center gap-3 sm:items-center">
        <label className="flex items-center justify-center gap-2 text-sm font-medium sm:text-base">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
            className="size-4"
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="mt-4 rounded-md bg-green-500 px-6 py-3 text-sm sm:mt-6 sm:text-base"
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
