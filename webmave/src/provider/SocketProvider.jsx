"use client";
import { SocketContextProvider } from "@/context/SocketContext";
import React from "react";

export const SocketProvider = ({ children }) => {
  return <SocketContextProvider>{children}</SocketContextProvider>;
};
