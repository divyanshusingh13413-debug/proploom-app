
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
import { MoreHorizontal, ChevronRight, UserPlus, FileText, Activity, MessageSquare, Plus, Loader2 } from 'lucide-react';
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

const LeadJourney = ({ lead }: { lead: Lead | null }) => {
    if (!lead) return null;

    const handleWhatsAppRedirect = () => {
      if (!lead) return;
      const message = `Hi ${lead.name}, I am calling from Proploom. Are you still interested in the property?`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Lead Journey & Activity</CardTitle>
                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6">
                <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                        <AvatarFallback>{lead.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                </div>
                <div className="flex-1 space-y-3">
                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Activity className="w-4 h-4 text-primary" />
                        <span><span className="font-semibold text-foreground">2h ago:</span> Call reminder</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4 text-primary" />
                        <span><span className="font-semibold text-foreground">Yesterday:</span> WhatsApp Brochure sent</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span><span className="font-semibold text-foreground">5 days:</span> Captured from WhatsApp</span>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 self-start">
                    <Button variant="outline">Log Activity</Button>
                    <Button onClick={handleWhatsAppRedirect} className="bg-secondary hover:bg-secondary/90">WhatsApp</Button>
                </div>
            </CardContent>
             <div className="p-6 pt-0 text-right">
                <Button onClick={handleWhatsAppRedirect} variant="link" className="text-primary">Share on WhatsApp <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
        </Card>
    )
}

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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
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
      if (leadsData.length > 0 && !selectedLead) {
        setSelectedLead(leadsData[0]);
      }
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
  }, [selectedLead]);
  
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

  const handleWhatsAppChat = (e: React.MouseEvent, phone: string, name: string) => {
    e.stopPropagation(); // Prevent row click
    const message = `Hi ${name}, I am calling from Proploom. Are you still interested in the property?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight font-headline">
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
      
      <Tabs defaultValue="all">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Lead List & Smart Filters</CardTitle>
                     {userRole === 'admin' && (
                        <div className="flex items-center gap-2">
                            <TabsList>
                                <TabsTrigger value="all">All Leads</TabsTrigger>
                                <TabsTrigger value="my">My Leads</TabsTrigger>
                            </TabsList>
                            <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                        </div>
                     )}
                </div>
            </CardHeader>
            <CardContent>
                <TabsContent value="all">
                  {isLoading ? (
                    <LeadsTableSkeleton />
                  ) : leads.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No leads found.</p>
                       {userRole === 'agent' ?
                         <p className="text-sm">Contact your admin to get leads assigned.</p>
                       : <Link href="/leads/new" className='mt-4 inline-block'>
                           <Button variant="outline">Add Your First Lead</Button>
                         </Link>
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
                            <TableRow key={lead.id} className="transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
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
                </TabsContent>
                <TabsContent value="my">
                    <div className="text-center py-12 text-muted-foreground">My leads will be shown here.</div>
                </TabsContent>
            </CardContent>
        </Card>
      </Tabs>
      
      <LeadJourney lead={selectedLead} />
    </div>
  );
}

    