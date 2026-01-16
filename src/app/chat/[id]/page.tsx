
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCheck, Send, Bot } from 'lucide-react';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useParams } from 'next/navigation';

const MessageStatus = ({ status }: { status: Message['status'] }) => {
  const iconProps = { className: "h-5 w-5" };
  if (status === 'sent') return <CheckCheck {...iconProps} color="gray" />;
  if (status === 'delivered') return <CheckCheck {...iconProps} color="gray" />;
  if (status === 'read') return <CheckCheck {...iconProps} color="#34B7F1" />;
  return <CheckCheck {...iconProps} color="gray" />;
};

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


export default function ClientChatPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const AGENT_ID = 'agent-1'; // Hardcoded agent ID for now
  const chatRoomId = [AGENT_ID, clientId].sort().join('_');
  const chatRoomRef = doc(db, 'chats', chatRoomId);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAgentTyping]);

  useEffect(() => {
    if (!chatRoomId) return;

    setIsLoading(true);
    const q = query(collection(db, 'chats', chatRoomId, 'messages'), orderBy('timestamp', 'asc'));

    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const isFirstLoad = messages.length === 0;
      const newMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      
      setMessages(newMessages);

      if (!isFirstLoad && document.hidden) {
          audioRef.current?.play().catch(e => console.log("Audio play failed", e));
      }
      
      setIsLoading(false);

      querySnapshot.docs.forEach(async (document) => {
        if (document.data().senderId === AGENT_ID && document.data().status !== 'read') {
          await updateDoc(doc(db, 'chats', chatRoomId, 'messages', document.id), { status: 'read' });
        }
      });
    });

    const unsubscribeTyping = onSnapshot(chatRoomRef, (doc) => {
        const data = doc.data();
        if (data?.typing && data.typing[AGENT_ID]) {
            setIsAgentTyping(true);
        } else {
            setIsAgentTyping(false);
        }
    });

    return () => {
        unsubscribeMessages();
        unsubscribeTyping();
    };
  }, [chatRoomId, clientId]);

  const updateTypingStatus = useCallback(
    debounce(async (isTyping: boolean) => {
        if (chatRoomRef) {
            try {
                await setDoc(chatRoomRef, { typing: { [clientId]: isTyping } }, { merge: true });
            } catch (error) {
                console.error("Error updating typing status:", error);
            }
        }
    }, 500),
    [chatRoomRef, clientId]
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
    if (!inputValue.trim() || !chatRoomId ) return;

    const text = inputValue;
    setInputValue('');

    await addDoc(collection(db, 'chats', chatRoomId, 'messages'), {
      text,
      senderId: clientId,
      status: 'sent',
      timestamp: serverTimestamp(),
    });

    if (chatRoomRef) {
        await setDoc(chatRoomRef, { typing: { [clientId]: false } }, { merge: true });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0a] text-white font-sans overflow-hidden">
        <audio ref={audioRef} src="/ping.mp3" preload="auto"></audio>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gold-leaf.png')] opacity-[0.02] pointer-events-none"></div>

        <header className="relative flex items-center justify-between p-4 border-b border-zinc-800 bg-black/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
             <Avatar className="h-12 w-12 border-2 border-amber-400">
                <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black'>
                    <Bot className="text-amber-500 h-6 w-6" />
                </div>
            </Avatar>
            <div>
              <h2 className="font-headline text-xl font-bold text-amber-400 tracking-wider">
                  PropCall 360 Agent
              </h2>
               <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-sm text-green-400">Online</p>
              </div>
            </div>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 gold-scrollbar">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500"/>
                </div>
            ) : (
                <AnimatePresence initial={false}>
                    {messages.map((message) => {
                        const isSender = message.senderId === clientId;
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
                                    ? 'bg-zinc-800 text-amber-100 rounded-br-none'
                                    : 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black rounded-bl-none'
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
             {isAgentTyping && (
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
