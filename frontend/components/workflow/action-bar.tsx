"use client";

import { Button } from "@/components/ui/button";
import { Database, Mail, Clock, Trash2, Save } from "lucide-react";
import { useWorkflowStore } from "@/lib/workflow-store";
import { toast } from "sonner";
import { scheduleEmail } from "@/lib/api/api";

export default function ActionBar() {
  const { nodes, addNode, clearWorkflow, edges } = useWorkflowStore();

  const addLeadSource = () => {
    const newNode = {
      id: `lead-${Date.now()}`,
      type: "leadSource",
      position: { x: 250, y: nodes.length * 150 },
      data: { label: "Lead Source", config: { source: "" } },
    };
    addNode(newNode);
    toast.success("Lead Source node added");
  };

  const addColdEmail = () => {
    const newNode = {
      id: `cold-${Date.now()}`,
      type: "coldEmail",
      position: { x: 250, y: nodes.length * 150 },
      data: {
        label: "Cold Email",
        config: { senderEmail: "", emailType: "welcome", body: "" },
      },
    };
    addNode(newNode);
    toast.success("Cold Email node added");
  };

  const addWait = () => {
    const newNode = {
      id: `wait-${Date.now()}`,
      type: "wait",
      position: { x: 250, y: nodes.length * 150 },
      data: { label: "Wait", config: { delay: 1, unit: "minutes" } },
    };
    addNode(newNode);
    toast.success("Wait node added");
  };

  const addFollowup = () => {
    const newNode = {
      id: `followup-${Date.now()}`,
      type: "followupEmail",
      position: { x: 250, y: nodes.length * 150 },
      data: {
        label: "Follow-up Email",
        config: { senderEmail: "", emailType: "follow-up", body: "" },
      },
    };
    addNode(newNode);
    toast.success("Follow-up Email node added");
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all nodes?")) {
      clearWorkflow();
      toast.success("Workflow cleared");
    }
  };

  const handleSave = async () => {
    console.log("nodes", nodes);
    await scheduleEmail(nodes, edges);
    toast.success("Workflow saved successfully");
  };

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
        <Button onClick={addLeadSource} variant="outline" size="sm">
          <Database className="mr-2 h-4 w-4" />
          Add Lead Source
        </Button>
        <Button onClick={addColdEmail} variant="outline" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Add Cold Email
        </Button>
        <Button onClick={addWait} variant="outline" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Add Wait
        </Button>
        <Button onClick={addFollowup} variant="outline" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Add Follow-up
        </Button>
        <div className="flex-1" />
        <Button onClick={handleClear} variant="outline" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleSave} size="sm">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
