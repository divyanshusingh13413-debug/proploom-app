'use client';

import { leads, agents } from '@/lib/data';
import type { Lead } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, MessageSquarePlus, CircleEllipsis } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WhatsappPage() {
  return (
    <div className="bg-background h-full">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <h1 className="text-xl font-bold text-green-500">WhatsApp</h1>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Search className="h-5 w-5"/></Button>
            <Button variant="ghost" size="icon"><CircleEllipsis className="h-5 w-5"/></Button>
        </div>
      </header>
      <div className="p-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search or start a new chat" className="pl-10" />
        </div>
      </div>
      <div className="relative">
        <div className="overflow-y-auto">
          {leads.map((lead) => {
            const agent = agents.find(a => a.id === lead.agentId);
            return (
              <Link href={`/whatsapp/${lead.id}`} key={lead.id} legacyBehavior>
                <a className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer border-b border-border">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={agent?.avatarUrl} />
                    <AvatarFallback>{lead.id.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold">{`Lead ${lead.id}`}</p>
                      <p className="text-xs text-muted-foreground">{lead.lastContact}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">Hi, I'm interested in {lead.propertyName}.</p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
         <div className="absolute bottom-4 right-4">
          <Button className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600 shadow-lg">
            <MessageSquarePlus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
