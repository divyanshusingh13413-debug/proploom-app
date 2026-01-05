
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateWhatsappMessage } from "@/ai/flows/generate-whatsapp-message";
import { Send, Loader2, Bot, User, ArrowLeft, Video, Phone, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { leads, agents } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import type { Lead, Agent } from '@/lib/types';

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export default function WhatsappChatPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! How can I help you with your property search today?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentLead = leads.find(l => l.id === id);
    if(currentLead) {
        setLead(currentLead);
        const currentAgent = agents.find(a => a.id === currentLead.agentId);
        if(currentAgent) {
            setAgent(currentAgent);
        }
    }
  }, [id]);

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
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
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
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (!lead) {
    return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    )
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <Avatar>
                <AvatarImage src={agent?.avatarUrl} />
                <AvatarFallback>{lead.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="font-semibold">{lead.name}</p>
                <p className="text-xs text-muted-foreground">online</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Video className="h-5 w-5"/></Button>
                <Button variant="ghost" size="icon"><Phone className="h-5 w-5"/></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5"/></Button>
            </div>
        </header>
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://picsum.photos/seed/bg/800/1200')] bg-cover bg-center">
           {messages.map(message => (
             <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                <div className={`max-w-xs md:max-w-md rounded-xl px-3 py-2 ${message.sender === 'user' ? 'bg-[#005c4b] text-white' : 'bg-card text-card-foreground'}`}>
                    <p className="text-sm">{message.text}</p>
                </div>
             </div>
           ))}
           {isGenerating && (
             <div className="flex items-end gap-2">
                <div className="max-w-xs md:max-w-md rounded-xl px-4 py-2 bg-card flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
             </div>
           )}
        </div>
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..." 
              disabled={isGenerating}
              className="bg-muted border-none"
            />
            <Button type="submit" disabled={!inputValue.trim() || isGenerating} className="bg-green-500 hover:bg-green-600 rounded-full w-12 h-12">
                <Send className="w-5 h-5" />
                <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
    </div>
  );
}
