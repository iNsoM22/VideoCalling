import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    meetingID: null,
    username: null,
    email: null,
  });

  const initializeUser = ({ meetingID, username, email }) => {
    setUser({
      meetingID,
      username,
      email,
    });
  };

  return (
    <UserContext.Provider value={{ user, initializeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
