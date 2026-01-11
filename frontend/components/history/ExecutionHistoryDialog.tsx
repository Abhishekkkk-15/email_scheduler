"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { deleteFlow, userScheduleHistory } from "@/lib/api/api";
import { socket } from "@/lib/websocket/socket";
import { User } from "next-auth";

/* ---------------- TYPES ---------------- */

interface FlowNode {
  id: string;
  type: string;
  data: any;
}

interface FlowHistory {
  _id: string;
  createdAt: string;
  nodes: FlowNode[];
  taskCompleted?: number;
}

interface ExecutionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  logedUser: User;
}

/* ---------------- COMPONENT ---------------- */

export default function ExecutionHistoryDialog({
  isOpen,
  onClose,
  logedUser,
}: ExecutionHistoryDialogProps) {
  const [history, setHistory] = useState<FlowHistory[]>([]);
  const [liveTaskCount, setLiveTaskCount] = useState<Record<string, number>>(
    {}
  );
  const [flowStatus, setFlowStatus] = useState<Record<string, string>>({});
  const socketInitialized = useRef(false);

  /* -------- Fetch history -------- */

  const fetchHistory = async () => {
    try {
      const { data } = await userScheduleHistory(logedUser.id!);
      console.log("history", data);
      setHistory(data?.data || []);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  /* -------- Task count helpers -------- */

  const getFilteredTaskCount = (flow: FlowHistory) =>
    flow.nodes.filter((n) => n.type !== "leadSource" && n.type !== "wait");

  /* -------- Socket live updates -------- */

  useEffect(() => {
    if (socketInitialized.current) return;
    const handleTaskCount = (data: {
      flowId: string;
      taskCompleted: number;
    }) => {
      setLiveTaskCount((prev) => ({
        ...prev,
        [data.flowId]: data.taskCompleted,
      }));
    };
    socket.on("email-status", (data: { flowId: string; status: string }) => {
      console.log("email0sta", data);
      setFlowStatus((prev) => ({
        ...prev,
        [data.flowId]: data.status,
      }));
    });
    socket.on("taskCount", handleTaskCount);
    socketInitialized.current = true;

    return () => {
      socket.off("taskCount", handleTaskCount);
      socketInitialized.current = false;
    };
  }, []);

  /* -------- Open dialog -------- */

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  /* -------- Delete flow -------- */

  const handleDelete = async (flowId: string) => {
    try {
      await deleteFlow(flowId);
      setHistory((prev) => prev.filter((f) => f._id !== flowId));
    } catch {
      alert("Failed to delete flow");
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Execution History
          </DialogTitle>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        {/* Body */}
        <ScrollArea className="max-h-[70vh] px-6 py-4">
          <div className="space-y-4">
            {history.map((flow) => {
              const totalTasks = getFilteredTaskCount(flow);
              let mailCount = totalTasks.reduce(
                (a, n) =>
                  a + n.data?.config?.csvEmails
                    ? 1
                    : n.data?.config?.csvEmails?.length,
                0
              );

              const completed =
                liveTaskCount[flow._id] ?? flow.taskCompleted ?? 0;
              console.log(mailCount, completed);
              const isDone = completed === mailCount;

              return (
                <div
                  key={flow._id}
                  className="rounded-xl border bg-background p-4 shadow-sm hover:shadow-md transition">
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">
                          Flow ID:{" "}
                          <span className="text-muted-foreground">
                            {flow._id}
                          </span>
                        </p>

                        <AnimatedStatusBadge status={flowStatus[flow._id]} />
                      </div>
                      <p className="text-muted-foreground">
                        Created At: {new Date(flow.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={isDone ? "success" : "destructive"}
                        className="rounded-full px-3 py-1 text-xs">
                        {completed} / {mailCount} Tasks
                      </Badge>

                      <Button
                        variant="link"
                        className="text-red-500 px-0"
                        onClick={() => handleDelete(flow._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Flow preview */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {flow.nodes.map((node, idx) => (
                      <div key={node.id} className="flex items-center gap-2">
                        <div className="rounded-md border px-3 py-1 text-xs font-medium bg-muted">
                          {node.type.toUpperCase()}
                        </div>
                        {idx < flow.nodes.length - 1 && (
                          <span className="text-muted-foreground">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {history.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No execution history found.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AnimatedStatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const statusConfig: Record<string, { label: string; className: string }> = {
    QUEUED: {
      label: "Queued",
      className: "bg-gray-100 text-gray-800",
    },
    PROCESSING: {
      label: "Processing",
      className: "bg-blue-100 text-blue-800",
    },
    SENDING: {
      label: "Sending",
      className: "bg-yellow-100 text-yellow-800",
    },
    SENT: {
      label: "Sent",
      className: "bg-green-100 text-green-800",
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-100 text-red-800",
    },
  };
  const cfg = statusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <div className="relative overflow-hidden">
      <Badge
        className={`
          rounded-full px-3 py-1 text-xs font-medium
          transition-all duration-300 ease-out
          animate-slide-in
          ${cfg.className}
        `}>
        {cfg.label}
      </Badge>
    </div>
  );
}
