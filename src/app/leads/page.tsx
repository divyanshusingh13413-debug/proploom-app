'use client';

import { useState } from 'react';
import { leads, agents } from '@/lib/data';
import type { Lead, Agent } from '@/lib/types';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ChevronRight, UserPlus, FileText, Activity, MessageSquare } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const statusStyles: Record<string, string> = {
  New: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
  'Follow-up Due': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
  'Meeting Today': 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
};

const StatsCard = ({ title, value, subtitle, color, icon: Icon }: { title: string, value: string, subtitle: string, color: string, icon: React.ElementType }) => (
    <Card className={`bg-gradient-to-br ${color} text-white`}>
        <CardHeader>
            <CardDescription className="text-white/80">{title}</CardDescription>
            <CardTitle className="text-4xl font-bold flex justify-between items-center">
                {value}
                <Icon className="w-8 h-8 opacity-50" />
            </CardTitle>
            <p className="text-xs text-white/70">{subtitle}</p>
        </CardHeader>
    </Card>
);

const LeadJourney = ({ lead }: { lead: Lead | null }) => {
    if (!lead) return null;
    const agent = agents.find(a => a.id === lead.agentId);

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
                        <AvatarImage src={agent?.avatarUrl} />
                        <AvatarFallback>{lead.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.id.toUpperCase()}</p>
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
                    <Button className="bg-secondary hover:bg-secondary/90">WhatsApp</Button>
                </div>
            </CardContent>
             <div className="p-6 pt-0 text-right">
                <Button variant="link" className="text-primary">Share on WhatsApp <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
        </Card>
    )
}

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[1]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Leads Management
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="NEW LEADS TODAY" value="18" subtitle="from all channels" color="from-primary to-blue-700" icon={UserPlus} />
        <StatsCard title="ASSIGNED TO ME" value="5" subtitle="Follow-ups pending" color="from-accent to-yellow-600" icon={UserPlus} />
        <StatsCard title="PRIORITY HOT LEADS" value="3" subtitle="Immediate action needed" color="from-secondary to-green-700" icon={UserPlus} />
      </div>
      
      <Tabs defaultValue="all">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Lead List & Smart Filters</CardTitle>
                    <div className="flex items-center gap-2">
                        <TabsList>
                            <TabsTrigger value="all">All Leads</TabsTrigger>
                            <TabsTrigger value="my">My Leads</TabsTrigger>
                        </TabsList>
                        <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <TabsContent value="all">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Agent</TableHead>
                            <TableHead className="text-center">AI Score</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {leads.map((lead) => {
                            const agent = agents.find(a => a.id === lead.agentId);
                            return (
                                <TableRow key={lead.id} className="transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                                    <TableCell className="font-medium">{lead.name}</TableCell>
                                    <TableCell>{lead.source}</TableCell>
                                    <TableCell>
                                        <Badge className={statusStyles[lead.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{agent?.name || 'Unassigned'}</TableCell>
                                    <TableCell className="text-center font-semibold">{lead.aiScore || '-'}</TableCell>
                                    <TableCell>{lead.lastContact}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        </TableBody>
                    </Table>
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
