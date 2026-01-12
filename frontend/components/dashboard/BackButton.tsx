"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
function BackButton() {
  const router = useRouter();
  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
    </div>
  );
}

export default BackButton;
