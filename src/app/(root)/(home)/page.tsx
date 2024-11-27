'use client';

import React, { useEffect, useState } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';
import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  const { useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(
    now,
  );

  // Determine the upcoming meeting time if available
  const [meetingTime, setMeetingTime] = useState<string | null>(null);

  useEffect(() => {
    if (callStartsAt) {
      const startTime = new Date(callStartsAt);
      setMeetingTime(
        startTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    }
  }, [callStartsAt]);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            {meetingTime
              ? `Upcoming Meeting at: ${meetingTime}`
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
