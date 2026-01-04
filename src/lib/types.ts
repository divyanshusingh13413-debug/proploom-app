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
};

export type Agent = {
  id: string;
  name: string;
  avatarUrl: string;
  calls: number;
  callDuration: number; // in minutes
  toursGiven: number;
};

export type Property = {
  id: string;
  name: string;
  tourImageUrl: string;
  brochureUrl: string;
};
