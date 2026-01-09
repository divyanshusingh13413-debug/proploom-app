
import { Timestamp } from 'firebase/firestore';

export type Lead = {
  id: string;
  name: string;
  status: 'New' | 'Contacted' | 'Closed' | 'Follow-up Due' | 'Meeting Today';
  propertyName: string;
  source: string;
  lastContact: string;
  agentId: string;
  budget: number;
  email: string;
  phone: string;
  aiScore?: number;
  timestamp: Timestamp;
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
