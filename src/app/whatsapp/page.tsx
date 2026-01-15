
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, where } from 'firebase/firestore';
import type { Lead, User } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, CheckCheck, Plus, Search, Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Bot Assistant Constant
  const botAssistant: Lead = {
    id: 'bot-assistant',
    name: 'PropCall 360 AI',
    propertyName: 'Assistant',
    source: 'System',
    status: 'New',
    lastContact: 'Now',
    agentId: 'bot',
    budget: 0,
    email: 'ai@proploom.com',
    phone: 'AI-BOT'
  };

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    const uid = sessionStorage.getItem('userId');
    setUserRole(role);
    setUserId(uid);
    
    if (!selectedLead) setSelectedLead(botAssistant);
  }, []);

  // Real-time listener for leads based on role
  useEffect(() => {
    if (!userRole) return;
    
    setIsLoading(true);

    let leadsQuery;
    if (userRole === 'agent' && userId) {
      leadsQuery = query(collection(db, 'leads'), where('assignedAgentId', '==', userId));
    } else { // Admin gets all leads
      leadsQuery = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
    }

    const unsubscribe = onSnapshot(leadsQuery, (querySnapshot) => {
      const leadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      setLeads(leadsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching leads:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Failed to load chats",
        description: "Could not retrieve lead data."
      });
    });

    return () => unsubscribe();
  }, [userRole, userId, toast]);


  const handleCreateLead = async (name: string, phone: string, property: string) => {
    try {
        const newLead: Omit<Lead, 'id' | 'lastContact' | 'aiScore'> = {
            name,
            phone,
            propertyName: property,
            source: 'WhatsApp',
            status: 'New',
            agentId: userRole === 'agent' && userId ? userId : 'unassigned', // Assign to self if agent
            assignedAgentId: userRole === 'agent' && userId ? userId : undefined,
            assignedAgentName: userRole === 'agent' ? sessionStorage.getItem('displayName') || undefined : undefined,
            budget: 0,
            email: `${name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
            timestamp: serverTimestamp(),
        };
      const docRef = await addDoc(collection(db, 'leads'), newLead);

      const createdLead = { 
        id: docRef.id, 
        ...newLead, 
        lastContact: new Date().toLocaleDateString(),
        timestamp: undefined // temp placeholder
      } as Lead;

      // Immediately set the new lead as selected
      setSelectedLead(createdLead);
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
      
      <div className="w-full max-w-xs xl:max-w-md border-r border-zinc-800/50 flex flex-col bg-black/40 backdrop-blur-xl relative">
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
              PropCall Chats
            </h2>
          </div>
          
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

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
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

          {isLoading ? (
             <div className="flex justify-center items-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary"/>
             </div>
          ) : (
            <AnimatePresence>
                {filteredLeads.map((lead, index) => {
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
                        <AvatarFallback className="bg-zinc-800 text-amber-500 font-bold">
                        {lead.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                        <p className="font-medium text-zinc-200 truncate">{lead.name}</p>
                        <p className="text-[10px] text-zinc-500">{lead.timestamp ? new Date(lead.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-zinc-500 truncate">{lead.propertyName}</p>
                        <CheckCheck className={cn("h-4 w-4", isSelected ? "text-sky-400" : "text-zinc-600")} />
                        </div>
                    </div>
                    </motion.div>
                );
                })}
            </AnimatePresence>
          )}
        </div>

        <div className="absolute bottom-16 right-8">
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

      <NewChatDialog 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddContact={handleCreateLead}
      />


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

    