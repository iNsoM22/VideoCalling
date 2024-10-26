import React from "react";
import Login from "../components/landing.jsx";
import { SocketProvider } from "@/provider/SocketProvider.jsx";

const home = () => {
  return (
    <SocketProvider>
      <Login />;
    </SocketProvider>
  );
};

export default home;
