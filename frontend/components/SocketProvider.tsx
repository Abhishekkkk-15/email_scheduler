"use client";

import { socket } from "@/lib/websocket/socket";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function SocketProvider() {
  const session = useSession();
  const user = session.data?.user;
  useEffect(() => {
    if (user) {
      if (!socket.connected) {
        console.log("userId", user.id);
        socket.auth = { userId: user.id };
        socket.connect();
        console.log("Websocket connection istablished");
      }
    }
    return () => {
      socket.disconnect();
    };
  });
  return null;
}
