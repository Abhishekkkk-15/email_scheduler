import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Suspense } from "react";
import { Loading } from "@/components/hero/Loading";
import { SocketProvider } from "@/components/SocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Email Scheduler - Workflow Automation",
  description: "Create and manage automated email workflows",
  icons: {
    icon: "./favicon.svg",
    apple: "./icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full w-full">
              <Loading />
            </div>
          }>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
