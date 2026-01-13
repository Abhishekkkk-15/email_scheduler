import ActionBar from "@/components/workflow/action-bar";
import WorkflowCanvas from "@/components/workflow/workflow-canvas";
import mongoose from "mongoose";
import { Flow } from "@/lib/models/Flow";
import BackButton from "@/components/dashboard/BackButton";
import { Node } from "reactflow";
export default async function WorkflowPage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="px-4 py-3 flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-lg font-semibold">Workflow Editor</h1>
          </div>
        </div>
      </header>
      <ActionBar />
      <div className="flex-1">
        <WorkflowCanvas fetchedNedes={null} fetchedEdges={null} />
      </div>
    </div>
  );
}
