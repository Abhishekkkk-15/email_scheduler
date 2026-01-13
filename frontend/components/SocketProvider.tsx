"use client";

import { socket } from "@/lib/websocket/socket";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.auth = { userId };
      socket.connect();
      console.log("WebSocket connected for user:", userId);
    }

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return <div>{children}</div>;
}
