"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ActionBar from "@/components/workflow/action-bar";
import WorkflowCanvas from "@/components/workflow/workflow-canvas";

export default function WorkflowPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = useParams();
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Workflow Editor</h1>
            <p className="text-xs text-muted-foreground">ID: {id}</p>
          </div>
        </div>
      </header>
      <ActionBar />
      <div className="flex-1">
        <WorkflowCanvas />
      </div>
    </div>
  );
}
