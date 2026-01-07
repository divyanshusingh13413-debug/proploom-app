
import type { Agent, Lead, Property, Deal } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const agents: Agent[] = [
  { id: 'agent-1', name: 'Raj Patel', avatarUrl: findImage('agent-1'), deals: 24, successRate: 88 },
  { id: 'agent-2', name: 'Priya Sharma', avatarUrl: findImage('agent-2'), deals: 18, successRate: 92 },
  { id: 'agent-3', name: 'Amit Singh', avatarUrl: findImage('agent-3'), deals: 32, successRate: 75 },
];

export const properties: Property[] = [
  { id: 'prop-1', name: 'The Imperial', tourImageUrl: findImage('property-1-tour'), brochureUrl: 'https://example.com/brochure1.pdf' },
  { id: 'prop-2', name: 'Greenwood Heights', tourImageUrl: findImage('property-2-tour'), brochureUrl: 'https://example.com/brochure2.pdf' },
  { id: 'prop-3', name: 'Oceanic View', tourImageUrl: findImage('property-3-tour'), brochureUrl: 'https://example.com/brochure3.pdf' },
];

export const leads: Lead[] = [
    { id: 'lead-1', name: 'Aarav Sharma', propertyName: 'The Imperial', source: 'Website', status: 'New', lastContact: '2h ago', agentId: 'agent-1', budget: 1500000, email: 'aarav.sharma@example.com', phone: '+919876543210', aiScore: 85, },
    { id: 'lead-2', name: 'Diya Patel', propertyName: 'Greenwood Heights', source: 'Referral', status: 'Follow-up Due', lastContact: '1d ago', agentId: 'agent-2', budget: 2500000, email: 'diya.patel@example.com', phone: '+919123456789' },
    { id: 'lead-3', name: 'Rohan Mehta', propertyName: 'Oceanic View', source: 'Walk-in', status: 'Meeting Today', lastContact: '4h ago', agentId: 'agent-1', budget: 3200000, email: 'rohan.mehta@example.com', phone: '+919988776655', aiScore: 92 },
];


// Re-categorizing leads for the dashboard as the new Leads page uses a different status set
export const dashboardLeads: Lead[] = leads.map(l => {
    let newStatus: "New" | "Hot" | "Cold" = "New";
    if (l.status === 'Follow-up Due' || l.aiScore && l.aiScore > 80) newStatus = "Hot";
    if (l.status === 'Contacted' && (!l.aiScore || l.aiScore <= 80)) newStatus = "Cold";
    return { ...l, status: newStatus as any };
});

export const salesData = [
    { name: 'Stage 1', new: 88, negotiation: 8, closed: 4 },
    { name: 'Stage 2', new: 35, negotiation: 0, closed: 0 },
  ];
  
  export const deals: Deal[] = [
    { id: 'deal-1', clientName: 'Client 1', dealName: 'Luxury Penthouse', status: 'New', dealValue: '750K', agentId: 'agent-1', lastActivity: 'Now' },
    { id: 'deal-2', clientName: 'Client 2', dealName: 'Meajstion', status: 'Negotiation', dealValue: '150K', agentId: 'agent-2', lastActivity: 'Yesterday' },
    { id: 'deal-3', clientName: 'Client 3', dealName: 'Negrisrattion', status: 'New', dealValue: '1.2M', agentId: 'agent-3', lastActivity: '3 days ago' },
  ];
