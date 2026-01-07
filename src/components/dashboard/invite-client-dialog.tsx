
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Copy, Send } from 'lucide-react';
import type { Lead } from '@/lib/types';
import { useToast } from '../ui/use-toast';

interface InviteClientDialogProps {
  children: React.ReactNode;
  leads: Lead[];
}

export function InviteClientDialog({ children, leads }: InviteClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const { toast } = useToast();

  const chatUrl = selectedLeadId ? `${window.location.origin}/chat/${selectedLeadId}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(chatUrl);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share the chat link with the client.",
    });
  };

  const handleSendInvite = () => {
    // This is where you would integrate with a service like Twilio to send a WhatsApp message.
    // For now, we will just copy the link and show a notification.
    handleCopy();
    toast({
      title: "Invite Link Ready",
      description: "The chat link has been copied. Please send it to the client via WhatsApp.",
    });
    setOpen(false);
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Client to Chat</DialogTitle>
          <DialogDescription>
            Select a lead to generate a unique and secure chat link for them.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="lead-select">Select a Lead</Label>
            <Select onValueChange={setSelectedLeadId}>
              <SelectTrigger id="lead-select">
                <SelectValue placeholder="Choose a client..." />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {`Lead ${lead.id} (${lead.propertyName})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {chatUrl && (
            <div className="space-y-2">
              <Label htmlFor="chat-link">Generated Chat Link</Label>
              <div className="flex gap-2">
                <Input id="chat-link" value={chatUrl} readOnly />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSendInvite} 
            disabled={!selectedLeadId}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Invite via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
