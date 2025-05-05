'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { Button } from './ui/button';
import { useParams, useRouter } from 'next/navigation';
import { clearMessages } from '@/utils/messaging';
import React from 'react';

const EndCall = () => {
  const { id } = useParams();
  const call = useCall();
  const router = useRouter();

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    await call.endCall();
    router.replace('/');
  };

  return (
    <Button
      onClick={() => {
        clearMessages(id?.toString()!);
        endCall();
      }}
      className="bg-red-500"
    >
      End Call for Everyone
    </Button>
  );
};

export default EndCall;
