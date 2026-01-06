'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, type PropsWithChildren } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NewChatDialogProps extends PropsWithChildren {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewChatDialog({ children, open, onOpenChange }: NewChatDialogProps) {
  const { toast } = useToast();
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleAddContact = () => {
    if (contactName && contactNumber) {
      console.log('Adding contact:', { name: contactName, number: contactNumber });
      // Here you would typically add the logic to create a new chat
      toast({
        title: "Contact Added",
        description: `New chat started with ${contactName}.`,
      });
      onOpenChange(false);
      setContactName('');
      setContactNumber('');
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please fill in both name and number.",
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start New Chat</DialogTitle>
          <DialogDescription>
            Enter the name and WhatsApp number to start a new conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
                id="name" 
                placeholder="e.g. John Doe" 
                className="col-span-3"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="number" className="text-right">
              Number
            </Label>
            <Input 
                id="number" 
                placeholder="e.g. +91 12345 67890" 
                className="col-span-3"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddContact}>Add Contact</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
