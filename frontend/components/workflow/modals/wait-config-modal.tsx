'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkflowStore } from '@/lib/workflow-store';

interface WaitConfigModalProps {
  nodeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitConfigModal({ nodeId, isOpen, onClose }: WaitConfigModalProps) {
  const { nodes, updateNode } = useWorkflowStore();
  const node = nodes.find((n) => n.id === nodeId);
  const [delay, setDelay] = useState(node?.data?.config?.delay || 1);
  const [unit, setUnit] = useState(node?.data?.config?.unit || 'minutes');

  useEffect(() => {
    if (node) {
      setDelay(node.data?.config?.delay || 1);
      setUnit(node.data?.config?.unit || 'minutes');
    }
  }, [node]);

  const handleSave = () => {
    updateNode(nodeId, {
      config: { delay: Number(delay), unit },
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Wait Time</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="delay">Delay Duration</Label>
            <Input
              id="delay"
              type="number"
              min="1"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Time Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seconds">Seconds</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
              </SelectContent>
            </Select>
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
