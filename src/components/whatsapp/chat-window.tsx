
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateWhatsappMessage } from "@/ai/flows/generate-whatsapp-message";
import { Loader2, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Lead } from '@/lib/types';

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  read: boolean;
};

interface ChatWindowProps {
  lead: Lead | null;
}

export function ChatWindow({ lead }: ChatWindowProps) {
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset chat when lead changes
    setMessages([]);
    setInputValue("");
    if (lead?.id === 'bot-assistant') {
        setMessages([{id: 'initial-bot', text: "Hello! How can I help?", sender: 'bot', read: true}]);
    }
  }, [lead]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      read: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate read receipt
    setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === userMessage.id ? {...m, read: true} : m));
    }, 1000);

    setIsGenerating(true);

    try {
      if (!lead) throw new Error("Lead not found");

      const result = await generateWhatsappMessage({
        leadName: lead.name,
        propertyName: lead.propertyName,
        propertyBrochureUrl: "N/A",
        leadSource: 'Live Chat',
      });
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.message,
        sender: "bot",
        read: true,
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Failed to generate message", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not get a response from the bot.",
      });
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
        read: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (!lead) {
    return (
        <div className="flex items-center justify-center h-full text-muted-foreground bg-card">
            <p>Select a chat to start messaging</p>
        </div>
    )
  }

  const leadName = lead.id === 'bot-assistant' ? 'Bot Assistant' : `Client ${lead.id.split('-')[1]}`

  return (
    <div className="h-full flex flex-col bg-card rounded-r-lg border border-border">
        <header className="relative flex h-24 items-center justify-center gap-4 border-b border-border/50 px-4 sm:px-6">
            <h2 className="font-headline text-3xl font-bold text-secondary tracking-widest">
                PROPLOOM CHATS
            </h2>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-5"></div>
        </header>

        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6">
           {messages.map(message => (
             <div key={message.id} className={`flex flex-col gap-2 ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <p className="text-sm text-muted-foreground">{message.sender === 'user' ? 'Me' : leadName}</p>
                <div className={`relative max-w-xs md:max-w-md rounded-xl px-4 py-3 shadow-md ${message.sender === 'user' ? 'bg-background text-foreground rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none'}`}>
                    <p className="text-base">{message.text}</p>
                </div>
                 {message.sender === 'user' && (
                    <div className="flex items-center gap-1">
                        <CheckCheck className={`h-5 w-5 ${message.read ? 'text-blue-400' : 'text-muted-foreground'}`} />
                    </div>
                )}
             </div>
           ))}
           {isGenerating && (
             <div className="flex items-start gap-2">
                <p className="text-sm text-muted-foreground">{leadName}</p>
                <div className="max-w-xs md:max-w-md rounded-xl px-4 py-3 bg-secondary text-secondary-foreground flex items-center shadow-md rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin text-secondary-foreground" />
                </div>
             </div>
           )}
        </div>

        <div className="p-4 border-t border-border/50 bg-card rounded-br-lg">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Yes, please share the brochure." 
              disabled={isGenerating}
              className="bg-input border-border h-12 text-base placeholder:text-muted-foreground rounded-lg"
            />
            <Button 
                type="submit" 
                disabled={!inputValue.trim() || isGenerating} 
                size="icon"
                className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500"></div>
            </Button>
          </form>
        </div>
    </div>
  );
}
