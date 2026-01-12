import axios from "axios";
import { Edge, Node } from "reactflow";

export const logoutUser = async () => await axios.get("/auth/logout");

export const scheduleEmail = async (
  nodes: Node[],
  edges: Edge[],
  flowId: string | null
) =>
  await axios.post("/api/flow/schedule/run", {
    nodes,
    edges,
    flowId,
  });

export const saveFlow = async (edges: Edge[], nodes: Node[], flowId: string) =>
  await axios.post("/api/flow/schedule/save", {
    nodes,
    edges,
    flowId,
  });

export const userScheduleHistory = async (userId: string) =>
  await axios.get(`/api/flow/history?userId=${userId}`);

export const deleteFlow = async (flowId: string) =>
  await axios.delete(`/api/flow/delete?id=${flowId}`);
