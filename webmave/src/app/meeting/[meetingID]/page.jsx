"use client";
import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";
import React from "react";

const Meeting = () => {
  const { user } = useUser();
  console.log(user);
  return (
    <div className="text-4xl m-auto text-white">
      <div>
        <h1 className="text-4xl m-auto">
          Meeting: Current User {user?.username}
        </h1>
      </div>
    </div>
  );
};

export default Meeting;
