"use client";

import { SocketProvider } from "@/components/SocketProvider";
import { socket } from "@/lib/websocket/socket";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <SocketProvider />
      <Toaster position="top-right" />
    </SessionProvider>
  );
}
