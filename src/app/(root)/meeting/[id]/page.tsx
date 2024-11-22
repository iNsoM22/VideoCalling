'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';
import { FiCopy } from 'react-icons/fi';

import { useGetCallById } from '@/hooks/useGetCallById';
import Notification from '@/components/Notify';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';
import { useToast } from '@/components/ui/use-toast';

const MeetingPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id!);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { toast } = useToast();

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

  const notAllowed =
    call.type === 'invited' &&
    (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed)
    return <Notification title="You are not allowed to join this meeting" />;

  const handleCopyMeetingId = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${id?.toString()!}`,
    );
    toast({
      title: 'Meeting ID Copied!',
      description: `You can now share the Meeting ID: ${id}`,
    });
  };

  return (
    <main className="relative h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom
              hostID={call.state.createdBy!.id.toString()}
              showOnlyHost={call.state.custom.audience}
            />
          )}
        </StreamTheme>
      </StreamCall>

      {/* Floating Meeting ID Box */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-400">
            Meeting ID:
          </span>
          <span className="text-lg font-bold text-white">{id}</span>
        </div>
        <button
          onClick={handleCopyMeetingId}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700"
        >
          <FiCopy className="w-4 h-4" />
          Copy
        </button>
      </div>
    </main>
  );
};

export default MeetingPage;
