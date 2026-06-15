import { io } from "socket.io-client";
import API_URL from "./Constant";

const socket = io(`${API_URL}`, {
  transports: ["websocket"], // faster & stable
});

export default socket;
