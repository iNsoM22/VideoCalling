"use client";

import IncomingCall from "@/components/IncomingCall";
import CardCreator from "@/components/UserCards";
import VideoCall from "@/components/VideoCall";
import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";
import React from "react";

const Meeting = () => {
  const { onlineUsers, handleCall } = useSocket();
  const { user } = useUser();
  return (
    <div className="flex flex-col items-center text-white mt-8 space-y-8">
      <IncomingCall />
      {/* Current User Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center w-3/4 max-w-md">
        <h1 className="text-3xl font-semibold">Welcome, {user?.username}</h1>
        <p className="text-gray-400 mt-2">You are in the meeting</p>
      </div>

      {/* Online Users Section */}
      <div className="w-full max-w-3xl">
        <CardCreator
          onlineUsers={onlineUsers}
          user={user}
          handleCall={handleCall}
        />
      </div>

      <VideoCall />
    </div>
  );
};

export default Meeting;
