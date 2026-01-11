'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmailConfigModal from '../modals/email-config-modal';

function EmailNode({ data, id, type }: NodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isFollowup = type === 'followupEmail';

  return (
    <>
      <Card className="min-w-[280px] bg-white shadow-sm border-2 border-green-200">
        <div className="p-4">
          <Handle type="target" position={Position.Top} className="!bg-green-500" />
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-sm">
              {isFollowup ? 'Follow-up Email' : 'Cold Email'}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            Type: {data.config?.emailType || 'Not set'}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            From: {data.config?.senderEmail || 'Not set'}
          </p>
          <Button size="sm" variant="outline" className="w-full" onClick={() => setIsOpen(true)}>
            Configure
          </Button>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
      </Card>
      <EmailConfigModal nodeId={id} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default memo(EmailNode);
