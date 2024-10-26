"use client";
import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/services/pyservice";
import React from "react";

const meeting = () => {
  const user = useUser();
  const [onlineUsers] = useSocket();
  return (
    <div className="text-4xl m-auto">
      <div>
        {onlineUsers &&
          onlineUsers.map((onlineUser) => {
            return (
              <div key={onlineUser.id}>{onlineUsers.profile.username}</div>
            );
          })}
      </div>
    </div>
  );
};

export default meeting;
