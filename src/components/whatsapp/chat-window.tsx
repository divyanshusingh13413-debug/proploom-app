
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCheck, Send, Bot, Building } from 'lucide-react';
import type { Lead, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

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

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): void => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), waitFor);
    };
}


export function ChatWindow({ lead }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isClientTyping, setIsClientTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const [userId, setUserId] = useState<string|null>(null);
  
  const AGENT_ID = userId; // Use logged-in user's ID
  const chatRoomId = lead && AGENT_ID ? [AGENT_ID, lead.id].sort().join('_') : null;
  const chatRoomRef = chatRoomId ? doc(db, 'chats', chatRoomId) : null;

  useEffect(() => {
    const uid = sessionStorage.getItem('userId');
    setUserId(uid);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isClientTyping]);

  // Real-time listener for messages and typing status
  useEffect(() => {
    if (!chatRoomId || !chatRoomRef || !lead || !AGENT_ID) return;

    setIsLoading(true);
    const messagesQuery = query(collection(db, 'chats', chatRoomId, 'messages'), orderBy('timestamp', 'asc'));

    const unsubscribeMessages = onSnapshot(messagesQuery, (querySnapshot) => {
      const isFirstLoad = messages.length === 0;
      const newMessages: Message[] = [];
      querySnapshot.forEach(doc => {
        newMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(newMessages);

      if (!isFirstLoad && document.hidden) {
          audioRef.current?.play().catch(e => console.log("Audio play failed", e));
      }

      setIsLoading(false);

      // Mark incoming messages as read
      querySnapshot.docs.forEach((document) => {
        const data = document.data();
        if (data.senderId !== AGENT_ID && data.status !== 'read') {
          updateDoc(document.ref, { status: 'read' });
        }
      });
    });

    const unsubscribeTyping = onSnapshot(chatRoomRef, (doc) => {
        const data = doc.data();
        if (data?.typing && data.typing[lead.id]) {
            setIsClientTyping(true);
        } else {
            setIsClientTyping(false);
        }
    });

    return () => {
        unsubscribeMessages();
        unsubscribeTyping();
    };
  }, [chatRoomId, lead?.id, AGENT_ID]);

  const updateTypingStatus = useCallback(
    debounce(async (isTyping: boolean) => {
        if (chatRoomRef && AGENT_ID) {
            try {
                await setDoc(chatRoomRef, { typing: { [AGENT_ID]: isTyping } }, { merge: true });
            } catch (error) {
                console.error("Error updating typing status:", error);
            }
        }
    }, 500),
    [chatRoomRef, AGENT_ID]
  );

  useEffect(() => {
      if (inputValue) {
          updateTypingStatus(true);
      } else {
          updateTypingStatus(false);
      }
  }, [inputValue, updateTypingStatus]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatRoomId || !AGENT_ID) return;

    const text = inputValue;
    setInputValue('');

    await addDoc(collection(db, 'chats', chatRoomId, 'messages'), {
      text,
      senderId: AGENT_ID,
      status: 'sent',
      timestamp: serverTimestamp(),
    });

    if (chatRoomRef) {
        await setDoc(chatRoomRef, { typing: { [AGENT_ID]: false } }, { merge: true });
    }
  };

  const handleViewProperty = () => {
    if (lead?.propertyName) {
      toast({
        title: "Property of Interest",
        description: `${lead.name} is interested in ${lead.propertyName}.`,
      });
    }
  }

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

  const leadName = lead.id === 'bot-assistant' ? lead.name : `${lead.name}`;
  const leadStatus = lead.id === 'bot-assistant' ? 'Online' : 'Active';

  return (
    <div className="h-full flex flex-col bg-black relative">
        <audio ref={audioRef} src="/ping.mp3" preload="auto"></audio>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gold-leaf.png')] opacity-[0.02] pointer-events-none"></div>

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
          {lead.id !== 'bot-assistant' && (
              <Button variant="outline" size="sm" onClick={handleViewProperty} className="bg-black/20 border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200">
                  <Building className="mr-2 h-4 w-4" />
                  View Property
              </Button>
          )}
        </header>

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
             {isClientTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start"
                >
                    <div className="bg-zinc-800 text-amber-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-md flex items-center gap-2">
                        <span className="typing-dot"></span>
                        <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                        <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                </motion.div>
            )}
        </div>

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
        <style jsx>{`
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
            }
            .typing-dot {
                width: 6px;
                height: 6px;
                background-color: #fcd34d; /* amber-300 */
                border-radius: 50%;
                animation: bounce 1.2s infinite ease-in-out;
            }
        `}</style>
    </div>
  );
}
