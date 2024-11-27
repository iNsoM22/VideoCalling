'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { FaPhoneSlash } from 'react-icons/fa';
import Loader from './Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingCard from './MeetingCard';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CallerList = ({
  type,
}: {
  type: 'ended' | 'upcoming' | 'recordings';
}) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  // Get calls based on type
  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls || [];
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls || [];
      default:
        return [];
    }
  };

  // Message for no calls
  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  // Fetch recordings only for "recordings" type
  useEffect(() => {
    const fetchRecordings = async () => {
      if (!callRecordings) return;
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings()),
        );

        const newRecordings = callData
          .filter((call) => call?.recordings?.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(newRecordings);
      } catch (error) {
        console.error('Error fetching recordings:', error);
      }
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  // Show loader while data is loading
  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div
      className={`grid grid-cols-1 gap-5 ${
        calls.length > 0 ? 'xl:grid-cols-2' : 'xl:grid-cols-1'
      }`}
    >
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={
              (meeting as Call)?.id ||
              (meeting as CallRecording)?.filename ||
              Math.random()
            }
            icon={
              type === 'ended'
                ? '/icons/previous.svg'
                : type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
            }
            title={
              (meeting as Call)?.state?.custom?.description ||
              (meeting as CallRecording)?.filename?.substring(0, 20) ||
              'No Description'
            }
            date={
              (meeting as Call)?.state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording)?.start_time?.toLocaleString() ||
              'No Date'
            }
            isPreviousMeeting={type === 'ended'}
            link={
              type === 'recordings'
                ? (meeting as CallRecording)?.url || '#'
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call)?.id || ''
                  }`
            }
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Play' : 'Start'}
            handleClick={
              type === 'recordings'
                ? () => router.push(`${(meeting as CallRecording)?.url || '#'}`)
                : () => router.push(`/meeting/${(meeting as Call)?.id || ''}`)
            }
          />
        ))
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center text-center">
          <FaPhoneSlash className="mb-4 text-5xl text-gray-400" />
          <h1 className="text-xl font-semibold text-gray-300">
            {noCallsMessage}
          </h1>
          <p className="text-sm text-gray-500">
            {type === 'ended'
              ? 'Looks like you have no past meetings.'
              : type === 'upcoming'
                ? 'You have no upcoming meetings planned.'
                : 'No recordings are available at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CallerList;
