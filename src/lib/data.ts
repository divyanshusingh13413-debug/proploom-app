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
  { id: 'lead-1', name: 'Rahul Gupta', status: 'Contacted', propertyName: 'The Imperial', source: 'Website', lastContact: '2 days ago', agentId: 'agent-1', budget: 1200000, email: 'rahul.g@example.com', phone: '9876543210' },
  { id: 'lead-2', name: 'Anjali Verma', status: 'Closed', propertyName: 'Greenwood Heights', source: 'Referral', lastContact: '5 days ago', agentId: 'agent-2', budget: 2500000, email: 'anjali.v@example.com', phone: '9876543211' },
  { id: 'lead-3', name: 'Vikram Reddy', status: 'Contacted', propertyName: 'The Imperial', source: 'Zillow', lastContact: '1 day ago', agentId: 'agent-1', budget: 1500000, email: 'vikram.r@example.com', phone: '9876543212' },
  { id: 'lead-4', name: 'Sneha Joshi', status: 'New', propertyName: 'Oceanic View', source: 'Website', lastContact: '3 hours ago', agentId: 'agent-3', budget: 3200000, email: 'sneha.j@example.com', phone: '9876543213' },
  { id: 'lead-5', name: 'Karan Malhotra', status: 'Closed', propertyName: 'Greenwood Heights', source: 'Walk-in', lastContact: '1 week ago', agentId: 'agent-4', budget: 2800000, email: 'karan.m@example.com', phone: '9876543214' },
  { id: 'lead-6', name: 'Meera Desai', status: 'Contacted', propertyName: 'Oceanic View', source: 'MagicBricks', lastContact: 'Yesterday', agentId: 'agent-3', budget: 3500000, email: 'meera.d@example.com', phone: '9876543215' },
];

// Re-categorizing leads for the dashboard as the new Leads page uses a different status set
export const dashboardLeads: Lead[] = [
    { id: 'lead-1', name: 'Rahul Gupta', status: 'Hot' as any, propertyName: 'The Imperial', source: 'Website', lastContact: '2 days ago', agentId: 'agent-1', budget: 1200000, email: 'rahul.g@example.com', phone: '9876543210' },
    { id: 'lead-2', name: 'Anjali Verma', status: 'Cold' as any, propertyName: 'Greenwood Heights', source: 'Referral', lastContact: '5 days ago', agentId: 'agent-2', budget: 2500000, email: 'anjali.v@example.com', phone: '9876543211' },
    { id: 'lead-3', name: 'Vikram Reddy', status: 'Hot' as any, propertyName: 'The Imperial', source: 'Zillow', lastContact: '1 day ago', agentId: 'agent-1', budget: 1500000, email: 'vikram.r@example.com', phone: '9876543212' },
    { id: 'lead-4', name: 'Sneha Joshi', status: 'New' as any, propertyName: 'Oceanic View', source: 'Website', lastContact: '3 hours ago', agentId: 'agent-3', budget: 3200000, email: 'sneha.j@example.com', phone: '9876543213' },
    { id: 'lead-5', name: 'Karan Malhotra', status: 'Cold' as any, propertyName: 'Greenwood Heights', source: 'Walk-in', lastContact: '1 week ago', agentId: 'agent-4', budget: 2800000, email: 'karan.m@example.com', phone: '9876543214' },
    { id: 'lead-6', name: 'Meera Desai', status: 'Hot' as any, propertyName: 'Oceanic View', source: 'MagicBricks', lastContact: 'Yesterday', agentId: 'agent-3', budget: 3500000, email: 'meera.d@example.com', phone: '9876543215' },
];
