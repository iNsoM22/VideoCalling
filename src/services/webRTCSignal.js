import { io } from "..server.py";

export const onWebRTCSignal = async (data) => {
  if (data.isCaller) {
    if (data.currentlyGoingCall.participants.receiver.socketID) {
      io.to(data.currentlyGoingCall.participants.receiver.socketID).emit(
        "webrtcSignal",
        data
      );
    }
  } else {
    if (data.currentlyGoingCall.participants.caller.socketID) {
      io.to(data.currentlyGoingCall.participants.caller.socketID).emit(
        "webrtcSignal",
        data
      );
    }
  }
};
