import { io } from "socket.io-client";

// const BASE_URL = "https://fun-blogging-app.onrender.com/";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const socket = io(BASE_URL, {
  autoConnect: false,
  transports: ["polling", "websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});
socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err);
});
