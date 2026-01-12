import { Server } from "socket.io";
import http from "http";
import express from "express";
import { config } from "dotenv";
config();
const app = express();
const server = http.createServer(app);
console.log("dd", process.env.FRONTEND_DOMAIN);
const io = new Server(server, {
  cors: {
    origin:
      process.env.FRONTEND_DOMAIN || "https://email-scheduler-oqpk.vercel.app/",
    credentials: true,
  },
});

export function getReciverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
  const { userId } = socket.handshake.auth;
  if (!userId) {
    console.error("User ID missing in handshake");
    socket.disconnect();
    // return;
  }
  socket.join(userId);
  userSocketMap[userId] = socket.id;
  console.log(userSocketMap);
  console.log("User connected ", socket.id);
  // console.log("MongoId ", userId)
  io.emit("onlineUser", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    console.log("User disconnected ", socket.id);
    io.emit("onlineUser", Object.keys(userSocketMap));
  });
});

export { io, app, server };
