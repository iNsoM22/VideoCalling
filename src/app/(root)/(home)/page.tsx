'use client';

import React, { useEffect, useState } from 'react';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingTypeList from '@/components/MeetingTypeList';
import { Call } from '@stream-io/video-react-sdk';

const Home = () => {
  const { upcomingCalls, isLoading } = useGetCalls();
  const [closestMeeting, setClosestMeeting] = useState<Call | null>(null);

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(
    now,
  );

  useEffect(() => {
    if (upcomingCalls && upcomingCalls.length > 0) {
      const sorted = [...upcomingCalls].sort((a, b) => {
        const aDate = a.state.startsAt?.getTime() || 0;
        const bDate = b.state.startsAt?.getTime() || 0;
        return aDate - bDate;
      });

      const upcoming = sorted.find((call) => {
        const startsAt = call.state.startsAt;
        return startsAt && startsAt > new Date();
      });

      setClosestMeeting(upcoming || null);
    }
  }, [upcomingCalls]);

  const meetingTime = closestMeeting?.state.startsAt?.toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            {meetingTime
              ? `Upcoming Meeting at: ${meetingTime}`
              : isLoading
                ? 'Loading upcoming meetings...'
                : 'No upcoming meetings'}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
