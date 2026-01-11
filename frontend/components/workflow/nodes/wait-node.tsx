'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WaitConfigModal from '../modals/wait-config-modal';

function WaitNode({ data, id }: NodeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="min-w-[280px] bg-white shadow-sm border-2 border-orange-200">
        <div className="p-4">
          <Handle type="target" position={Position.Top} className="!bg-orange-500" />
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-sm">Wait</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {data.config?.delay
              ? `${data.config.delay} ${data.config.unit}`
              : 'No delay configured'}
          </p>
          <Button size="sm" variant="outline" className="w-full" onClick={() => setIsOpen(true)}>
            Configure
          </Button>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-orange-500" />
      </Card>
      <WaitConfigModal nodeId={id} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default memo(WaitNode);
