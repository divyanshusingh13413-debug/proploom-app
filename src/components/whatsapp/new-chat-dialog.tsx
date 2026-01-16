
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, MessageSquarePlus } from 'lucide-react';

interface NewChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddContact: (name: string, phone: string, property: string) => void;
}

export function NewChatDialog({ open, onOpenChange, onAddContact }: NewChatDialogProps) {
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactProperty, setContactProperty] = useState('');

  const handleAddContact = () => {
    if (contactName && contactPhone && contactProperty) {
      onAddContact(contactName, contactPhone, contactProperty);
      onOpenChange(false);
      // Reset fields
      setContactName('');
      setContactPhone('');
      setContactProperty('');
    }
  };

  return (
    <AnimatePresence>
        {open && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full max-w-md m-4 bg-gradient-to-br from-zinc-900 to-black border border-amber-500/20 rounded-2xl shadow-2xl shadow-amber-500/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => onOpenChange(false)}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-amber-400 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="p-3 mb-3 bg-amber-500/10 rounded-full border border-amber-500/20">
                                <MessageSquarePlus className="w-8 h-8 text-amber-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
                                Start a New Conversation
                            </h2>
                            <p className="text-zinc-400 text-sm mt-1">Add a new client to start chatting.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-amber-200/80">Client's Full Name</Label>
                                <Input 
                                    id="name" 
                                    placeholder="e.g. Aarav Sharma" 
                                    className="bg-zinc-800/50 border-zinc-700 h-12 text-base text-white placeholder:text-zinc-500 rounded-xl focus:ring-amber-500 focus:border-amber-500"
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-amber-200/80">Phone Number</Label>
                                <Input 
                                    id="phone" 
                                    placeholder="e.g. +91 98765 43210" 
                                    className="bg-zinc-800/50 border-zinc-700 h-12 text-base text-white placeholder:text-zinc-500 rounded-xl focus:ring-amber-500 focus:border-amber-500"
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="property" className="text-amber-200/80">Property of Interest</Label>
                                <Input 
                                    id="property" 
                                    placeholder="e.g. The Imperial Penthouse" 
                                    className="bg-zinc-800/50 border-zinc-700 h-12 text-base text-white placeholder:text-zinc-500 rounded-xl focus:ring-amber-500 focus:border-amber-500"
                                    value={contactProperty}
                                    onChange={(e) => setContactProperty(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button 
                                onClick={handleAddContact}
                                disabled={!contactName || !contactPhone || !contactProperty}
                                className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg transition-all duration-300 enabled:hover:shadow-amber-500/50 enabled:hover:scale-105"
                            >
                                Start Chat
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}
