"use client";

import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflowStore } from "@/lib/workflow-store";
import LeadSourceNode from "./nodes/lead-source-node";
import EmailNode from "./nodes/email-node";
import WaitNode from "./nodes/wait-node";

const nodeTypes = {
  leadSource: LeadSourceNode,
  coldEmail: EmailNode,
  followupEmail: EmailNode,
  wait: WaitNode,
};

export default function WorkflowCanvas({
  fetchedNedes,
  fetchedEdges,
  flowId,
}: {
  fetchedNedes: Node[] | null;
  fetchedEdges: Edge[] | null;
  flowId?: string;
}) {
  console.log(fetchedNedes, fetchedEdges);
  const { nodes, edges, setNodes, setEdges, setFlowId } = useWorkflowStore();
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);
  useEffect(() => {
    if (fetchedNedes && fetchedEdges) {
      setNodes(fetchedNedes);
      setEdges(fetchedEdges);
      if (flowId) {
        setFlowId(flowId);
      }
    }
  }, [fetchedNedes, fetchedEdges, setNodes, setEdges]);
  useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, localEdges);
      setLocalEdges(newEdges);
      setEdges(newEdges);
    },
    [localEdges, setLocalEdges, setEdges]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      const updatedNodes = changes.reduce((acc: any, change: any) => {
        if (change.type === "position" && change.position) {
          return acc.map((n: any) =>
            n.id === change.id ? { ...n, position: change.position } : n
          );
        }
        return acc;
      }, localNodes);
      if (updatedNodes.length > 0) {
        setNodes(updatedNodes);
      }
    },
    [onNodesChange, localNodes, setNodes]
  );
  useEffect(() => {
    return () => {
      setEdges([]);
      setNodes([]);
      setLocalEdges([]);
      setLocalNodes([]);
    };
  }, []);
  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-gray-50">
        <Background color="black" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
