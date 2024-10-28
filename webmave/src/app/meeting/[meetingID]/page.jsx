"use client";

import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";
import React from "react";

const Meeting = () => {
  const { onlineUsers } = useSocket();
  const { user } = useUser();

  return (
    <div className="text-4xl m-auto text-white">
      <div>
        <h1 className="text-4xl m-auto">
          Meeting: Current User {user?.username}
        </h1>
        <h2 className="text-2xl mt-4">Online Users:</h2>
        {onlineUsers && onlineUsers.length > 0 ? (
          onlineUsers.map((onlineUser) => (
            <div key={onlineUser.userID} className="mt-2 text-xl">
              {onlineUser.profile.username}
            </div>
          ))
        ) : (
          <div className="text-xl mt-2">No other users online</div>
        )}
      </div>
    </div>
  );
};

export default Meeting;
