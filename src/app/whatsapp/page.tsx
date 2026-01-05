
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateWhatsappMessage } from "@/ai/flows/generate-whatsapp-message";
import { Send, Loader2, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { properties } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export default function WhatsappPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your real estate assistant. Who am I speaking with today?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [leadName, setLeadName] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
      let currentLeadName = leadName;
      if (!currentLeadName) {
        setLeadName(inputValue);
        currentLeadName = inputValue;
      }
      
      const result = await generateWhatsappMessage({
        leadName: currentLeadName,
        propertyName: "any available property",
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
  
  return (
    <div className="container mx-auto max-w-2xl h-[calc(100vh-120px)] flex flex-col">
        <Card className="flex-1 flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
                <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/bot/100/100" data-ai-hint="bot logo"/>
                    <AvatarFallback>BOT</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>WhatsApp Bot</CardTitle>
                    <CardDescription>
                      AI-powered live chat
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6">
               {messages.map(message => (
                 <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                    {message.sender === 'bot' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                        </Avatar>
                    )}
                    <div className={`max-w-xs md:max-w-md rounded-xl px-4 py-2 ${message.sender === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <p className="text-sm">{message.text}</p>
                    </div>
                     {message.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><User className="w-5 h-5"/></AvatarFallback>
                        </Avatar>
                    )}
                 </div>
               ))}
               {isGenerating && (
                 <div className="flex items-end gap-2">
                    <Avatar className="h-8 w-8">
                       <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs md:max-w-md rounded-xl px-4 py-2 bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                 </div>
               )}
            </CardContent>
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..." 
                  disabled={isGenerating}
                />
                <Button type="submit" disabled={!inputValue.trim() || isGenerating}>
                    <Send className="w-5 h-5" />
                    <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
        </Card>
    </div>
  );
}
