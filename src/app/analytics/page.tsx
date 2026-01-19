
'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, TrendingUp, Bell, Loader2, Users2, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Lead } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    const uid = sessionStorage.getItem('userId');
    
    if (!role || !uid) {
      setIsLoading(false);
      return;
    }

    let leadsQuery;
    if (role === 'admin') {
      leadsQuery = query(collection(db, "leads"), orderBy("timestamp", "desc"));
    } else { // Agent
      leadsQuery = query(collection(db, "leads"), where("assignedAgentId", "==", uid), orderBy("timestamp", "desc"));
    }

    const unsubscribe = onSnapshot(leadsQuery, (querySnapshot) => {
      const leadsData: Lead[] = [];
      querySnapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(leadsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching leads for analytics:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const {
    totalLeads,
    conversionRate,
    pendingFollowUps,
    recentLeads,
    monthlySalesData
  } = useMemo(() => {
    const totalLeads = leads.length;
    const hotLeads = leads.filter(l => (l.aiScore || 0) >= 70).length;
    const conversionRate = totalLeads > 0 ? Math.round((hotLeads / totalLeads) * 100) : 0;
    const pendingFollowUps = leads.filter(l => l.status === 'Follow-up Due').length;
    const recentLeads = leads.slice(0, 5);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months: {month: string, sales: number}[] = [];
    const today = new Date();
    for(let i=5; i>=0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        last6Months.push({ month: monthNames[d.getMonth()], sales: 0 });
    }

    leads.forEach(lead => {
        if (lead.timestamp && lead.status === 'Closed') {
            const date = lead.timestamp.toDate();
            const monthName = monthNames[date.getMonth()];
            const monthIndex = last6Months.findIndex(m => m.month === monthName);
            if (monthIndex > -1) {
                last6Months[monthIndex].sales += (lead.budget || 0);
            }
        }
    });

    return { totalLeads, hotLeads, conversionRate, pendingFollowUps, recentLeads, monthlySalesData: last6Months };
  }, [leads]);


  const getLeadStatusForScoring = (lead: Lead) => {
    if (lead.aiScore && lead.aiScore >= 90) return { text: 'High Probability', style: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (lead.aiScore && lead.aiScore >= 70) return { text: 'Warm', style: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    if (lead.status === 'New') return { text: 'New', style: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    return { text: 'Cold', style: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  }
  
  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          AI Analytics Hub
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Deep insights into your real estate business, powered by AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Active Leads</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : <div className="text-2xl font-bold">{totalLeads}</div>}
            <p className="text-xs text-muted-foreground">
              Across all channels
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lead Conversion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : <div className="text-2xl font-bold">{conversionRate}%</div>}
            <p className="text-xs text-muted-foreground">
              Based on AI scoring model
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : <div className="text-2xl font-bold">{pendingFollowUps}</div>}
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>AI-Powered Lead Scoring</CardTitle>
            <CardDescription>Latest leads ranked by their conversion probability.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
            ) : recentLeads.length > 0 ? (
                 <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>AI Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Property Interest</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLeads.map((lead) => {
                      const leadStatus = getLeadStatusForScoring(lead);
                      return (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                                {lead.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{lead.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-lg text-foreground">{lead.aiScore || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={leadStatus.style}>
                            {leadStatus.text}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{lead.propertyName}</TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-16 border-2 border-dashed rounded-lg">
                    <Users2 className="h-12 w-12 mb-4 text-muted-foreground/50"/>
                    <p className="font-medium">No Real-time Data Available</p>
                    <p className="text-sm">Add new leads to see analytics here.</p>
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Sales Performance</CardTitle>
            <CardDescription>Based on closed deals from the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : monthlySalesData.reduce((acc, curr) => acc + curr.sales, 0) > 0 ? (
                 <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`}/>
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--accent))', opacity: 0.5 }}
                      contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-[300px] border-2 border-dashed rounded-lg p-4">
                  <DollarSign className="h-12 w-12 mb-4 text-muted-foreground/50"/>
                  <p className="font-medium">No Sales Data</p>
                  <p className="text-sm">Close deals to see sales performance here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
