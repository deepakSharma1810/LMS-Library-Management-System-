import { io } from "socket.io-client";

const socket = io("https://lms-library-management-system-kappa.vercel.app", {
  transports: ["websocket"], // faster & stable
});

export default socket;
