"use client";

import { useSocket } from "@/context/SocketContext";
import React from "react";

const IncomingCall = () => {
  const { onGoingCall, handleJoinCall } = useSocket();

  if (!onGoingCall || !onGoingCall.isRinging) return null;

  let callerName = onGoingCall?.participants?.caller;

  return (
    <div className="incoming-call-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="incoming-call-box bg-white rounded-lg shadow-lg p-8 text-center w-80">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Incoming Call
        </h2>

        <p className="text-lg text-gray-600 mb-8">
          📞 {callerName.username || "Unknown Caller"} is calling...
        </p>

        <div className="button-group flex justify-around mt-4">
          <button
            onClick={() => {
              handleJoinCall(onGoingCall);
            }}
            className="accept-call bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Accept
          </button>
          <button
            onClick={() => {
              console.log("Call Declined");
              // Add your decline call logic here
            }}
            className="decline-call bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
