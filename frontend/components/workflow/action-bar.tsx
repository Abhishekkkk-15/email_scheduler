"use client";

import { Button } from "@/components/ui/button";
import {
  Database,
  Mail,
  Clock,
  Trash2,
  Save,
  WorkflowIcon,
  ChevronDown,
} from "lucide-react";
import { useWorkflowStore } from "@/lib/workflow-store";
import { toast } from "sonner";
import { saveFlow, scheduleEmail } from "@/lib/api/api";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ActionBar() {
  const { nodes, addNode, clearWorkflow, edges, flowId } = useWorkflowStore();
  const { id } = useParams();

  const [isDirty, setIsDirty] = useState(false);
  const initialSnapshot = useRef<string>("");

  useEffect(() => {
    const snapshot = JSON.stringify({ nodes, edges });

    if (!initialSnapshot.current) {
      initialSnapshot.current = snapshot;
      return;
    }

    setIsDirty(snapshot !== initialSnapshot.current);
  }, [nodes, edges]);

  const isFlowValid = useMemo(() => {
    const hasLead = nodes.filter((n) => n.type === "leadSource");
    const hasEmail = nodes.some((n) => n!.type!.includes("coldEmail"));
    const moreThenTwoLead = hasLead.length > 1 && hasLead ? false : true;
    return moreThenTwoLead && hasEmail;
  }, [nodes]);

  const addLeadSource = () => {
    const hasLead = nodes.filter((n) => n.type === "leadSource");
    const moreThenTwoLead = hasLead.length > 0 && hasLead ? true : false;
    if (moreThenTwoLead)
      return toast.warning("More then on lead Source not allowed");
    addNode({
      id: `lead-${Date.now()}`,
      type: "leadSource",
      position: { x: 250, y: nodes.length * 150 },
      data: { label: "Lead Source", config: { source: "" } },
    });
    toast.success("Lead Source node added");
  };

  const addColdEmail = () => {
    addNode({
      id: `cold-${Date.now()}`,
      type: "coldEmail",
      position: { x: 250, y: nodes.length * 150 },
      data: {
        label: "Cold Email",
        config: { senderEmail: "", emailType: "welcome", body: "" },
      },
    });
    toast.success("Cold Email node added");
  };

  const addWait = () => {
    addNode({
      id: `wait-${Date.now()}`,
      type: "wait",
      position: { x: 250, y: nodes.length * 150 },
      data: { label: "Wait", config: { delay: 1, unit: "minutes" } },
    });
    toast.success("Wait node added");
  };

  const addFollowup = () => {
    addNode({
      id: `followup-${Date.now()}`,
      type: "followupEmail",
      position: { x: 250, y: nodes.length * 150 },
      data: {
        label: "Follow-up Email",
        config: { senderEmail: "", emailType: "follow-up", body: "" },
      },
    });
    toast.success("Follow-up Email node added");
  };

  const handleSave = async () => {
    console.log("id", flowId);
    await saveFlow(edges, nodes, flowId);
    initialSnapshot.current = JSON.stringify({ nodes, edges });
    setIsDirty(false);
    toast.success("Workflow saved");
  };

  const handleSaveAndRun = async () => {
    if (!isFlowValid) return;

    const flowId = id?.toString()!;

    await scheduleEmail(nodes, edges, flowId);
    initialSnapshot.current = JSON.stringify({ nodes, edges });
    setIsDirty(false);
    toast.success("Workflow saved & running");
  };

  return (
    <div className="sticky top-0 z-30 bg-background border-b">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={addLeadSource}>
              <Database className="h-4 w-4 mr-2" />
              Lead Source
            </Button>
            <Button variant="outline" size="sm" onClick={addColdEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Cold Email
            </Button>
            <Button variant="outline" size="sm" onClick={addWait}>
              <Clock className="h-4 w-4 mr-2" />
              Wait
            </Button>
            <Button variant="outline" size="sm" onClick={addFollowup}>
              <Mail className="h-4 w-4 mr-2" />
              Follow-up
            </Button>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30"
              onClick={clearWorkflow}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="relative">
                  {isDirty && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                  <Save className="h-4 w-4 mr-2" />
                  Save
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save only
                </DropdownMenuItem>

                <DropdownMenuItem
                  disabled={!isFlowValid}
                  onClick={handleSaveAndRun}
                  className={
                    !isFlowValid ? "opacity-50 cursor-not-allowed" : ""
                  }>
                  <WorkflowIcon className="h-4 w-4 mr-2" />
                  Save & Run
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
