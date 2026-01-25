
import { Timestamp } from 'firebase/firestore';

export type ActivityLog = {
  action: string;
  timestamp: Timestamp;
  agentId: string;
  agentName: string;
};

export type Lead = {
  id: string;
  name: string;
  status: 'New' | 'Contacted' | 'Closed' | 'Follow-up Due' | 'Meeting Today';
  propertyName: string;
  source: string;
  lastContact?: string;
  agentId?: string;
  budget: number;
  email: string;
  phone: string;
  aiScore?: number;
  timestamp?: Timestamp;
  assignedAgentId?: string;
  assignedAgentName?: string;
  activityLog?: ActivityLog[];
};

export type Agent = {
  id: string;
  name: string;
  avatarUrl: string;
  deals: number;
  successRate: number; // as a percentage
};

export type Property = {
  id: string;
  name: string;
  tourImageUrl: string;
  brochureUrl: string;
};

export type Deal = {
  id: string;
  clientName: string;
  dealName: string;
  status: 'New' | 'Negotiation' | 'Closed';
  dealValue: string;
  agentId: string;
  lastActivity: string;
};

export type Message = {
  id: string;
  text: string;
  senderId: string | undefined;
  status: 'sent' | 'delivered' | 'read';
  timestamp: any; // Firestore Timestamp
};

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  roles: ('admin' | 'agent')[];
  isFirstLogin: boolean;
  createdAt?: Timestamp;
};

    