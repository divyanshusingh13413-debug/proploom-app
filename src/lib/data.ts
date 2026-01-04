import type { Agent, Lead, Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const agents: Agent[] = [
  { id: 'agent-1', name: 'Raj Patel', avatarUrl: findImage('agent-1'), calls: 12, callDuration: 85, toursGiven: 5 },
  { id: 'agent-2', name: 'Priya Sharma', avatarUrl: findImage('agent-2'), calls: 8, callDuration: 60, toursGiven: 7 },
  { id: 'agent-3', name: 'Amit Singh', avatarUrl: findImage('agent-3'), calls: 15, callDuration: 110, toursGiven: 3 },
  { id: 'agent-4', name: 'Sunita Kaur', avatarUrl: findImage('agent-4'), calls: 5, callDuration: 45, toursGiven: 8 },
];

export const properties: Property[] = [
  { id: 'prop-1', name: 'The Imperial', tourImageUrl: findImage('property-1-tour'), brochureUrl: 'https://example.com/brochure1.pdf' },
  { id: 'prop-2', name: 'Greenwood Heights', tourImageUrl: findImage('property-2-tour'), brochureUrl: 'https://example.com/brochure2.pdf' },
  { id: 'prop-3', name: 'Oceanic View', tourImageUrl: findImage('property-3-tour'), brochureUrl: 'https://example.com/brochure3.pdf' },
];

export const leads: Lead[] = [
  { id: 'lead-1', name: 'Rahul Gupta', status: 'Hot', propertyName: 'The Imperial', source: 'Website', lastContact: '2 days ago', agentId: 'agent-1' },
  { id: 'lead-2', name: 'Anjali Verma', status: 'Cold', propertyName: 'Greenwood Heights', source: 'Referral', lastContact: '5 days ago', agentId: 'agent-2' },
  { id: 'lead-3', name: 'Vikram Reddy', status: 'Hot', propertyName: 'The Imperial', source: 'Zillow', lastContact: '1 day ago', agentId: 'agent-1' },
  { id: 'lead-4', name: 'Sneha Joshi', status: 'New', propertyName: 'Oceanic View', source: 'Website', lastContact: '3 hours ago', agentId: 'agent-3' },
  { id: 'lead-5', name: 'Karan Malhotra', status: 'Cold', propertyName: 'Greenwood Heights', source: 'Walk-in', lastContact: '1 week ago', agentId: 'agent-4' },
  { id: 'lead-6', name: 'Meera Desai', status: 'Hot', propertyName: 'Oceanic View', source: 'MagicBricks', lastContact: 'Yesterday', agentId: 'agent-3' },
];
