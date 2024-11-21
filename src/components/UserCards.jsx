"use client";

import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import Avatar from "@/components/CircleAvatar";
import Button from "@/components/Button";
import { FaPhone } from "react-icons/fa";

const CardCreator = ({ user, onlineUsers, handleCall }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-center">Online Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {onlineUsers && onlineUsers.length > 0 ? (
          onlineUsers
            .filter((onlineUser) => onlineUser.userID !== user.email)
            .map((onlineUser) => (
              <Card
                key={onlineUser.userID}
                username={onlineUser.profile?.username || "Unknown User"}
                imageURL={onlineUser.profile?.imageURL}
                status={onlineUser.isOnline ? "Online" : "Offline"}
                onCall={() => handleCall(onlineUser)}
              />
            ))
        ) : (
          <div className="text-center col-span-full text-2xl mt-4">
            No Online Users
          </div>
        )}
      </div>
    </>
  );
};

CardCreator.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    // Other user properties can be defined here
  }).isRequired,
  onlineUsers: PropTypes.arrayOf(
    PropTypes.shape({
      userID: PropTypes.string.isRequired,
      profile: PropTypes.shape({
        username: PropTypes.string,
        imageURL: PropTypes.string,
      }),
      isOnline: PropTypes.bool.isRequired,
    })
  ).isRequired,
  handleCall: PropTypes.func.isRequired,
};

const Card = ({ username, imageURL, status, onCall }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg flex flex-col items-center shadow-md">
      <Avatar imageURL={imageURL} size={60} />
      <p className="text-lg font-medium mt-2">{username}</p>
      <p
        className={`text-sm mt-1 ${
          status === "Online" ? "text-green-400" : "text-gray-500"
        }`}
      >
        {status}
      </p>
      {onCall && (
        <Button
          onClick={onCall}
          icon={<FaPhone />}
          text="Call"
          size="small"
          backgroundColor="#3B82F6"
        />
      )}
    </div>
  );
};

Card.propTypes = {
  username: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onCall: PropTypes.func,
};

export default CardCreator;
