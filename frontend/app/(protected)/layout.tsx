import { SocketProvider } from "@/components/SocketProvider";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SocketProvider>{children}</SocketProvider>;
    </div>
  );
}

export default layout;
