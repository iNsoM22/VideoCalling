'use client';
import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCall from './CallDecline';
import { cn } from '@/lib/utils';
import { StreamVideoParticipant } from '@stream-io/video-client';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';
type MeetingRoomProps = {
  hostID: string;
  showOnlyHost: boolean;
};

const MeetingRoom = ({ hostID, showOnlyHost }: MeetingRoomProps) => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState, useParticipants } = useCallStateHooks();

  // Handle calling state
  const callingState = useCallCallingState();
  if (callingState !== CallingState.JOINED) return <Loader />;

  // Define the call layout
  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };
  const filterUsers = async (searchQuery: string) => {
    // ?
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="flex h-full w-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        {/* Participants list */}
        <div
          className={cn('h-[calc(100vh-86px)] ml-2', {
            hidden: !showParticipants,
            block: showParticipants,
          })}
        >
          <CallParticipantsList
            // Here some sort of distinguisher should be passed
            // activeUsersSearchFn={}
            onClose={() => setShowParticipants(false)}
          />
        </div>
      </div>
      {/* Video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
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
        {!isPersonalRoom && <EndCall />}
      </div>
    </section>
  );
};

export default MeetingRoom;
