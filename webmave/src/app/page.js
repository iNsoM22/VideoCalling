import React from "react";
import { SocketProvider } from "@/provider/SocketProvider.jsx";
import { UserProvider } from "@/provider/UserProvider.jsx";
import SessionSetup from "./session/page.jsx";

const home = () => {
  return <SessionSetup />;
};

export default home;
