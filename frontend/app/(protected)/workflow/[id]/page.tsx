import ActionBar from "@/components/workflow/action-bar";
import WorkflowCanvas from "@/components/workflow/workflow-canvas";
import mongoose from "mongoose";
import { Flow } from "@/lib/models/Flow";
import BackButton from "@/components/dashboard/BackButton";
import { Edge, Node } from "reactflow";
export default async function WorkflowPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  let workflow;

  mongoose.isObjectIdOrHexString(id);
  if (mongoose.isObjectIdOrHexString(id)) {
    workflow = await Flow.findOne({
      _id: new mongoose.Types.ObjectId(id),
    }).lean();
  } else {
    workflow = null;
  }
  const nodes = (workflow?.nodes || []).map((node: Node, i: number) => ({
    ...node,
    position: { x: node?.position?.x, y: node?.position?.y },
  }));
  const edges = (workflow?.edges || []).map((edge: Edge, i: number) => ({
    ...edge,
    source: edge.source,
    target: edge.target,
  }));
  const flowId = new mongoose.Types.ObjectId(workflow._id).toString();
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="px-4 py-3 flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-lg font-semibold">Workflow Editor</h1>
            <p className="text-xs text-muted-foreground">ID: {id}</p>
          </div>
        </div>
      </header>
      <ActionBar />
      <div className="flex-1">
        <WorkflowCanvas
          fetchedNedes={nodes || null}
          fetchedEdges={edges || null}
          flowId={flowId}
        />
      </div>
    </div>
  );
}
