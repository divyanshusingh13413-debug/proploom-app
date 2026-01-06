
'use client';

import { useState } from 'react';
import { leads as initialLeads, agents } from '@/lib/data';
import type { Lead } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, CircleEllipsis } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { NewChatDialog } from '@/components/whatsapp/new-chat-dialog';

export default function WhatsappPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  const handleAddNewChat = (name: string, number: string) => {
    const newLead: Lead = {
      id: `lead-${leads.length + 1}`,
      name: name,
      status: 'New',
      propertyName: 'Unknown',
      source: 'WhatsApp Direct',
      lastContact: 'Just now',
      agentId: 'agent-1', // Assign to a default agent
      budget: 0,
      email: `${name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
      phone: number,
    };
    setLeads(prevLeads => [newLead, ...prevLeads]);
  };

  return (
    <div className="bg-background h-full flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <h1 className="text-xl font-bold text-green-500">WhatsApp</h1>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Search className="h-5 w-5"/></Button>
            <Button variant="ghost" size="icon"><CircleEllipsis className="h-5 w-5"/></Button>
        </div>
      </header>
      <div className="p-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search or start a new chat" className="pl-10" />
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <div className="overflow-y-auto h-full">
          {leads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No chats yet.</p>
              <p className="text-sm">Start a new conversation.</p>
            </div>
          ) : leads.map((lead) => {
            const agent = agents.find(a => a.id === lead.agentId);
            const leadName = lead.name.startsWith('Lead') ? `Lead ${lead.id}` : lead.name;
            return (
              <Link href={`/whatsapp/${lead.id}`} key={lead.id} legacyBehavior>
                <a className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer border-b border-border">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={agent?.avatarUrl} />
                    <AvatarFallback>{leadName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold">{leadName}</p>
                      <p className="text-xs text-muted-foreground">{lead.lastContact}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">Hi, I'm interested in {lead.propertyName}.</p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
       <div className="p-4 flex justify-center">
          <NewChatDialog open={dialogOpen} onOpenChange={setDialogOpen} onAddContact={handleAddNewChat}>
            <Button className="bg-green-500 hover:bg-green-600 shadow-lg" onClick={() => setDialogOpen(true)}>
              Start New Chat
            </Button>
          </NewChatDialog>
        </div>
    </div>
  );
}
