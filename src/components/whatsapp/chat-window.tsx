
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCheck, Send, Bot } from 'lucide-react';
import type { Lead, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Helper component for "blue ticks"
const MessageStatus = ({ status }: { status: Message['status'] }) => {
  const iconProps = { className: "h-5 w-5" };
  if (status === 'sent') return <CheckCheck {...iconProps} color="gray" />;
  if (status === 'delivered') return <CheckCheck {...iconProps} color="gray" />;
  if (status === 'read') return <CheckCheck {...iconProps} color="#34B7F1" />; // Sky Blue
  return <CheckCheck {...iconProps} color="gray" />;
};

interface ChatWindowProps {
  lead: Lead | null;
}

export function ChatWindow({ lead }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const AGENT_ID = 'agent-1'; // Hardcoded agent ID
  const chatRoomId = lead ? [AGENT_ID, lead.id].sort().join('_') : null;

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Real-time listener for messages
  useEffect(() => {
    if (!chatRoomId) return;

    setIsLoading(true);
    const q = query(collection(db, 'chats', chatRoomId, 'messages'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setIsLoading(false);

      // Mark incoming messages as read
      querySnapshot.docs.forEach((document) => {
        const data = document.data();
        if (data.senderId !== AGENT_ID && data.status !== 'read') {
          updateDoc(document.ref, { status: 'read' });
        }
      });
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatRoomId) return;

    const text = inputValue;
    setInputValue('');

    await addDoc(collection(db, 'chats', chatRoomId, 'messages'), {
      text,
      senderId: AGENT_ID,
      status: 'sent',
      timestamp: serverTimestamp(),
    });
  };

  if (!lead) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 space-y-4">
        <div className="p-6 rounded-full bg-zinc-900/50">
            <Bot className="h-12 w-12 text-zinc-700" />
        </div>
        <p className="font-light tracking-widest uppercase text-xs">Select a luxury conversation to begin</p>
      </div>
    );
  }

  const leadName = lead.id === 'bot-assistant' ? lead.name : `Lead ${lead.id.split('-')[1]}`;
  const leadStatus = lead.id === 'bot-assistant' ? 'Online' : 'Active';

  return (
    <div className="h-full flex flex-col bg-black relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gold-leaf.png')] opacity-[0.02] pointer-events-none"></div>

        {/* Header */}
        <header className="relative flex items-center justify-between p-4 border-b border-zinc-800 bg-black/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
             <Avatar className="h-12 w-12 border-2 border-amber-400">
                {lead.id === 'bot-assistant' ? (
                     <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black'>
                        <Bot className="text-amber-500 h-6 w-6" />
                     </div>
                ) : (
                    <AvatarFallback className="bg-zinc-800 text-amber-400 text-lg">
                        {lead.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                )}
            </Avatar>
            <div>
              <h2 className="font-headline text-xl font-bold text-amber-400 tracking-wider">
                  {leadName}
              </h2>
              <p className="text-sm text-green-400">{leadStatus}</p>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 gold-scrollbar">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500"/>
                </div>
            ) : (
                <AnimatePresence initial={false}>
                    {messages.map((message) => {
                        const isSender = message.senderId === AGENT_ID;
                        return (
                            <motion.div
                                key={message.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className={cn('flex flex-col gap-1', isSender ? 'items-end' : 'items-start')}
                            >
                                <div className={cn(
                                    'relative max-w-md lg:max-w-lg rounded-2xl px-4 py-3 shadow-md',
                                    isSender
                                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black rounded-br-none'
                                    : 'bg-zinc-800 text-amber-100 rounded-bl-none'
                                )}>
                                    <p className="text-base break-words">{message.text}</p>
                                </div>
                                {isSender && (
                                    <div className="flex items-center gap-1 pr-1">
                                        <MessageStatus status={message.status} />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800 bg-black/30 backdrop-blur-xl">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="bg-zinc-800/50 border-zinc-700 h-12 text-base text-white placeholder:text-zinc-500 rounded-full focus:ring-amber-500 focus:border-amber-500"
            />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                    type="submit"
                    disabled={!inputValue.trim()}
                    size="icon"
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 text-black shadow-lg transition-all duration-300 enabled:hover:shadow-amber-500/50 enabled:hover:scale-110"
                >
                    <Send className="w-6 h-6"/>
                </Button>
            </motion.div>
          </form>
        </div>
    </div>
  );
}
