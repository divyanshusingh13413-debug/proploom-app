export type Lead = {
  id: string;
  name: string;
  status: 'Hot' | 'Cold' | 'New';
  propertyName: string;
  source: string;
  lastContact: string;
  agentId: string;
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
