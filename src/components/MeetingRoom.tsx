'use client';
import React, { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  ParticipantView,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, MessageSquare } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import { cn } from '@/lib/utils';
import EndCall from './CallDecline';
import ChatRoom from './SessionMessaging';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

type MeetingRoomProps = {
  showEveryone: boolean;
};

const CallLayout = ({
  layout,
  showEveryone,
  isHost,
  host,
  localParticipant,
}: {
  layout: CallLayoutType;
  showEveryone: boolean;
  isHost: boolean;
  host: any;
  localParticipant: any;
}) => {
  if (showEveryone || isHost) {
    if (layout === 'grid') return <PaginatedGridLayout />;
    return <SpeakerLayout participantsBarPosition="right" />;
  }
  // Audience Mode: Show only host and local participant
  return (
    <div className="flex gap-4">
      {host && (
        <ParticipantView
          participant={host}
          key={host.sessionId}
          className="size-80 rounded-xl shadow-lg"
        />
      )}
      {localParticipant && (
        <ParticipantView
          participant={localParticipant}
          key={localParticipant.sessionId}
          className="size-60 rounded-xl shadow-lg"
        />
      )}
    </div>
  );
};

const MeetingRoom = ({ showEveryone }: MeetingRoomProps) => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSessionMessages, setshowSessionMessages] = useState(false);
  const {
    useCallCallingState,
    useCallCreatedBy,
    useLocalParticipant,
    useRemoteParticipants,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const hostInfo = useCallCreatedBy();
  const host = remoteParticipants.find(
    (participant) => participant.userId === hostInfo?.id,
  );
  const isHost = localParticipant?.userId === hostInfo?.id;

  if (callingState !== CallingState.JOINED) return <Loader />;

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout
            layout={layout}
            showEveryone={showEveryone}
            isHost={isHost}
            host={host}
            localParticipant={localParticipant}
          />
        </div>
        <div
          className={cn('ml-2 hidden h-[calc(100vh-86px)]', {
            'show-block': showSessionMessages,
          })}
        >
          <ChatRoom />
        </div>
        <div
          className={cn('ml-2 hidden h-[calc(100vh-86px)]', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* Video layout and call controls */}
      <div className="bg-dark fixed bottom-0 flex w-full items-center justify-center gap-5 opacity-90">
        <CallControls onLeave={() => router.push(`/`)} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                {index < 2 && (
                  <DropdownMenuSeparator className="border-dark-1" />
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        <button onClick={() => setshowSessionMessages((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <MessageSquare size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCall />}
      </div>
    </section>
  );
};

export default MeetingRoom;
