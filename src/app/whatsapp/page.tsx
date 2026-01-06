
'use client';

import { useState } from 'react';
import { leads as initialLeads, agents } from '@/lib/data';
import type { Lead, Agent } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, CheckCheck } from 'lucide-react';
import { ChatWindow } from '@/components/whatsapp/chat-window';


export default function WhatsappPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads.slice(0,1));
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);

  const botAssistant = {
    id: 'bot-assistant',
    name: 'Bot Assistant',
    avatarUrl: '',
    lastMessage: 'Hello! How can I help?',
    lastContact: 'Online'
  }
  
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  return (
    <div className="h-screen w-screen flex bg-background text-foreground font-body">
      {/* Left Panel: Chat List */}
      <div className="w-full max-w-xs xl:max-w-sm border-r border-border flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-bold tracking-tight font-headline text-secondary">Chat List</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Bot Assistant */}
             <div 
                className={`flex items-center gap-4 p-4 cursor-pointer border-b border-border/50 ${selectedLead?.id === botAssistant.id ? 'bg-card' : 'hover:bg-muted/50'}`}
                onClick={() => handleSelectLead({ id: 'bot-assistant', name: 'Bot Assistant', propertyName: 'Various', source: 'Bot', status: 'New', lastContact: 'Online', agentId: 'agent-1', budget:0, email: '', phone: '' })}
              >
                  <Avatar className="h-12 w-12 border-2 border-secondary">
                    <div className='w-full h-full flex items-center justify-center bg-background'>
                      <Bot className="text-secondary" />
                    </div>
                  </Avatar>
                  <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-base">{botAssistant.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{botAssistant.lastMessage}</p>
                  </div>
              </div>

            {/* Leads */}
            {leads.map((lead) => {
              const agent = agents.find(a => a.id === lead.agentId);
              const leadName = lead.name.startsWith('Lead') ? `Client ${lead.id.split('-')[1]}` : lead.name;
              return (
                <div 
                  key={lead.id} 
                  className={`flex items-center gap-4 p-4 cursor-pointer border-b border-border/50 ${selectedLead?.id === lead.id ? 'bg-card' : 'hover:bg-muted/50'}`}
                  onClick={() => handleSelectLead(lead)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={agent?.avatarUrl} />
                    <AvatarFallback>{leadName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-base">{leadName}</p>
                        <p className="text-xs text-muted-foreground">{lead.lastContact}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground truncate">Okay, send the details.</p>
                        <CheckCheck className="h-5 w-5 text-blue-400" />
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>

      {/* Right Panel: Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedLead ? (
          <ChatWindow lead={selectedLead} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
