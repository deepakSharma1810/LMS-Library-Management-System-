import { io } from "socket.io-client";

const socket = io("https://lms-library-management-system-9nhw.onrender.com", {
  transports: ["websocket"], // faster & stable
});

export default socket;
