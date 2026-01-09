
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/config'; // Firebase config import
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { agents } from '@/lib/data';
import type { Lead } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, CheckCheck, Plus, Search } from 'lucide-react';
import { ChatWindow } from '@/components/whatsapp/chat-window';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { NewChatDialog } from '@/components/whatsapp/new-chat-dialog';
import { useToast } from '@/hooks/use-toast';


export default function WhatsappPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bot Assistant Constant
  const botAssistant: Lead = {
    id: 'bot-assistant',
    name: 'PropCall 360 AI',
    propertyName: 'Assistant',
    source: 'System',
    status: 'New', // Changed from 'Online' to a valid status
    lastContact: 'Now',
    agentId: 'bot',
    budget: 0,
    email: 'ai@proploom.com',
    phone: 'AI-BOT'
  };

  // Real-time listener for leads
  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('lastContact', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      setLeads(leadsData);
    });

    return () => unsubscribe();
  }, []);

  // Default selection
  useEffect(() => {
    if (!selectedLead) setSelectedLead(botAssistant);
  }, []);

  const handleCreateLead = async (name: string, phone: string, property: string) => {
    try {
        const newLead: Omit<Lead, 'id'> = {
            name,
            phone,
            propertyName: property,
            source: 'Manual Entry',
            status: 'New',
            lastContact: new Date().toLocaleDateString(), // simplified
            agentId: 'agent-1', // Default or assign dynamically
            budget: 0,
            email: `${name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
        };
      const docRef = await addDoc(collection(db, 'leads'), {
        ...newLead,
        timestamp: serverTimestamp() 
      });

      // Immediately set the new lead as selected
      setSelectedLead({ id: docRef.id, ...newLead });
      toast({
        title: "Chat Created",
        description: `Conversation with ${name} has been started.`,
      });
    } catch (error) {
        console.error("Error creating new lead: ", error);
        toast({
            variant: "destructive",
            title: "Creation Failed",
            description: "Could not create the new chat. Please try again.",
        });
    }
  };


  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex bg-[#0a0a0a] text-white font-sans overflow-hidden">
      
      {/* LEFT PANEL: CHAT LIST */}
      <div className="w-full max-w-xs xl:max-w-md border-r border-zinc-800/50 flex flex-col bg-black/40 backdrop-blur-xl relative">
        
        {/* Header */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
              PropCall Chats
            </h2>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search clients..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* 1. Bot AI Item */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              'flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4',
              selectedLead?.id === botAssistant.id 
                ? 'bg-zinc-900/80 border-amber-500' 
                : 'hover:bg-zinc-900/40 border-transparent'
            )}
            onClick={() => setSelectedLead(botAssistant)}
          >
            <div className="relative">
              <Avatar className="h-12 w-12 border border-amber-500/30">
                <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black'>
                  <Bot className="text-amber-500 h-6 w-6" />
                </div>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full shadow-glow"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-zinc-100">PropCall 360 AI</p>
                <p className="text-[10px] text-amber-500 font-medium">ONLINE</p>
              </div>
              <p className="text-sm text-zinc-500 truncate italic">How can I assist your property search?</p>
            </div>
          </motion.div>

          {/* 2. Real Leads List */}
          <AnimatePresence>
            {filteredLeads.map((lead, index) => {
              const agent = agents.find(a => a.id === lead.agentId);
              const isSelected = selectedLead?.id === lead.id;

              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4',
                    isSelected ? 'bg-zinc-900/80 border-amber-500' : 'hover:bg-zinc-900/40 border-transparent'
                  )}
                  onClick={() => setSelectedLead(lead)}
                >
                  <Avatar className="h-12 w-12 border border-zinc-800">
                    <AvatarImage src={agent?.avatarUrl} />
                    <AvatarFallback className="bg-zinc-800 text-amber-500 font-bold">
                      {lead.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-zinc-200 truncate">{`Lead ${lead.id}`}</p>
                      <p className="text-[10px] text-zinc-500">{lead.lastContact}</p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-zinc-500 truncate">Property: {lead.propertyName}</p>
                      <CheckCheck className={cn("h-4 w-4", isSelected ? "text-sky-400" : "text-zinc-600")} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-12 right-8">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsModalOpen(true)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 text-black flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-amber-500/50"
                style={{ animation: 'pulse-gold 2s infinite' }}
                aria-label="Start new chat"
            >
                <Plus className="w-6 h-6" />
            </motion.button>
        </div>
      </div>

      {/* RIGHT PANEL: CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-[#050505] relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {selectedLead ? (
          <ChatWindow key={selectedLead.id} lead={selectedLead} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 space-y-4">
            <div className="p-6 rounded-full bg-zinc-900/50">
              <Bot className="h-12 w-12 text-zinc-700" />
            </div>
            <p className="font-light tracking-widest uppercase text-xs">Select a luxury conversation to begin</p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatDialog 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddContact={handleCreateLead}
      />


      {/* Style for scrollbar and pulse animation */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #fbbf24; }
        .shadow-glow { box-shadow: 0 0 10px rgba(34, 197, 94, 0.5); }
        @keyframes pulse-gold {
            0% { box-shadow: 0 0 0 0 hsl(var(--secondary) / 0.7); }
            70% { box-shadow: 0 0 0 10px hsl(var(--secondary) / 0); }
            100% { box-shadow: 0 0 0 0 hsl(var(--secondary) / 0); }
        }
      `}</style>

    </div>
  );
}
