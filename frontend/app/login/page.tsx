"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo / Brand */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Email Scheduler</h1>
          <p className="text-muted-foreground text-sm">
            Build, automate, and track email workflows with precision.
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
            <Mail className="h-5 w-5" />
            Continue with Google
          </Button>

          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
