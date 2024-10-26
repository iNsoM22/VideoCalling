"use client";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [meetingID, setMeetingID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !username || !meetingID) {
      setErrorMessage("Please fill in all fields.");
    } else {
      setErrorMessage("");
      // Handle login logic here
      console.log(`Joining ${meetingID} with:`, email, username);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Join a Meeting
        </h1>
        {errorMessage && (
          <div className="mb-4 text-red-600 text-center">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600 mb-2">
              Username
            </label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your Username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="meetingID" className="block text-gray-600 mb-2">
              Room ID
            </label>
            <input
              type="text"
              id="meetingID"
              value={meetingID}
              onChange={(e) => setMeetingID(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter the Room Meeting ID"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
