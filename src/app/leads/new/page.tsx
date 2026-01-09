
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function NewLeadPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [property, setProperty] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement saving logic to Firebase
    console.log('Saving lead:', { name, phone, property });

    // Simulate saving delay
    setTimeout(() => {
      setIsSaving(false);
      // You can use a toast to show success
      router.push('/leads');
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
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
