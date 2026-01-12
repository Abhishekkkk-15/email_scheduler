export type NodeType = "leadSource" | "coldEmail" | "wait" | "followupEmail";

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

export type EmailConfig = {
  senderEmail: string;
  emailType: string;
  body: string;
  subject: string;
  template: string;
  mode: "single" | "csv";
  senderName?: string;
  singleEmail?: string;
  csvEmails?: string[];
  source: string;
  delay: number;
};

export interface WaitConfig {
  delay: number;
  unit: "seconds" | "minutes" | "hours";
}

export interface Workflow {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
