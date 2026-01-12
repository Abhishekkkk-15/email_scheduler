import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  LeadSourceNode,
  WaitNode,
  EmailNode,
  SuccessNode,
} from "./WorkflowNodes";

const nodeTypes = {
  leadSource: LeadSourceNode,
  wait: WaitNode,
  email: EmailNode,
  success: SuccessNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "leadSource",
    position: { x: 50, y: 100 },
    data: { label: "Lead Source", subtitle: "Google Ads" },
  },
  {
    id: "2",
    type: "wait",
    position: { x: 280, y: 100 },
    data: { label: "Wait", subtitle: "10 seconds" },
  },
  {
    id: "3",
    type: "email",
    position: { x: 510, y: 100 },
    data: { label: "Welcome Email", subtitle: "Template #1", status: "active" },
  },
  {
    id: "4",
    type: "wait",
    position: { x: 740, y: 100 },
    data: { label: "Wait", subtitle: "2 days" },
  },
  {
    id: "5",
    type: "email",
    position: { x: 970, y: 100 },
    data: { label: "Follow-up Email", subtitle: "Template #2" },
  },
  {
    id: "6",
    type: "success",
    position: { x: 1200, y: 100 },
    data: { label: "Complete", subtitle: "Workflow Done" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#3b82f6", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    style: { stroke: "#f59e0b", strokeWidth: 2 },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    style: { stroke: "#a855f7", strokeWidth: 2 },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    animated: true,
    style: { stroke: "#f59e0b", strokeWidth: 2 },
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    animated: true,
    style: { stroke: "#10b981", strokeWidth: 2 },
  },
];

export function AnimatedWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeEdgeIndex, setActiveEdgeIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveEdgeIndex((i) => (i + 1) % edges.length);
    }, 2200);
    return () => clearInterval(id);
  }, [edges.length]);

  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge, i) => ({
        ...edge,
        animated: i === activeEdgeIndex,
        style: {
          strokeWidth: 2,
          stroke:
            i <= activeEdgeIndex
              ? "var(--primary)"
              : "hsl(var(--muted-foreground) / 0.4)",
        },
      }))
    );
  }, [activeEdgeIndex]);

  return (
    <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border bg-muted/30 shadow-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}>
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1}
          className="opacity-40"
        />
      </ReactFlow>
    </div>
  );
}
