
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useToast } from '@/components/ui/use-toast';
import type { Lead } from '@/lib/types';

export default function NewLeadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [property, setProperty] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !property) return;
    
    setIsSaving(true);
    
    try {
      const newLead: Omit<Lead, 'id' | 'lastContact' | 'aiScore'> = {
        name,
        phone,
        propertyName: property,
        source: 'Manual',
        status: 'New',
        agentId: 'agent-1', // Default or assign dynamically
        budget: 0,
        email: `${name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, 'leads'), newLead);
      
      toast({
        title: "Lead Saved",
        description: `${name} has been added to your leads.`,
      });
      router.push('/leads');

    } catch (error) {
      console.error("Error saving lead:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not save the lead. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/leads" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </Link>
      </div>

      <Card className="bg-background/80 backdrop-blur-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
             <UserPlus className="h-6 w-6 text-primary"/>
             <CardTitle className="text-2xl font-bold tracking-tight">Add a New Lead</CardTitle>
          </div>
          <CardDescription>Enter the details below to create a new lead in your system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveLead} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Client Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Ananya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-12 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property" className="text-base">Property of Interest / Location</Label>
              <Input
                id="property"
                type="text"
                placeholder="e.g., The Imperial, Mumbai"
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                required
                className="h-12 text-lg"
              />
            </div>
            <div className="pt-4 flex justify-end">
              <Button type="submit" size="lg" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Lead'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
