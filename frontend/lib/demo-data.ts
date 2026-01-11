import { Node, Edge } from 'reactflow';

export const demoNodes: Node[] = [
  {
    id: 'lead-1',
    type: 'leadSource',
    position: { x: 250, y: 0 },
    data: {
      label: 'Lead Source',
      config: { source: 'Google Ads Campaign' },
    },
  },
  {
    id: 'email-1',
    type: 'coldEmail',
    position: { x: 250, y: 150 },
    data: {
      label: 'Cold Email',
      config: {
        senderEmail: 'sales@example.com',
        emailType: 'welcome',
        body: 'Hi {{name}},\n\nWelcome to our platform!\n\nBest regards,\nSales Team',
      },
    },
  },
  {
    id: 'wait-1',
    type: 'wait',
    position: { x: 250, y: 300 },
    data: {
      label: 'Wait',
      config: { delay: 2, unit: 'hours' },
    },
  },
  {
    id: 'followup-1',
    type: 'followupEmail',
    position: { x: 250, y: 450 },
    data: {
      label: 'Follow-up Email',
      config: {
        senderEmail: 'sales@example.com',
        emailType: 'follow-up',
        body: 'Hi {{name}},\n\nJust checking in to see if you have any questions.\n\nBest regards,\nSales Team',
      },
    },
  },
];

export const demoEdges: Edge[] = [
  { id: 'e1-2', source: 'lead-1', target: 'email-1' },
  { id: 'e2-3', source: 'email-1', target: 'wait-1' },
  { id: 'e3-4', source: 'wait-1', target: 'followup-1' },
];
