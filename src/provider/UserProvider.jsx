"use client";
import { UserContextProvider } from "@/context/UserContext";
import React from "react";

export const UserProvider = ({ children }) => {
  return <UserContextProvider>{children}</UserContextProvider>;
};
