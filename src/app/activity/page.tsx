
'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import type { Lead, User, ActivityLog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, History } from 'lucide-react';
import { format } from 'date-fns';

type EnrichedActivityLog = ActivityLog & {
  leadName: string;
  leadId: string;
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<EnrichedActivityLog[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('all');

  useEffect(() => {
    // Fetch all leads
    const leadsQuery = query(collection(db, 'leads'));
    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      const allActivities: EnrichedActivityLog[] = [];
      snapshot.forEach(doc => {
        const lead = doc.data() as Lead;
        if (lead.activityLog && Array.isArray(lead.activityLog)) {
          lead.activityLog.forEach(log => {
            allActivities.push({
              ...log,
              leadName: lead.name,
              leadId: doc.id,
            });
          });
        }
      });
      // Sort activities by timestamp descending
      allActivities.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
      setActivities(allActivities);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching leads for activity log:", error);
        setIsLoading(false);
    });

    // Fetch all agents
    const agentsQuery = query(collection(db, 'users'), where('roles', 'array-contains', 'agent'));
    const unsubscribeAgents = onSnapshot(agentsQuery, (snapshot) => {
        const agentsData: User[] = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
        setAgents(agentsData);
    });

    return () => {
        unsubscribeLeads();
        unsubscribeAgents();
    };
  }, []);

  const filteredActivities = useMemo(() => {
    if (selectedAgentId === 'all') {
      return activities;
    }
    return activities.filter(activity => activity.agentId === selectedAgentId);
  }, [activities, selectedAgentId]);
  
  const getAgentInitials = (agentName: string) => {
     return agentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Agent Activity Timeline
            </h1>
            <p className="text-muted-foreground">
            A real-time log of all agent interactions.
            </p>
        </div>
        <div className="w-full max-w-sm">
            <Select onValueChange={setSelectedAgentId} defaultValue="all">
                <SelectTrigger>
                    <SelectValue placeholder="Filter by agent..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    {agents.map(agent => (
                        <SelectItem key={agent.uid} value={agent.uid}>
                            {agent.displayName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-6">
                {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
              
              <div className="space-y-10">
                {filteredActivities.map((activity, index) => (
                  <div key={index} className="relative flex items-start gap-6">
                    {/* Dot and Icon */}
                    <div className="z-10 flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-card border flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center shadow-inner">
                            <MessageSquare className="h-5 w-5 text-green-400" />
                        </div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-grow pt-2">
                       <p className="font-medium text-foreground">
                          <span className="font-bold text-primary">{activity.agentName || 'Unknown Agent'}</span>
                          {' '}sent a WhatsApp to{' '}
                          <span className="font-bold">{activity.leadName}</span>
                       </p>
                       <p className="text-sm text-muted-foreground mt-1">
                          {format(activity.timestamp.toDate(), "MMMM d, yyyy 'at' h:mm a")}
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-16 border-2 border-dashed rounded-lg">
                <History className="h-12 w-12 mb-4 text-muted-foreground/50"/>
                <p className="font-medium">No Activity Logged Yet</p>
                <p className="text-sm mt-2">Agent interactions will appear here once they are logged.</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
