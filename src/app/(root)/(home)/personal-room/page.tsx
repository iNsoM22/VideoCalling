'use client';

import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiCopy, FiVideo } from 'react-icons/fi';
import { MdMeetingRoom } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MeetingGenerator } from '@/utils/generator';

const InfoRow = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg bg-dark-2 p-4 shadow-md xl:flex-row">
      <div className="flex items-center gap-3 text-sky-400">
        {icon}
        <h1 className="text-base font-medium lg:text-xl">{title}:</h1>
      </div>
      <h1 className="truncate text-sm font-bold text-gray-200 max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

const PersonalRoom = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const [meetingId, setMeetingId] = useState<string | null>(null);

  useEffect(() => {
    if (!meetingId) {
      // Generate the meeting ID once on mount
      setMeetingId(MeetingGenerator());
    }
  }, [meetingId]);

  if (!isLoaded || !user) {
    return null;
  }

  const startRoom = async () => {
    if (!client || !user || !meetingId) return;

    const newCall = client.call('default', meetingId);

    try {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });

      router.push(`/meeting/${meetingId}?personal=true`);
    } catch (error) {
      console.error('Failed to start the meeting:', error);
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;

  return (
    <section className="flex flex-col items-center gap-10 rounded-lg bg-gray-900 p-6 text-white shadow-lg">
      <h1 className="text-center text-2xl font-extrabold lg:text-4xl">
        <MdMeetingRoom className="mr-2 inline-block size-8 text-sky-400" />
        Personal Meeting Room
      </h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <InfoRow
          title="Topic"
          description={`${user?.username}'s Meeting Room`}
          icon={<FiVideo className="size-6" />}
        />
        <InfoRow
          title="Meeting ID"
          description={meetingId || ''}
          icon={<FiVideo className="size-6" />}
        />
      </div>
      <div className="flex gap-5">
        <Button
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 font-bold text-white shadow-lg transition-all hover:opacity-90"
          onClick={startRoom}
        >
          <FiVideo className="size-5" />
          Start Meeting
        </Button>
        <Button
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-6 py-3 font-bold text-gray-300 shadow-lg transition-all hover:bg-gray-700"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: 'Link Copied',
            });
          }}
        >
          <FiCopy className="size-5" />
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
