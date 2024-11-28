'use client';
import React, { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  ParticipantView,
  StreamVideoParticipant,
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
  remoteParticipants,
  chatRoomShowing,
  participantListShowing,
}: {
  layout: CallLayoutType;
  showEveryone: boolean;
  isHost: boolean;
  host: any;
  localParticipant: any;
  remoteParticipants: StreamVideoParticipant[];
  chatRoomShowing: boolean;
  participantListShowing: boolean;
}) => {
  if (showEveryone || isHost) {
    if (layout === 'grid') {
      return (
        <div
          className="grid w-full gap-4 p-4"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
          }}
        >
          {remoteParticipants?.map((participant) => (
            <ParticipantView
              participant={participant}
              key={participant.sessionId}
              className="aspect-video w-full max-w-[240px] rounded-xl shadow-lg sm:max-w-[200px] md:max-w-[280px] lg:max-w-[320px]"
            />
          ))}
          {localParticipant && (
            <ParticipantView
              participant={localParticipant}
              key={localParticipant.sessionId}
              className="aspect-video w-full max-w-[240px] rounded-xl shadow-lg sm:max-w-[200px] md:max-w-[280px] lg:max-w-[320px]"
            />
          )}
        </div>
      );
    }

    return (
      <div
        className={`flex max-h-[85vh] w-full flex-col items-center justify-center gap-4 ${remoteParticipants.length === 1 ? 'md:mt-20 md:flex-none' : 'md:flex-row'}`}
      >
        {remoteParticipants?.map((participant) => (
          <ParticipantView
            participant={participant}
            key={participant.sessionId}
            className={`h-auto rounded-xl shadow-lg md:size-[20rem] ${remoteParticipants.length === 1 ? 'md:-ml-40 md:h-[70vh] md:w-[60vw]' : ''}`}
          />
        ))}
        {localParticipant && (
          <ParticipantView
            participant={localParticipant}
            key={localParticipant.sessionId}
            className={`rounded-xl shadow-lg md:absolute md:bottom-0 md:size-[15rem] ${chatRoomShowing || participantListShowing ? 'transition-transform md:right-96' : 'md:right-24'}`}
          />
        )}
      </div>
    );
  }

  // Audience Mode: Show only host and local participant
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-4 md:mt-20 md:flex-none`}
    >
      {host && (
        <ParticipantView
          participant={host}
          key={host.sessionId}
          className={`w-[25rem] rounded-xl shadow-lg md:m-auto md:h-[70vh] md:w-[80vw]`}
        />
      )}
      {localParticipant && (
        <ParticipantView
          participant={localParticipant}
          key={localParticipant.sessionId}
          className="w-[15rem] rounded-xl shadow-lg md:absolute md:bottom-28 md:right-20"
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
    <section className="relative h-screen w-screen overflow-hidden pt-4 text-white">
      <div className="relative flex w-full items-center justify-center">
        <div className="w-full">
          <CallLayout
            layout={layout}
            showEveryone={showEveryone}
            isHost={isHost}
            host={host}
            localParticipant={localParticipant}
            remoteParticipants={remoteParticipants}
            chatRoomShowing={showSessionMessages}
            participantListShowing={showParticipants}
          />
        </div>

        {/* Sidebar Sections */}
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
      <div className="bg-dark fixed bottom-0 flex w-full items-center justify-center p-3 opacity-90">
        {/* Unified Scrollable Section */}
        <div className="scrollbar-hidden flex items-center space-x-4 overflow-x-auto px-3">
          {/* Call Controls */}
          <div className="flex items-center space-x-4">
            <CallControls onLeave={() => router.push(`/`)} />
            {/* Add more buttons inside CallControls as needed */}
          </div>

          {/* Additional Features */}
          <div className="flex items-center space-x-4">
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                <LayoutList size={20} className="text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                {['Grid', 'Speaker-Left', 'Speaker-Right'].map(
                  (item, index) => (
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
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Call Stats Button */}
            <CallStatsButton />

            {/* Participants Toggle */}
            <button
              onClick={() => {
                setShowParticipants((prev) => !prev);
                setshowSessionMessages(false);
              }}
              className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]"
            >
              <Users size={20} className="text-white" />
            </button>

            {/* Messages Toggle */}
            <button
              onClick={() => {
                setshowSessionMessages((prev) => !prev);
                setShowParticipants(false);
              }}
              className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]"
            >
              <MessageSquare size={20} className="text-white" />
            </button>

            {/* End Call */}
            {!isPersonalRoom && <EndCall />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingRoom;
