
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot, query, where, Timestamp, doc, updateDoc } from 'firebase/firestore';
import type { Lead, User } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ChevronRight, UserPlus, FileText, Activity, MessageSquare, Plus, Loader2, Users2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

const statusStyles: Record<string, string> = {
  New: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
  'Follow-up Due': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
  'Meeting Today': 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
  Contacted: 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30',
  Closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30',
};

const StatsCard = ({ title, value, subtitle, color, icon: Icon, isLoading }: { title: string, value: string, subtitle: string, color: string, icon: React.ElementType, isLoading?: boolean }) => (
    <Card className={`bg-gradient-to-br ${color} text-white`}>
        <CardHeader>
            <CardDescription className="text-white/80">{title}</CardDescription>
            <CardTitle className="text-4xl font-bold flex justify-between items-center">
                {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : value}
                <Icon className="w-8 h-8 opacity-50" />
            </CardTitle>
            <p className="text-xs text-white/70">{subtitle}</p>
        </CardHeader>
    </Card>
);

const LeadsTableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Date Added</TableHead>
          <TableHead colSpan={2}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
);


export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    const uid = sessionStorage.getItem('userId');
    setUserRole(role);
    setUserId(uid);

    setIsLoading(true);

    let leadsQuery;
    if (role === 'agent' && uid) {
      leadsQuery = query(collection(db, 'leads'), where('assignedAgentId', '==', uid));
    } else {
      leadsQuery = query(collection(db, 'leads'));
    }

    const unsubscribeLeads = onSnapshot(leadsQuery, (querySnapshot) => {
      const leadsData: Lead[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leadsData.push({ 
          id: doc.id,
           ...data,
          timestamp: data.timestamp,
        } as Lead);
      });
      setLeads(leadsData);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching leads:", error);
        setIsLoading(false);
    });

    // Fetch agents only if user is admin
    let unsubscribeAgents = () => {};
    if (role === 'admin') {
      const agentsQuery = query(collection(db, 'users'), where('role', '==', 'agent'));
      unsubscribeAgents = onSnapshot(agentsQuery, (querySnapshot) => {
        const agentsData: User[] = [];
        querySnapshot.forEach((doc) => {
          agentsData.push({ uid: doc.id, ...doc.data() } as User);
        });
        setAgents(agentsData);
      });
    }

    return () => {
      unsubscribeLeads();
      unsubscribeAgents();
    };
  }, []);
  
  const handleAssignAgent = async (leadId: string, agentId: string) => {
    const agent = agents.find(a => a.uid === agentId);
    if (!agent) return;

    const leadRef = doc(db, 'leads', leadId);
    try {
      await updateDoc(leadRef, {
        assignedAgentId: agent.uid,
        assignedAgentName: agent.displayName
      });
      toast({
        title: "Lead Assigned",
        description: `Lead has been assigned to ${agent.displayName}.`
      });
    } catch (error) {
      console.error("Error assigning agent:", error);
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: "Could not assign the lead. Please try again."
      });
    }
  };

  const getLeadsTodayCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return leads.filter(lead => {
        if (lead.timestamp) {
            const leadDate = lead.timestamp.toDate();
            return leadDate >= today;
        }
        return false;
    }).length;
  };

  const handleWhatsAppChat = (e: React.MouseEvent, phone: string, name?: string) => {
    e.stopPropagation(); // Prevent row click
    const message = name
      ? `Hi ${name}, this is from Proploom regarding your interest in our properties. When would be a good time to connect?`
      : 'Hello, I am interested in your property listing.';
    const encodedMessage = encodeURIComponent(message);
    const cleanedPhone = phone.replace(/[\s+-]/g, '');
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Leads Management
        </h1>
        <Link href="/leads/new">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Lead
            </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="NEW LEADS TODAY" value={getLeadsTodayCount().toString()} subtitle="from all channels" color="from-primary to-blue-700" icon={UserPlus} isLoading={isLoading} />
        <StatsCard title={userRole === 'admin' ? "TOTAL ACTIVE LEADS" : "MY ACTIVE LEADS"} value={leads.length.toString()} subtitle="Follow-ups pending" color="from-accent to-yellow-600" icon={UserPlus} isLoading={isLoading} />
        <StatsCard title="PRIORITY HOT LEADS" value={leads.filter(l => l.status === 'Follow-up Due').length.toString()} subtitle="Requires immediate attention" color="from-secondary to-green-700" icon={UserPlus} isLoading={isLoading}/>
      </div>
      
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Lead List & Smart Filters</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                  {isLoading ? (
                    <LeadsTableSkeleton />
                  ) : leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-16 border-2 border-dashed rounded-lg">
                        <Users2 className="h-12 w-12 mb-4 text-muted-foreground/50"/>
                        <p className="font-medium">No Leads Found</p>
                        {userRole === 'agent' ?
                           <p className="text-sm mt-2">Contact your admin to get leads assigned.</p>
                         :
                         <>
                            <p className="text-sm mt-2 mb-4">Add your first lead to get started.</p>
                            <Link href="/leads/new">
                                <Button variant="default">
                                    <Plus className="mr-2 h-4 w-4" /> Add Lead
                                </Button>
                            </Link>
                         </>
                       }
                    </div>
                  ) : (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead colSpan={2} className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id} className="transition-colors hover:bg-muted/50 cursor-pointer">
                                <TableCell className="font-medium">{lead.name}</TableCell>
                                <TableCell>{lead.source}</TableCell>
                                <TableCell>
                                    <Badge className={statusStyles[lead.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                                        {lead.status}
                                    </Badge>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    {userRole === 'admin' ? (
                                        <Select
                                            value={lead.assignedAgentId || ''}
                                            onValueChange={(agentId) => handleAssignAgent(lead.id, agentId)}
                                        >
                                            <SelectTrigger className="w-[180px] h-9 text-xs">
                                                <SelectValue placeholder="Unassigned" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unassigned" disabled>Unassigned</SelectItem>
                                                {agents.map((agent) => (
                                                    <SelectItem key={agent.uid} value={agent.uid}>
                                                        {agent.displayName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        lead.assignedAgentName || 'Unassigned'
                                    )}
                                </TableCell>
                                <TableCell>{lead.timestamp ? lead.timestamp.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => handleWhatsAppChat(e, lead.phone, lead.name)}
                                    className="text-green-500 hover:bg-green-500/10 hover:text-green-400 h-8 w-8"
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                  )}
            </CardContent>
        </Card>
    </div>
  );
}
