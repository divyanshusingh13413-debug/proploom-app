
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot, query, where, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Lead, User } from '@/lib/types';
import * as XLSX from 'xlsx';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, UserPlus, MessageSquare, Plus, Loader2, Users2, Trash2, FileSpreadsheet } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { BulkImportLeads } from '@/components/BulkImport';
import { useRole } from '@/context/RoleContext';

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
          <TableHead className="text-right">Actions</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
);


export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { viewAsRole, displayName } = useRole();
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const uid = sessionStorage.getItem('userId');
    setUserId(uid);
  }, []);

  useEffect(() => {
    if (!viewAsRole) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);

    let leadsQuery;
    if (viewAsRole === 'agent' && userId) {
      leadsQuery = query(collection(db, 'leads'), where('assignedAgentId', '==', userId));
    } else if (viewAsRole === 'admin') {
      leadsQuery = query(collection(db, 'leads'));
    } else {
        setLeads([]);
        setIsLoading(false);
        return;
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

    let unsubscribeAgents = () => {};
    if (viewAsRole === 'admin') {
      const agentsQuery = query(collection(db, 'users'), where('roles', 'array-contains', 'agent'));
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
  }, [viewAsRole, userId]);
  
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

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (!confirm(`Are you sure you want to delete the lead for ${leadName}? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      toast({
        title: "Lead Deleted",
        description: `${leadName} has been removed from your leads.`,
      });
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: `Could not delete ${leadName}. Please try again.`,
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

  const openWhatsApp = (e: React.MouseEvent, phone: string, name: string | undefined, propertyName: string | undefined) => {
    e.stopPropagation();

    const agentName = displayName || 'Espace Real Estate';
    const propertyRef = propertyName || 'your property inquiry';

    let cleaned = phone.replace(/\D/g, ''); // Sirf numbers rakho

    // Smart Dubai Formatting
    if (cleaned.startsWith('0')) {
        cleaned = '971' + cleaned.substring(1);
    } else if (cleaned.length === 9 && !cleaned.startsWith('971')) {
        cleaned = '971' + cleaned;
    }
    
    const message = encodeURIComponent(`Hi ${name}, this is ${agentName} from Espace Real Estate. I saw your inquiry about ${propertyRef}. How can I help?`);
    window.open(`https://wa.me/${cleaned}?text=${message}`, '_blank');
  };

  const handleExport = () => {
    if (leads.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Leads to Export',
        description: 'There is no data available to export.',
      });
      return;
    }

    toast({
      title: 'Exporting Leads',
      description: 'Your Excel file is being generated...',
    });

    const dataToExport = leads.map(lead => ({
      'Name': lead.name,
      'Phone': lead.phone,
      'Email': lead.email || '',
      'Property': lead.propertyName,
      'Budget': lead.budget || 0,
      'Lead Status': lead.status,
      'Date Added': lead.timestamp ? lead.timestamp.toDate().toLocaleDateString() : 'N/A',
      'Assigned To': lead.assignedAgentName || 'Unassigned',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    XLSX.writeFile(workbook, 'PropCall_Leads_Export.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Leads Management
        </h1>
        <div className="flex items-center gap-2">
            <BulkImportLeads />
            <Button
              variant="outline"
              onClick={handleExport}
              className="text-amber-500 border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Link href="/leads/new">
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New Lead
                </Button>
            </Link>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="NEW LEADS TODAY" value={getLeadsTodayCount().toString()} subtitle="from all channels" color="from-primary to-blue-700" icon={UserPlus} isLoading={isLoading} />
        <StatsCard title={viewAsRole === 'admin' ? "TOTAL ACTIVE LEADS" : "MY ACTIVE LEADS"} value={leads.length.toString()} subtitle="Follow-ups pending" color="from-accent to-yellow-600" icon={UserPlus} isLoading={isLoading} />
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
                        {viewAsRole === 'agent' ?
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
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id} className="transition-colors hover:bg-muted/50">
                                <TableCell className="font-medium">{lead.name}</TableCell>
                                <TableCell>{lead.source}</TableCell>
                                <TableCell>
                                    <Badge className={statusStyles[lead.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                                        {lead.status}
                                    </Badge>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    {viewAsRole === 'admin' ? (
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
                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => openWhatsApp(e, lead.phone, lead.name, lead.propertyName)}
                                      className="text-green-500 hover:bg-green-500/10 hover:text-green-400 h-8 w-8"
                                      title="Chat on WhatsApp"
                                    >
                                      <MessageSquare className="h-4 w-4" />
                                      <span className="sr-only">Chat on WhatsApp</span>
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => openWhatsApp(e, lead.phone, lead.name, lead.propertyName)}>
                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                WhatsApp
                                            </DropdownMenuItem>
                                            {viewAsRole === 'admin' && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteLead(lead.id, lead.name)}
                                                        className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Lead
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
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

    