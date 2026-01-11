'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeadSourceModal from '../modals/lead-source-modal';

function LeadSourceNode({ data, id }: NodeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="min-w-[280px] bg-white shadow-sm border-2 border-blue-200">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-sm">Lead Source</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {data.config?.source || 'No source configured'}
          </p>
          <Button size="sm" variant="outline" className="w-full" onClick={() => setIsOpen(true)}>
            Configure
          </Button>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
      </Card>
      <LeadSourceModal nodeId={id} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default memo(LeadSourceNode);
