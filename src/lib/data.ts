
import type { Agent, Lead, Property, Deal } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const agents: Agent[] = [
  { id: 'agent-1', name: 'Agent 1', avatarUrl: findImage('agent-1'), calls: 0, callDuration: 0, toursGiven: 0 },
  { id: 'agent-2', name: 'Agent 2', avatarUrl: findImage('agent-2'), calls: 0, callDuration: 0, toursGiven: 0 },
  { id: 'agent-3', name: 'Agent 3', avatarUrl: findImage('agent-3'), calls: 0, callDuration: 0, toursGiven: 0 },
  { id: 'agent-4', name: 'Agent 4', avatarUrl: findImage('agent-4'), calls: 0, callDuration: 0, toursGiven: 0 },
  { id: 'agent-5', name: 'Agent 5', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80', calls: 0, callDuration: 0, toursGiven: 0 },
];

export const properties: Property[] = [
  { id: 'prop-1', name: 'The Imperial', tourImageUrl: findImage('property-1-tour'), brochureUrl: 'https://example.com/brochure1.pdf' },
  { id: 'prop-2', name: 'Greenwood Heights', tourImageUrl: findImage('property-2-tour'), brochureUrl: 'https://example.com/brochure2.pdf' },
  { id: 'prop-3', name: 'Oceanic View', tourImageUrl: findImage('property-3-tour'), brochureUrl: 'https://example.com/brochure3.pdf' },
];

export const leads: Lead[] = [];


// Re-categorizing leads for the dashboard as the new Leads page uses a different status set
export const dashboardLeads: Lead[] = [];

export const salesData = [
    { name: 'Stage 1', new: 88, negotiation: 8, closed: 4 },
    { name: 'Stage 2', new: 35, negotiation: 0, closed: 0 },
  ];
  
  export const deals: Deal[] = [
    { id: 'deal-1', clientName: 'Client 1', dealName: 'Luxury Penthouse', status: 'New', dealValue: '750K', agentId: 'agent-1', lastActivity: 'Now' },
    { id: 'deal-2', clientName: 'Client 2', dealName: 'Meajstion', status: 'Negotiation', dealValue: '150K', agentId: 'agent-2', lastActivity: 'Yesterday' },
    { id: 'deal-3', clientName: 'Client 3', dealName: 'Negrisrattion', status: 'New', dealValue: '1.2M', agentId: 'agent-3', lastActivity: '3 days ago' },
  ];
