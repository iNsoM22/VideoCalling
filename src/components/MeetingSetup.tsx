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

  const [hasMic, sethasMic] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    call.camera.disable();
    call.microphone.disable();
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(function (stream) {
        stream.getVideoTracks().length > 0
          ? setHasCamera(true)
          : setHasCamera(false);
        stream.getAudioTracks().length > 0 ? sethasMic(true) : sethasMic(false);
      })
      .catch(function (error) {
        setHasCamera(false);
        sethasMic(false);
      });

    if (isMicCamToggled) {
      hasCamera && call.camera && call.camera.disable();
      hasMic && call.microphone && call.microphone.disable();
    } else {
      hasCamera && call.camera && call.camera.enable();
      hasMic && call.microphone && call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  if (callTimeNotArrived)
    return (
      <Notification
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
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
