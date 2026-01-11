export type NodeType = 'leadSource' | 'coldEmail' | 'wait' | 'followupEmail';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

export interface NodeData {
  label: string;
  config?: LeadSourceConfig | EmailConfig | WaitConfig;
}

export interface LeadSourceConfig {
  source: string;
}

export interface EmailConfig {
  senderEmail: string;
  emailType: 'welcome' | 'follow-up';
  body: string;
}

export interface WaitConfig {
  delay: number;
  unit: 'seconds' | 'minutes' | 'hours';
}

export interface Workflow {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
