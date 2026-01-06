
'use client';

import { useState } from 'react';
import { leads as initialLeads, agents } from '@/lib/data';
import type { Lead } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, CheckCheck, CircleUserRound } from 'lucide-react';
import { ChatWindow } from '@/components/whatsapp/chat-window';
import { cn } from '@/lib/utils';


export default function WhatsappPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads.slice(0, 1));
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);

  const botAssistant: Lead = {
    id: 'bot-assistant',
    name: 'PropCall 360 AI',
    propertyName: 'Various',
    source: 'Bot',
    status: 'New',
    lastContact: 'Online',
    agentId: 'agent-1',
    budget: 0,
    email: '',
    phone: ''
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  return (
    <div className="h-screen w-screen flex bg-black text-white font-body overflow-hidden">
      {/* Left Panel: Chat List */}
      <div className="w-full max-w-xs xl:max-w-sm border-r border-zinc-800 flex flex-col bg-black">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold tracking-tight font-headline text-amber-400">PropCall Chats</h2>
        </div>
        <div className="flex-1 overflow-y-auto gold-scrollbar">
          {/* Bot Assistant */}
          <div
            className={cn(
              'flex items-center gap-4 p-4 cursor-pointer border-b border-zinc-900 transition-colors',
              selectedLead?.id === botAssistant.id ? 'bg-zinc-900' : 'hover:bg-zinc-800/50'
            )}
            onClick={() => handleSelectLead(botAssistant)}
          >
            <Avatar className="h-12 w-12 border-2 border-amber-500">
              <div className='w-full h-full flex items-center justify-center bg-zinc-900'>
                <Bot className="text-amber-500" />
              </div>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-base text-white">{botAssistant.name}</p>
                <p className="text-xs text-amber-400/70">{botAssistant.lastContact}</p>
              </div>
              <p className="text-sm text-zinc-400 truncate">I'm here to help you.</p>
            </div>
          </div>

          {/* Leads */}
          {leads.map((lead) => {
            const agent = agents.find(a => a.id === lead.agentId);
            const leadName = lead.name.startsWith('Lead') ? `Client ${lead.id.split('-')[1]}` : lead.name;
            return (
              <div
                key={lead.id}
                className={cn(
                    'flex items-center gap-4 p-4 cursor-pointer border-b border-zinc-900 transition-colors',
                    selectedLead?.id === lead.id ? 'bg-zinc-900' : 'hover:bg-zinc-800/50'
                  )}
                onClick={() => handleSelectLead(lead)}
              >
                <Avatar className="h-12 w-12 border-2 border-zinc-700">
                  {agent?.avatarUrl ? (
                    <AvatarImage src={agent?.avatarUrl} />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-zinc-800'>
                      <CircleUserRound className="text-zinc-500" />
                    </div>
                  )}
                  <AvatarFallback className="bg-zinc-800 text-amber-400">{leadName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-base text-white">{leadName}</p>
                    <p className="text-xs text-zinc-500">{lead.lastContact}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-zinc-400 truncate">Okay, send the details.</p>
                    <CheckCheck className="h-5 w-5 text-sky-400" />
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
          <ChatWindow key={selectedLead.id} lead={selectedLead} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500 bg-zinc-900/50">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
