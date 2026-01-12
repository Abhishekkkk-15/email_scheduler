import { create } from "zustand";
import { Node, Edge } from "reactflow";
import { WorkflowNode } from "@/types/workflow";

interface NodeWithData extends Node {
  data: {
    config: {
      senderEmail: string;
      emailType: string;
      body: string;
      subject: string;
      template: string;
      mode: "single" | "csv";
      senderName?: string;
      singleEmail?: string;
      csvEmails?: string[];
      source?: string;
      delay?: number;
      unit?: "seconds" | "minutes" | "hours";
    };
  };
}

interface WorkflowState {
  nodes: NodeWithData[];
  edges: Edge[];
  flowId: string;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, data: any) => void;
  clearWorkflow: () => void;
  setFlowId: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  flowId: "",
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    })),
  clearWorkflow: () => set({ nodes: [], edges: [] }),
  setFlowId: (id: string) => set({ flowId: id }),
}));
