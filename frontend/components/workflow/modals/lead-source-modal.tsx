"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useWorkflowStore } from "@/lib/workflow-store";

interface LeadSourceModalProps {
  nodeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadSourceModal({
  nodeId,
  isOpen,
  onClose,
}: LeadSourceModalProps) {
  const { nodes, updateNode } = useWorkflowStore();
  const node = nodes.find((n) => n.id === nodeId);
  const [source, setSource] = useState(node?.data?.config?.source || "");

  useEffect(() => {
    if (node) {
      setSource(node.data?.config?.source || "");
    }
  }, [node]);

  const handleSave = () => {
    console.log(nodes, source, node);
    updateNode(nodeId, {
      config: { source },
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Lead Source</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="source">Lead Source</Label>
            <Input
              id="source"
              placeholder="e.g., Google Ads, CSV Upload, API"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
