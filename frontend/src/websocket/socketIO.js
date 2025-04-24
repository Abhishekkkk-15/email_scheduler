import { io } from "socket.io-client";

// const BASE_URL = "https://fun-blogging-app.onrender.com/";
const BASE_URL = import.meta.env.VITE_API_URL;

export const socket = io(BASE_URL,{
    transports: ["websocket"], 
    reconnection: true,    
})
socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });