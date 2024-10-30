import { io } from "../server.js";

export const onCall = async (participants) => {
  if (!participants) {
    console.error("No participants data received.");
    return;
  }

  if (participants.receiver) {
    console.log(
      `Initiating call to socket ID: ${participants.receiver.socketID}`
    );
    io.to(participants.receiver.socketID).emit("incomingCall", participants);
  } else {
    console.error(
      "Receiver or receiver's socketID is undefined:",
      participants
    );
  }
};
