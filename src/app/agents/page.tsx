
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, Trash2, Loader2, Users2, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { createUser } from '@/ai/flows/create-user';
import { deleteUser } from '@/ai/flows/delete-user';

function generateTemporaryPassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export default function ManageAgentsPage() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'agent'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const agentsData: User[] = [];
      querySnapshot.forEach((doc) => {
        agentsData.push({ uid: doc.id, ...doc.data() } as User);
      });
      setAgents(agentsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching agents:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Failed to load agents",
        description: "Please check your connection and try again.",
      });
    });

    return () => unsubscribe();
  }, [toast]);

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentEmail) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both name and email.",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Generate a temporary password for the new user.
      // They will be forced to change it on first login.
      const tempPassword = generateTemporaryPassword();

      await createUser({
        email: newAgentEmail,
        password: tempPassword,
        displayName: newAgentName,
        role: 'agent',
      });

      toast({
        title: "Agent Added: " + newAgentName,
        description: (
          <div>
            <p>The agent can now log in using this temporary password. They will be prompted to create a new one.</p>
            <p className="font-mono bg-muted p-2 rounded-md mt-2 text-center">{tempPassword}</p>
          </div>
        ),
        duration: 15000,
      });

      setNewAgentName('');
      setNewAgentEmail('');

    } catch (error: any) {
      console.error("Error adding agent:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not add the agent. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAgent = async (agentId: string, agentName: string) => {
    if (!confirm(`Are you sure you want to delete ${agentName}? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteUser({ uid: agentId });
      toast({
        title: "Agent Deleted",
        description: `${agentName} has been permanently removed from the system.`,
      });
    } catch (error: any) {
      console.error("Error deleting agent:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.message || `Could not delete ${agentName}. Please try again.`,
      });
    }
  };

  return (
    <div className="w-full space-y-8">
      
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Manage Agents
        </h1>
        <p className="text-muted-foreground">
          Add, view, and remove agents from your team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Agent Form */}
        <div className="lg:col-span-1">
          <Card className="bg-background/80 backdrop-blur-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <UserPlus className="h-6 w-6 text-primary"/>
                <CardTitle className="text-xl font-bold tracking-tight">Add New Agent</CardTitle>
              </div>
              <CardDescription>Enter details to create an agent profile and login.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAgent} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Ananya Sharma"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Agent Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., ananya@proploom.com"
                    value={newAgentEmail}
                    onChange={(e) => setNewAgentEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    {isSaving ? 'Adding...' : 'Add Agent'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Agent List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users2 className="h-6 w-6 text-primary"/>
                <CardTitle className="text-xl font-bold tracking-tight">Current Agents</CardTitle>
              </div>
              <CardDescription>A list of all agents in your system.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : agents.length > 0 ? (
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.uid} className="flex items-center justify-between p-4 bg-card-foreground/5 rounded-xl border border-border/50">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                            {agent.displayName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{agent.displayName}</p>
                          <p className="text-sm text-muted-foreground">{agent.email}</p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteAgent(agent.uid, agent.displayName || 'Agent')}
                        className="h-9 w-9"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-16 border-2 border-dashed rounded-lg">
                  <Users2 className="h-12 w-12 mb-4 text-muted-foreground/50"/>
                  <p className="font-medium">No Agents Found</p>
                  <p className="text-sm">Use the form on the left to add your first agent.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
